import type { Route } from "./+types/providers";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Providers } from "../pages/Providers";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Providers | Provider Management" }];
}

export default function ProvidersRoute() {
  return (
    <ProtectedRoute>
      <Providers />
    </ProtectedRoute>
  );
}
