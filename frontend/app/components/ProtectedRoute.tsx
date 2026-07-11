import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingSession } = useAuth();

  useEffect(() => {
    if (!isLoadingSession && !isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isAuthenticated, isLoadingSession, location.pathname, navigate]);

  if (isLoadingSession) {
    return <main className="route-loading">Cargando...</main>;
  }

  if (!isAuthenticated) {
    return <main className="route-loading">Redirigiendo...</main>;
  }

  return children;
}
