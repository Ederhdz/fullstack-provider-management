import type { Provider } from "../types/provider";

type ProviderTableProps = {
  providers: Provider[];
  canManage: boolean;
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

export function ProviderTable({
  providers,
  canManage,
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
              <td>{providerTypeLabels[provider.type]}</td>
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
                      className="secondary"
                      type="button"
                      onClick={() => onEdit?.(provider)}
                    >
                      Editar
                    </button>
                    <button
                      className="secondary"
                      type="button"
                      onClick={() => onToggleStatus?.(provider)}
                    >
                      {provider.status === "ACTIVE" ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      className="danger"
                      type="button"
                      onClick={() => onDelete?.(provider)}
                    >
                      Eliminar
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
