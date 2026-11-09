import { useEffect, useState, useMemo } from "react";
import { CustomButton, CustomModal, CustomSelect, CustomInput } from "@components/common";
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
  onOpenTransferModal,
  confirmTransferTicket,
  showTransferModal,
  setShowTransferModal,
  services = [],
}) => {
  const { can } = useAbility();

  // Real-time timer state
  const [serviceTimer, setServiceTimer] = useState(initialServiceTimer || "00:00");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [transferNotes, setTransferNotes] = useState("");
  const [transferError, setTransferError] = useState("");

  const convertUpper = (value) => value?.toUpperCase();

  const serviceOptions = useMemo(() => {
    const currentServiceId = currentTicket?.serviceTypeId?._id || currentTicket?.serviceTypeId;
    return services
      .filter((s) => s._id !== currentServiceId)
      .map((s) => ({
        value: s._id,
        label: `${s.name}${s.prefix ? ` (${s.prefix})` : ""}`,
      }));
  }, [services, currentTicket]);

  const handleStartTransferModal = () => {
    setSelectedServiceId("");
    setTransferNotes("");
    setTransferError("");
    if (onOpenTransferModal) {
      onOpenTransferModal(currentTicket?._id);
    }
  };

  const handleExecuteTransfer = () => {
    if (!selectedServiceId) {
      setTransferError("Por favor selecciona un servicio de destino");
      return;
    }
    if (confirmTransferTicket) {
      confirmTransferTicket(selectedServiceId, transferNotes);
    }
  };

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
          <div className="current-ticket-card__ticket-info">
            <div className="current-ticket-card__ticket-number">{convertUpper(currentTicket?.ticketNumber)}</div>
            {currentTicket?.isPriority && (
              <span className="current-ticket-card__priority-badge" title="Atención Prioritaria">
                ⚠️ Prioritario
              </span>
            )}
          </div>
          <div className="current-ticket-card__timer">
            <span className="current-ticket-card__timer-label">Tiempo de atención </span>
            <span className="current-ticket-card__timer-value">{serviceTimer}</span>
          </div>
        </div>

        <div className="current-ticket-card__body">
          <div className="current-ticket-card__customer-title">Datos del Cliente</div>
          <div className="current-ticket-card__customer-details">
            <div className="current-ticket-card__detail-item">
              <span className="current-ticket-card__detail-label">Nombre Completo:</span>
              <span className="current-ticket-card__detail-value">
                {convertUpper(currentTicket?.customerId?.fullName) || "N/A"}
              </span>
            </div>
            <div className="current-ticket-card__detail-item">
              <span className="current-ticket-card__detail-label">Identificación:</span>
              <span className="current-ticket-card__detail-value">
                {currentTicket?.customerId?.documentType || "CC"} - {currentTicket?.customerId?.documentNumber || "N/A"}
              </span>
            </div>
            <div className="current-ticket-card__detail-item">
              <span className="current-ticket-card__detail-label">Correo Electrónico:</span>
              <span className="current-ticket-card__detail-value">
                {currentTicket?.customerId?.email || "Sin registrar"}
              </span>
            </div>
            <div className="current-ticket-card__detail-item">
              <span className="current-ticket-card__detail-label">Teléfono:</span>
              <span className="current-ticket-card__detail-value">
                {currentTicket?.customerId?.phone || "Sin registrar"}
              </span>
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

              <CustomButton
                className="current-ticket-card__btn-cashier"
                onClick={() => onTransferToCashier(currentTicket?._id)}
                disabled={isCompleting || isAbandoning || isRecalling || isTransferring}
              >
                {isTransferring ? "Transfiriendo..." : "Dirigir a Caja"}
              </CustomButton>

          <CustomButton
            variant="outline"
            className="current-ticket-card__btn-transfer"
            onClick={handleStartTransferModal}
            disabled={isCompleting || isAbandoning || isRecalling || isTransferring}
          >
            Redireccionar
          </CustomButton>

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

      {/* Transfer to Any Service Modal */}
      <CustomModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Redireccionar Turno"
        size="md"
      >
        <div className="current-ticket-card__modal">
          <p className="current-ticket-card__modal-message">
            Transfiere el turno <strong>{currentTicket?.ticketNumber}</strong> a otro servicio o módulo.
          </p>

          <div className="current-ticket-card__transfer-info">
            ⏱️ <strong>Orden justo:</strong> El cliente conservará su hora original de llegada para no perder su puesto en la fila y se le asignará la letra <strong>'T'</strong> (transferido).
          </div>

          <div className="current-ticket-card__transfer-form">
            <CustomSelect
              label="Servicio de Destino"
              required
              options={serviceOptions}
              value={selectedServiceId}
              onChange={(e) => {
                setSelectedServiceId(e.target.value);
                setTransferError("");
              }}
              error={transferError}
              placeholder="Selecciona el servicio"
            />

            <CustomInput
              label="Motivo / Notas de la transferencia (Opcional)"
              placeholder="Ej: Trámite corresponde a escrituración..."
              value={transferNotes}
              onChange={(e) => setTransferNotes(e.target.value)}
            />
          </div>

          <div className="current-ticket-card__modal-actions">
            <CustomButton variant="outline" onClick={() => setShowTransferModal(false)}>
              Cancelar
            </CustomButton>
            <CustomButton
              variant="primary"
              onClick={handleExecuteTransfer}
              disabled={isTransferring}
            >
              {isTransferring ? "Redireccionando..." : "Confirmar"}
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </>
  );
};
