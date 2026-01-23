import { Can } from "@components/Permissions/Can";
import { MODULE_PERMISSIONS } from "@core/permissions";
import { CustomButton, CustomIcon } from "@components/common";
import "./ModulesHeader.scss";

export const ModulesHeader = ({ onNewModule }) => {
  return (
    <header className="modules-header">
      <div>
        <h1 className="modules-header__title">Gestión de Módulos</h1>
        <p className="modules-header__subtitle">Administra los módulos de atención</p>
      </div>

      <Can permission={MODULE_PERMISSIONS.CREATE}>
        <CustomButton variant="primary" onClick={onNewModule}>
          <CustomIcon name="mdi:plus" size="sm" />
          Nuevo Módulo
        </CustomButton>
      </Can>
    </header>
  );
};
