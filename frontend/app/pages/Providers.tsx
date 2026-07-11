import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { DashboardLayout } from "../components/DashboardLayout";
import { ProviderForm } from "../components/ProviderForm";
import { ProviderTable } from "../components/ProviderTable";
import { useAuth } from "../context/AuthContext";
import * as providerService from "../services/provider.service";
import type { Provider, ProviderPayload } from "../types/provider";

function getErrorMessage(requestError: unknown, fallback: string) {
  if (!axios.isAxiosError(requestError)) {
    return fallback;
  }

  const message = requestError.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return typeof message === "string" ? message : fallback;
}

export function Providers() {
  const { isAdmin } = useAuth();
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
        setError(getErrorMessage(requestError, "No fue posible cargar los proveedores."));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  const providerMetrics = {
    total: providers.length,
    active: providers.filter((provider) => provider.status === "ACTIVE").length,
    inactive: providers.filter((provider) => provider.status === "INACTIVE").length,
    physical: providers.filter((provider) => provider.type === "PHYSICAL_PERSON").length,
    legal: providers.filter((provider) => provider.type === "LEGAL_ENTITY").length,
  };

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
      setError(getErrorMessage(requestError, "No fue posible crear el proveedor."));
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
      setError(getErrorMessage(requestError, "No fue posible actualizar el proveedor."));
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

  async function handleDelete(provider: Provider) {
    const confirmed = window.confirm(
      `Eliminar proveedor "${provider.businessName}"? Esta accion no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      await providerService.deleteProvider(provider.id);
      setProviders((currentProviders) =>
        currentProviders.filter((currentProvider) => currentProvider.id !== provider.id),
      );
      setMessage("Proveedor eliminado correctamente.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "No fue posible eliminar el proveedor."));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleStatus(provider: Provider) {
    const nextStatus = provider.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const updatedProvider = await providerService.changeProviderStatus(
        provider.id,
        nextStatus,
      );
      setProviders((currentProviders) =>
        currentProviders.map((currentProvider) =>
          currentProvider.id === updatedProvider.id ? updatedProvider : currentProvider,
        ),
      );
      setMessage("Estatus actualizado correctamente.");
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "No fue posible cambiar el estatus del proveedor."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <DashboardLayout title="Providers">
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

        <div className="kpi-grid">
          <article className="kpi-card">
            <span>Total Providers</span>
            <strong>{providerMetrics.total}</strong>
          </article>
          <article className="kpi-card">
            <span>Active</span>
            <strong>{providerMetrics.active}</strong>
          </article>
          <article className="kpi-card">
            <span>Inactive</span>
            <strong>{providerMetrics.inactive}</strong>
          </article>
          <article className="kpi-card">
            <span>Physical Persons</span>
            <strong>{providerMetrics.physical}</strong>
          </article>
          <article className="kpi-card">
            <span>Legal Entities</span>
            <strong>{providerMetrics.legal}</strong>
          </article>
        </div>

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
            isBusy={isSaving}
            onEdit={startEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </section>
    </DashboardLayout>
  );
}
