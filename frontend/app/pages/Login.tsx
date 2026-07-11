import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import type { LoginCredentials } from "../types/auth";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/providers" replace />;
  }

  async function onSubmit(values: LoginCredentials) {
    setError("");
    setIsSubmitting(true);

    try {
      await login(values);
      const redirectTo =
        typeof location.state?.from === "string" ? location.state.from : "/providers";

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setError("Credenciales invalidas.");
      } else {
        setError("No fue posible iniciar sesion. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Provider Management</h1>
        <p>Inicia sesion para administrar proveedores.</p>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "El email es obligatorio.",
              })}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              {...register("password", {
                required: "El password es obligatorio.",
              })}
            />
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </label>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}
