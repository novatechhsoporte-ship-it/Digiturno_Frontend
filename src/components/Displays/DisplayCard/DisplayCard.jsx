import { CustomButton, CustomIcon } from "@components/common";
import "./DisplayCard.scss";

export const DisplayCard = ({ display, onEdit, onDelete }) => {
  const { name, type, location, tenantId, moduleIds, status } = display;
  const tenantName = tenantId?.name || "Sin notaría";

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Activo";
      case "pending":
        return "Pendiente";
      case "blocked":
        return "Bloqueado";
      default:
        return status;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "TV":
        return "mdi:television";
      case "KIOSK":
        return "mdi:monitor";
      case "TABLET":
        return "mdi:tablet";
      default:
        return "mdi:monitor";
    }
  };

  return (
    <div className="display-card">
      <div className="display-card__header">
        <div className="display-card__info">
          <div className="display-card__title-row">
            <CustomIcon name={getTypeIcon(type)} size="md" className="display-card__type-icon" />
            <h3 className="display-card__name">{name}</h3>
          </div>
          {tenantName && <p className="display-card__tenant">Notaría: {tenantName}</p>}
        </div>

        <span className={`display-card__status display-card__status--${status}`}>{getStatusLabel(status)}</span>
      </div>

      <div className="display-card__body">
        {location && (
          <div className="display-card__detail">
            <CustomIcon name="mdi:map-marker" size="sm" />
            <span>{location}</span>
          </div>
        )}

        <div className="display-card__detail">
          <CustomIcon name="mdi:clock-outline" size="sm" />
          <span>Última conexión: {display.lastSeenAt ? new Date(display.lastSeenAt).toLocaleString() : "Nunca"}</span>
        </div>
      </div>

      <div className="display-card__actions">
        <CustomButton variant="outline" size="sm" onClick={() => onEdit?.(display)}>
          <CustomIcon name="mdi:pencil" size="sm" />
          Editar
        </CustomButton>
        <CustomButton variant="ghost" size="sm" onClick={() => onDelete?.(display)}>
          <CustomIcon name="mdi:delete" size="sm" />
          Eliminar
        </CustomButton>
      </div>
    </div>
  );
};
