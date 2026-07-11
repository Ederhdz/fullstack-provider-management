import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { ProviderForm } from "../components/ProviderForm";
import { ProviderTable } from "../components/ProviderTable";
import { useAuth } from "../context/AuthContext";
import * as providerService from "../services/provider.service";
import type { Provider, ProviderPayload } from "../types/provider";

export function Providers() {
  const { user, isAdmin, logout } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProviders = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await providerService.getProviders();
      setProviders(data);
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setError("Tu sesion expiro. Inicia sesion nuevamente.");
      } else {
        setError("No fue posible cargar los proveedores.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  async function handleCreate(payload: ProviderPayload) {
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const createdProvider = await providerService.createProvider(payload);
      setProviders((currentProviders) => [createdProvider, ...currentProviders]);
      setIsCreating(false);
      setMessage("Proveedor creado correctamente.");
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(requestError.response?.data?.message ?? "No fue posible crear el proveedor.");
      } else {
        setError("No fue posible crear el proveedor.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(payload: ProviderPayload) {
    if (!editingProvider) {
      return;
    }

    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const updatedProvider = await providerService.updateProvider(
        editingProvider.id,
        payload,
      );
      setProviders((currentProviders) =>
        currentProviders.map((provider) =>
          provider.id === updatedProvider.id ? updatedProvider : provider,
        ),
      );
      setEditingProvider(null);
      setMessage("Proveedor actualizado correctamente.");
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ?? "No fue posible actualizar el proveedor.",
        );
      } else {
        setError("No fue posible actualizar el proveedor.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  function startCreate() {
    setError("");
    setMessage("");
    setEditingProvider(null);
    setIsCreating(true);
  }

  function startEdit(provider: Provider) {
    setError("");
    setMessage("");
    setIsCreating(false);
    setEditingProvider(provider);
  }

  function closeForm() {
    setIsCreating(false);
    setEditingProvider(null);
  }

  return (
    <main className="page-shell">
      <header className="app-header">
        <div>
          <h1>Providers</h1>
          <p>
            {user?.name} · {user?.role}
          </p>
        </div>
        <button className="secondary" type="button" onClick={logout}>
          Salir
        </button>
      </header>

      <section className="content-section">
        <div className="section-header">
          <div>
            <h2>Listado</h2>
            <p>{isAdmin ? "Acceso administrador" : "Acceso de solo lectura"}</p>
          </div>
          {isAdmin && (
            <button type="button" onClick={startCreate}>
              Nuevo proveedor
            </button>
          )}
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {isAdmin && isCreating && (
          <section className="form-panel">
            <h3>Nuevo proveedor</h3>
            <ProviderForm
              isSubmitting={isSaving}
              submitLabel="Crear proveedor"
              onCancel={closeForm}
              onSubmit={handleCreate}
            />
          </section>
        )}

        {isAdmin && editingProvider && (
          <section className="form-panel">
            <h3>Editar proveedor</h3>
            <ProviderForm
              initialValues={editingProvider}
              isSubmitting={isSaving}
              submitLabel="Guardar cambios"
              onCancel={closeForm}
              onSubmit={handleUpdate}
            />
          </section>
        )}

        {isLoading ? (
          <div className="loading">Cargando proveedores...</div>
        ) : (
          <ProviderTable
            providers={providers}
            canManage={isAdmin}
            onEdit={startEdit}
            onDelete={() => setMessage("Eliminacion pendiente de implementar.")}
            onToggleStatus={() => setMessage("Cambio de estatus pendiente de implementar.")}
          />
        )}
      </section>
    </main>
  );
}
