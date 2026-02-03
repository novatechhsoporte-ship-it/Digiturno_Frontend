import { Can } from "@components/Permissions/Can";
import { SERVICE_PERMISSIONS } from "@core/permissions";
import { CustomButton, CustomIcon } from "@components/common";
import "./ServicesHeader.scss";

export const ServicesHeader = ({ onNewService }) => {
  return (
    <header className="services-header">
      <div>
        <h1 className="services-header__title">Gestión de Servicios</h1>
        <p className="services-header__subtitle">Administra los tipos de servicios disponibles</p>
      </div>

      <Can permission={SERVICE_PERMISSIONS.CREATE}>
        <CustomButton variant="primary" onClick={onNewService}>
          <CustomIcon name="mdi:plus" size="sm" />
          Nuevo Servicio
        </CustomButton>
      </Can>
    </header>
  );
};

