import type { Route } from "./+types/login";
import { Login } from "../pages/Login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login | Provider Management" }];
}

export default function LoginRoute() {
  return <Login />;
}
