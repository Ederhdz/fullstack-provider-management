import type { Route } from "./+types/dashboard";
import { DashboardLayout } from "../components/DashboardLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard | Provider Management" }];
}

export default function DashboardRoute() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        <section className="content-section">
          <div className="empty-state">Resumen general del sistema.</div>
        </section>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
