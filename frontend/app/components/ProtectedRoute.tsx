import { Navigate, useLocation } from "react-router";

import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isLoadingSession } = useAuth();

  if (isLoadingSession) {
    return <main className="page-shell">Cargando...</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
