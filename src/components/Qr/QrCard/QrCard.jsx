import { CustomButton, CustomIcon } from "@components/common";
import "./QrCard.scss";

export const QrCard = ({ qr, onEdit, onDelete }) => {
  const { publicToken, tenantId, isActive, expiresAt, createdAt, qrBase64, publicUrl } = qr;
  const tenantName = tenantId?.name || "Sin notaría";

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = expiresAt && new Date(expiresAt) < new Date();

  return (
    <div className="qr-card">
      <div className="qr-card__header">
        <div className="qr-card__info">
          <div className="qr-card__title-row">
            <CustomIcon name="mdi:qrcode" size="md" className="qr-card__icon" />
            <div>
              <h3 className="qr-card__token">Token: {publicToken}</h3>
              {tenantName && <p className="qr-card__tenant">Notaría: {tenantName}</p>}
            </div>
          </div>
        </div>

        <div className="qr-card__status-group">
          <span className={`qr-card__status qr-card__status--${isActive ? "active" : "inactive"}`}>
            {isActive ? "Activo" : "Inactivo"}
          </span>
          {isExpired && <span className="qr-card__status qr-card__status--expired">Expirado</span>}
        </div>
      </div>

      {qrBase64 && (
        <div className="qr-card__qr-image">
          <img src={qrBase64} alt="QR Code" />
        </div>
      )}

      {publicUrl && (
        <div className="qr-card__url">
          <CustomIcon name="mdi:link" size="sm" />
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="qr-card__url-link">
            {publicUrl}
          </a>
        </div>
      )}

      <div className="qr-card__body">
        <div className="qr-card__detail">
          <CustomIcon name="mdi:calendar-plus" size="sm" />
          <span>Creado: {formatDate(createdAt)}</span>
        </div>

        {expiresAt && (
          <div className="qr-card__detail">
            <CustomIcon name="mdi:calendar-clock" size="sm" />
            <span>Expira: {formatDate(expiresAt)}</span>
          </div>
        )}
      </div>

      <div className="qr-card__actions">
        <CustomButton variant="outline" size="sm" onClick={() => onEdit?.(qr)}>
          <CustomIcon name="mdi:pencil" size="sm" />
          Editar
        </CustomButton>
        <CustomButton variant="ghost" size="sm" onClick={() => onDelete?.(qr)}>
          <CustomIcon name="mdi:delete" size="sm" />
          Eliminar
        </CustomButton>
      </div>
    </div>
  );
};

