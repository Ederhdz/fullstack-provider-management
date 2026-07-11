import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { DashboardLayout } from "../components/DashboardLayout";
import { ProviderForm } from "../components/ProviderForm";
import { ProviderTable } from "../components/ProviderTable";
import { useAuth } from "../context/AuthContext";
import * as providerService from "../services/provider.service";
import type {
  Provider,
  ProviderPayload,
  ProviderStatus,
  ProviderType,
} from "../types/provider";

type ProviderTypeFilter = "ALL" | ProviderType;
type ProviderStatusFilter = "ALL" | ProviderStatus;

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
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProviderTypeFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<ProviderStatusFilter>("ALL");
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

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleProviders = providers.filter((provider) => {
    const matchesSearch =
      !normalizedSearch ||
      [provider.businessName, provider.rfc, provider.email].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );

    if (!matchesSearch) {
      return false;
    }

    const matchesType = typeFilter === "ALL" || provider.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || provider.status === statusFilter;

    return matchesType && matchesStatus;
  });
  const hasLocalFilters =
    Boolean(normalizedSearch) || typeFilter !== "ALL" || statusFilter !== "ALL";

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

  async function confirmDelete() {
    if (!providerToDelete) {
      return;
    }

    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      await providerService.deleteProvider(providerToDelete.id);
      setProviders((currentProviders) =>
        currentProviders.filter(
          (currentProvider) => currentProvider.id !== providerToDelete.id,
        ),
      );
      setProviderToDelete(null);
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
            <button type="button" disabled={isSaving} onClick={startCreate}>
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

        <div className="toolbar">
          <label>
            Buscar
            <input
              type="search"
              placeholder="Nombre, RFC o email"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <label>
            Type
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as ProviderTypeFilter)}
            >
              <option value="ALL">All</option>
              <option value="PHYSICAL_PERSON">Physical</option>
              <option value="LEGAL_ENTITY">Legal</option>
            </select>
          </label>
          <label>
            Status
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ProviderStatusFilter)
              }
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          <div className="result-count">
            {visibleProviders.length} de {providers.length} proveedores
          </div>
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

        {providerToDelete && (
          <div className="dialog-backdrop" role="presentation">
            <section
              aria-labelledby="delete-provider-title"
              aria-modal="true"
              className="dialog"
              role="dialog"
            >
              <h3 id="delete-provider-title">Eliminar proveedor</h3>
              <p>
                Confirma que deseas eliminar "{providerToDelete.businessName}". Esta
                accion no se puede deshacer.
              </p>
              <div className="form-actions">
                <button
                  className="danger"
                  type="button"
                  disabled={isSaving}
                  onClick={confirmDelete}
                >
                  {isSaving ? "Eliminando..." : "Eliminar"}
                </button>
                <button
                  className="secondary"
                  type="button"
                  disabled={isSaving}
                  onClick={() => setProviderToDelete(null)}
                >
                  Cancelar
                </button>
              </div>
            </section>
          </div>
        )}

        {isLoading ? (
          <div className="loading">Cargando proveedores...</div>
        ) : (
          <ProviderTable
            providers={visibleProviders}
            canManage={isAdmin}
            isBusy={isSaving}
            emptyMessage={
              hasLocalFilters
                ? "No hay proveedores que coincidan con la busqueda o filtros."
                : "No hay proveedores registrados."
            }
            onEdit={startEdit}
            onDelete={setProviderToDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </section>
    </DashboardLayout>
  );
}
