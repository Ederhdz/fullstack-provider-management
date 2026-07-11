import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { setUnauthorizedHandler } from "../api/axios";
import * as authService from "../services/auth.service";
import type { AuthUser, LoginCredentials } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoadingSession: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isJwtUsable(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  try {
    const payload = JSON.parse(window.atob(parts[1])) as { exp?: number };

    if (!payload.exp) {
      return true;
    }

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("user");
    }

    setToken(null);
    setUser(null);
  }, []);

  const logoutAndRedirect = useCallback(() => {
    logout();

    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }, [logout]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedToken = window.localStorage.getItem("accessToken");
    const savedUser = window.localStorage.getItem("user");

    if (savedToken && savedUser && isJwtUsable(savedToken)) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser) as AuthUser);
      } catch {
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("user");
      }
    } else {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("user");
    }

    setIsLoadingSession(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logoutAndRedirect);

    return () => setUnauthorizedHandler(null);
  }, [logoutAndRedirect]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);

    window.localStorage.setItem("accessToken", response.accessToken);
    window.localStorage.setItem("user", JSON.stringify(response.user));

    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "ADMIN",
      isLoadingSession,
      login,
      logout,
    }),
    [isLoadingSession, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
