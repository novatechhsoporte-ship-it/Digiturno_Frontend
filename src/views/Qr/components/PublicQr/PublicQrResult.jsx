import { CustomButton, CustomIcon } from "@components/common";

export const PublicQrResult = ({ ticket, service, customerName, onNewTicket }) => {
  return (
    <div className="public-qr__result fade-in scale-up">
      <div className="public-qr__result-content">
        <div className="public-qr__result-icon">
          <CustomIcon name="mdi:check-circle" size="xl" />
        </div>
        <h2 className="public-qr__result-title">¡Turno Generado exitosamente!</h2>

        <div className="public-qr__result-ticket-box">
          <p className="public-qr__result-ticket-label">Tu número de turno es:</p>
          <div className="public-qr__result-number">{ticket.ticketNumber}</div>
        </div>

        <p className="public-qr__result-message">Por favor presta atención a la pantalla para tu llamado.</p>

        <div className="public-qr__result-info">
          <div className="public-qr__result-info-row">
            <span>Servicio:</span>
            <strong>{service?.name}</strong>
          </div>
          <div className="public-qr__result-info-row">
            <span>A nombre de:</span>
            <strong>{customerName}</strong>
          </div>
        </div>

        <CustomButton variant="primary" size="lg" onClick={onNewTicket} className="public-qr__result-button">
          Solicitar Otro Turno
        </CustomButton>
      </div>
    </div>
  );
};
