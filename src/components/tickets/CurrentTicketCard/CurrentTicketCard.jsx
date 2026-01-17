import { CustomButton } from "@components/common";
import "./CurrentTicketCard.scss";

export const CurrentTicketCard = ({
  currentTicket,
  serviceTimer,
  onCompleteTicket,
  onAbandonTicket,
  isCompleting,
  isAbandoning,
}) => {
  if (!currentTicket) {
    return (
      <div className="current-ticket-card current-ticket-card--empty">
        <div className="current-ticket-card__icon">📋</div>
        <h3 className="current-ticket-card__title">No hay turno en proceso</h3>
        <p className="current-ticket-card__subtitle">Llame al siguiente turno para comenzar</p>
      </div>
    );
  }

  return (
    <div className="current-ticket-card">
      <div className="current-ticket-card__header">
        <div className="current-ticket-card__ticket-number">{currentTicket?.ticketNumber}</div>
        <div className="current-ticket-card__timer">
          <span className="current-ticket-card__timer-label">Tiempo de atención </span>
          <span className="current-ticket-card__timer-value">{serviceTimer}</span>
        </div>
      </div>

      <div className="current-ticket-card__body">
        <div className="current-ticket-card__customer">
          <div className="current-ticket-card__customer-name">{currentTicket?.customerId?.fullName || "N/A"}</div>
          <div className="current-ticket-card__customer-document">{currentTicket?.customerId?.documentNumber || ""}</div>
        </div>

        {currentTicket.moduleId?.name && (
          <div className="current-ticket-card__module">
            <span className="current-ticket-card__module-label">Módulo:</span>
            <span className="current-ticket-card__module-name">{currentTicket?.moduleId?.name}</span>
          </div>
        )}

        <div className="current-ticket-card__time">
          <span className="current-ticket-card__time-label">Iniciado:</span>
          <span className="current-ticket-card__time-value">{new Date(currentTicket?.startedAt).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="current-ticket-card__actions">
        <CustomButton
          variant="outline"
          onClick={() => onAbandonTicket(currentTicket?._id)}
          disabled={isAbandoning || isCompleting}
        >
          {isAbandoning ? "Abandonando..." : "Abandonar"}
        </CustomButton>
        <CustomButton
          variant="primary"
          onClick={() => onCompleteTicket(currentTicket?._id)}
          disabled={isCompleting || isAbandoning}
        >
          {isCompleting ? "Completando..." : "Completar Turno"}
        </CustomButton>
      </div>
    </div>
  );
};

