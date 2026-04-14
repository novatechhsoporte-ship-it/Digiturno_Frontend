import { useEffect, useState } from "react";
import { CustomButton, CustomModal } from "@components/common";
import { useAbility } from "@hooks";
import "./CurrentTicketCard.scss";

export const CurrentTicketCard = ({
  currentTicket,
  serviceTimer: initialServiceTimer,
  onCompleteTicket,
  onAbandonTicket,
  onRecallTicket,
  isCompleting,
  isAbandoning,
  isRecalling,
  showCompleteConfirm,
  showAbandonConfirm,
  setShowCompleteConfirm,
  setShowAbandonConfirm,
  confirmCompleteTicket,
  confirmAbandonTicket,
  onTransferToCashier,
  isTransferring,
  showTransferConfirm,
  setShowTransferConfirm,
  confirmTransferToCashier,
}) => {
  const { can } = useAbility();

  // Real-time timer state
  const [serviceTimer, setServiceTimer] = useState(initialServiceTimer || "00:00");

  const convertUpper = (value) => value?.toUpperCase();

  // Update timer every second
  useEffect(() => {
    if (!currentTicket?.startedAt) {
      setServiceTimer("00:00");
      return;
    }

    const updateTimer = () => {
      const start = new Date(currentTicket.startedAt);
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);

      const minutes = Math.floor(diffSeconds / 60);
      const seconds = diffSeconds % 60;

      setServiceTimer(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentTicket?.startedAt]);

  if (!currentTicket?._id) {
    return (
      <div className="current-ticket-card current-ticket-card--empty">
        <div className="current-ticket-card__icon">📋</div>
        <h3 className="current-ticket-card__title">No hay turno en proceso</h3>
        <p className="current-ticket-card__subtitle">Llame al siguiente turno para comenzar</p>
      </div>
    );
  }

  return (
    <>
      <div className="current-ticket-card">
        <div className="current-ticket-card__header">
          <div className="current-ticket-card__ticket-number">{convertUpper(currentTicket?.ticketNumber)}</div>
          <div className="current-ticket-card__timer">
            <span className="current-ticket-card__timer-label">Tiempo de atención </span>
            <span className="current-ticket-card__timer-value">{serviceTimer}</span>
          </div>
        </div>

        <div className="current-ticket-card__body">
          <div className="current-ticket-card__customer">
            <div className="current-ticket-card__customer-name">
              Nombre: {convertUpper(currentTicket?.customerId?.fullName) || "N/A"}
            </div>
            <div className="current-ticket-card__customer-document">
              Numero de documento: {currentTicket?.customerId?.documentNumber || ""}
            </div>
          </div>

          {currentTicket.moduleId?.name && (
            <div className="current-ticket-card__module">
              <span className="current-ticket-card__module-label">Módulo:</span>
              <span className="current-ticket-card__module-name">{convertUpper(currentTicket?.moduleId?.name)}</span>
            </div>
          )}

          <div className="current-ticket-card__time">
            <span className="current-ticket-card__time-label">Iniciado:</span>
            <span className="current-ticket-card__time-value">{new Date(currentTicket?.startedAt).toLocaleTimeString()}</span>
          </div>

          {currentTicket.callCount > 0 && (
            <div className="current-ticket-card__call-count">
              <span className="current-ticket-card__call-count-label">Llamados:</span>
              <span className="current-ticket-card__call-count-value">{currentTicket.callCount}</span>
            </div>
          )}
        </div>

        <div className="current-ticket-card__actions">
          <CustomButton
            variant="outline"
            onClick={() => onAbandonTicket(currentTicket?._id)}
            disabled={isAbandoning || isCompleting || isRecalling}
          >
            {isAbandoning ? "Abandonando..." : "Abandonar"}
          </CustomButton>
          <CustomButton
            variant="secondary"
            onClick={() => onRecallTicket(currentTicket?._id)}
            disabled={isCompleting || isAbandoning || isRecalling || currentTicket.callCount >= 3 || isTransferring}
          >
            {isRecalling ? "Llamando..." : "Volver a Llamar"}
          </CustomButton>
          
          {can("public.transfer") && (
            <CustomButton
              className="current-ticket-card__btn-cashier"
              onClick={() => onTransferToCashier(currentTicket?._id)}
              disabled={isCompleting || isAbandoning || isRecalling || isTransferring}
            >
              {isTransferring ? "Transfiriendo..." : "Dirigir a Caja"}
            </CustomButton>
          )}

          <CustomButton
            variant="primary"
            onClick={() => onCompleteTicket(currentTicket?._id)}
            disabled={isCompleting || isAbandoning || isRecalling || isTransferring}
          >
            {isCompleting ? "Completando..." : "Completar Turno"}
          </CustomButton>
        </div>
      </div>

      {/* Complete Ticket Confirmation Modal */}
      <CustomModal isOpen={showCompleteConfirm} onClose={() => setShowCompleteConfirm(false)} title="Completar Turno" size="sm">
        <div className="current-ticket-card__modal">
          <p className="current-ticket-card__modal-message">
            ¿Estás seguro de que deseas completar el turno <strong>{currentTicket?.ticketNumber}</strong>?
          </p>
          <div className="current-ticket-card__modal-actions">
            <CustomButton variant="outline" onClick={() => setShowCompleteConfirm(false)}>
              Cancelar
            </CustomButton>
            <CustomButton variant="primary" onClick={() => confirmCompleteTicket()} disabled={isCompleting}>
              {isCompleting ? "Completando..." : "Completar"}
            </CustomButton>
          </div>
        </div>
      </CustomModal>

      {/* Abandon Ticket Confirmation Modal */}
      <CustomModal isOpen={showAbandonConfirm} onClose={() => setShowAbandonConfirm(false)} title="Abandonar Turno" size="sm">
        <div className="current-ticket-card__modal">
          <p className="current-ticket-card__modal-message">
            ¿Estás seguro de que deseas abandonar el turno <strong>{currentTicket?.ticketNumber}</strong>? Esta acción no se puede
            deshacer.
          </p>
          <div className="current-ticket-card__modal-actions">
            <CustomButton variant="outline" onClick={() => setShowAbandonConfirm(false)}>
              Cancelar
            </CustomButton>
            <CustomButton variant="danger" onClick={() => confirmAbandonTicket()} disabled={isAbandoning}>
              {isAbandoning ? "Abandonando..." : "Abandonar"}
            </CustomButton>
          </div>
        </div>
      </CustomModal>

      {/* Transfer to Cashier Confirmation Modal */}
      <CustomModal isOpen={showTransferConfirm} onClose={() => setShowTransferConfirm(false)} title="Dirigir a Caja" size="sm">
        <div className="current-ticket-card__modal">
          <p className="current-ticket-card__modal-message">
            ¿Estás seguro de que deseas transferir el turno <strong>{currentTicket?.ticketNumber}</strong> al módulo de <strong>Caja</strong>?
          </p>
          <div className="current-ticket-card__modal-actions">
            <CustomButton variant="outline" onClick={() => setShowTransferConfirm(false)}>
              Cancelar
            </CustomButton>
            <CustomButton className="current-ticket-card__btn-cashier" onClick={() => confirmTransferToCashier()} disabled={isTransferring}>
              {isTransferring ? "Transfiriendo..." : "Confirmar Transferencia"}
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </>
  );
};
