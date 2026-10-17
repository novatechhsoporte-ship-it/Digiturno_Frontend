import React, { useEffect, useState } from "react";
import { CustomIcon } from "@components/common/CustomIcon/CustomIcon";
import "./TurnCalledModal.scss";

/**
 * TurnCalledModal - Modal emergente de 2.5 a 3 segundos cuando un turno es llamado
 * @param {Object} props
 * @param {Object} props.ticket - Datos del turno ({ ticketNumber, customerName, moduleName, description, attendantName })
 * @param {number} props.duration - Tiempo en milisegundos antes de cerrarse (default: 3000ms)
 * @param {Function} props.onClose - Callback al expirar el tiempo o cerrar
 */
export const TurnCalledModal = ({ ticket, duration = 3000, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Iniciar cierre suave 350ms antes de desmontar
    const closeAnimTimer = setTimeout(() => {
      setIsClosing(true);
    }, Math.max(duration - 350, 1000));

    const endTimer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(closeAnimTimer);
      clearTimeout(endTimer);
    };
  }, [duration, onClose]);

  if (!ticket) return null;

  const ticketNumber = (ticket.ticketNumber || "---").toUpperCase();
  const customerName =
    ticket.customerName ||
    ticket.customerId?.fullName ||
    ticket.fullName ||
    "Usuario en espera";
  const moduleName =
    ticket.moduleName ||
    ticket.moduleId?.name ||
    ticket.serviceName ||
    "Módulo de Atención";
  const attendantName =
    ticket.description ||
    ticket.moduleId?.description ||
    ticket.attendantName ||
    "";

  return (
    <div
      className={`turn-called-overlay ${isClosing ? "turn-called-overlay--closing" : ""}`}
      onClick={onClose}
    >
      <div
        className="turn-called-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ "--modal-duration": `${duration}ms` }}
      >
        {/* Esquinas de diseño clásicas de NovaTech */}
        <div className="corner corner--tl" />
        <div className="corner corner--tr" />
        <div className="corner corner--bl" />
        <div className="corner corner--br" />

        {/* Encabezado con icono animado */}
        <div className="turn-called-modal__header">
          <div className="header-icon-wrap">
            <span className="pulse-ring" />
            <CustomIcon name="ic:round-spatial-audio" size="xl" className="icon" />
          </div>
          <span className="header-badge">¡LLAMADO DE TURNO!</span>
        </div>

        {/* Número de turno en tamaño gigante con brillo */}
        <div className="turn-called-modal__number-wrap">
          <div className="number">{ticketNumber}</div>
        </div>

        {/* Nombre del Usuario destacado */}
        <div className="turn-called-modal__customer">
          <span className="label">USUARIO</span>
          <h2 className="name">{customerName}</h2>
        </div>

        {/* Destino / Módulo */}
        <div className="turn-called-modal__destination">
          <div className="dest-icon">
            <CustomIcon name="ic:round-meeting-room" size="lg" />
          </div>
          <div className="dest-info">
            <span className="dest-label">FAVOR DIRIGIRSE A:</span>
            <span className="dest-module">{moduleName}</span>
            {attendantName && (
              <span className="dest-attendant">Asesor: {attendantName}</span>
            )}
          </div>
        </div>

        {/* Barra de progreso de tiempo (3 segundos) */}
        <div className="turn-called-modal__progress-bar">
          <div className="progress-fill" />
        </div>
      </div>
    </div>
  );
};
