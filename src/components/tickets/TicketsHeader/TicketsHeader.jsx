import { CustomButton, CustomIcon } from "@components/common";
import "./TicketsHeader.scss";

export const TicketsHeader = ({ showCreateButton, onShowCreateModal }) => {
  return (
    <header className="tickets-header">
      <div>
        <h1 className="tickets-header__title">Gestión de Turnos</h1>
        <p className="tickets-header__subtitle">Crear y administrar turnos de atención</p>
      </div>

      {showCreateButton && (
        <CustomButton variant="primary" onClick={onShowCreateModal}>
          <CustomIcon name="mdi:plus" size="sm" />
          Nuevo Turno
        </CustomButton>
      )}
    </header>
  );
};
