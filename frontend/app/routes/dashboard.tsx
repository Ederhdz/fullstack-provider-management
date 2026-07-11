import type { Route } from "./+types/dashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard | Provider Management" }];
}

export default function DashboardRoute() {
  return (
    <ProtectedRoute>
      <main className="page-shell">Dashboard</main>
    </ProtectedRoute>
  );
}
