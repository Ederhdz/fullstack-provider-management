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
          <div className="empty-state">
            Usa la seccion Providers para consultar y administrar proveedores.
          </div>
        </section>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
