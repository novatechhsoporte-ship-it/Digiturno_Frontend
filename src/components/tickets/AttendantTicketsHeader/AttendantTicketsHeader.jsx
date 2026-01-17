import { CustomButton, CustomIcon } from "@components/common";
import "./AttendantTicketsHeader.scss";

export const AttendantTicketsHeader = ({ canCallNext, handleCallNextTicket, isCallingNext, totalPending }) => {
  return (
    <header className="attendant-tickets-header">
      <div>
        <h1 className="attendant-tickets-header__title">Gestión de Turnos</h1>
        <p className="attendant-tickets-header__subtitle">
          {totalPending > 0 ? `${totalPending} turnos pendientes` : "No hay turnos pendientes"}
        </p>
      </div>

      {canCallNext && (
        <CustomButton
          className="attendant-tickets-header__btn"
          variant="primary"
          onClick={handleCallNextTicket}
          disabled={isCallingNext}
        >
          <CustomIcon name="mdi:phone" size="sm" />
          {isCallingNext ? "Llamando..." : "Llamar Siguiente Turno"}
        </CustomButton>
      )}

      {!canCallNext && (
        <div className="attendant-tickets-header__blocked">
          <CustomIcon name="mdi:lock" size="sm" />
          <span>Turno en proceso</span>
        </div>
      )}
    </header>
  );
};

