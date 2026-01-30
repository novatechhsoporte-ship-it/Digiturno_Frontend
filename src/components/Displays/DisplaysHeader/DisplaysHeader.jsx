import { Can } from "@components/Permissions/Can";
import { CustomButton, CustomIcon } from "@components/common";
import "./DisplaysHeader.scss";

export const DisplaysHeader = ({ onNewDisplay }) => {
  return (
    <header className="displays-header">
      <div>
        <h1 className="displays-header__title">Gestión de Pantallas</h1>
        <p className="displays-header__subtitle">Administra las pantallas de visualización de turnos</p>
      </div>

      <Can any={["display.create", "display.manage"]}>
        <CustomButton variant="primary" onClick={onNewDisplay}>
          <CustomIcon name="mdi:plus" size="sm" />
          Registrar Pantalla
        </CustomButton>
      </Can>
    </header>
  );
};

