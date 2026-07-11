import type { Route } from "./+types/providers";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Providers | Provider Management" }];
}

export default function ProvidersRoute() {
  return (
    <ProtectedRoute>
      <main className="page-shell">Cargando proveedores...</main>
    </ProtectedRoute>
  );
}
