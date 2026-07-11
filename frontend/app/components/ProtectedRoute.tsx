import { Navigate } from "react-router";

import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoadingSession } = useAuth();

  if (isLoadingSession) {
    return <main className="page-shell">Cargando...</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
