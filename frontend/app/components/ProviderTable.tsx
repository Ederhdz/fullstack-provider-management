import type { Provider } from "../types/provider";

type ProviderTableProps = {
  providers: Provider[];
  canManage: boolean;
  isBusy: boolean;
  onEdit?: (provider: Provider) => void;
  onDelete?: (provider: Provider) => void;
  onToggleStatus?: (provider: Provider) => void;
};

const providerTypeLabels: Record<Provider["type"], string> = {
  PHYSICAL_PERSON: "Persona fisica",
  LEGAL_ENTITY: "Persona moral",
};

const providerStatusLabels: Record<Provider["status"], string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
};

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 16.5V20h3.5L18.1 9.4l-3.5-3.5L4 16.5z" />
      <path d="M16 4.5 17.5 3 21 6.5 19.5 8 16 4.5z" />
    </svg>
  );
}

function StatusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5V2L7 7l5 5V9a5 5 0 1 1-4.6 7H4.2A8 8 0 1 0 12 5z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7 21h10l1-13H6l1 13z" />
      <path d="M9 4h6l1 2h4v2H4V6h4l1-2z" />
    </svg>
  );
}

export function ProviderTable({
  providers,
  canManage,
  isBusy,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProviderTableProps) {
  if (providers.length === 0) {
    return <div className="empty-state">No hay proveedores registrados.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Tipo</th>
            <th>RFC</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Estatus</th>
            {canManage && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.businessName}</td>
              <td>
                <span className={`type-badge ${provider.type.toLowerCase()}`}>
                  {providerTypeLabels[provider.type]}
                </span>
              </td>
              <td>{provider.rfc}</td>
              <td>{provider.email}</td>
              <td>{provider.phone}</td>
              <td>
                <span className={`status-pill ${provider.status.toLowerCase()}`}>
                  {providerStatusLabels[provider.status]}
                </span>
              </td>
              {canManage && (
                <td>
                  <div className="table-actions">
                    <button
                      className="icon-button secondary"
                      type="button"
                      disabled={isBusy}
                      aria-label={`Editar ${provider.businessName}`}
                      title="Editar"
                      onClick={() => onEdit?.(provider)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="icon-button secondary"
                      type="button"
                      disabled={isBusy}
                      aria-label={`Cambiar estatus de ${provider.businessName}`}
                      title={
                        provider.status === "ACTIVE" ? "Desactivar" : "Activar"
                      }
                      onClick={() => onToggleStatus?.(provider)}
                    >
                      <StatusIcon />
                    </button>
                    <button
                      className="icon-button danger"
                      type="button"
                      disabled={isBusy}
                      aria-label={`Eliminar ${provider.businessName}`}
                      title="Eliminar"
                      onClick={() => onDelete?.(provider)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
