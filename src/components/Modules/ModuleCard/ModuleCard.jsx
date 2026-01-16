import React from "react";

import { Can } from "@components/Permissions/Can";
import { MODULE_PERMISSIONS } from "@core/permissions";
import { CustomIcon, CustomButton } from "@components/common";

import "./ModuleCard.scss";

/**
 * ModuleCard Component
 *
 * @param {Object} module - Module data
 * @param {Function} onEdit - Edit callback
 * @param {Function} onDelete - Delete callback
 */
export const ModuleCard = ({ module, onEdit, onDelete }) => {
  const { name, description, tenantId, attendantId, active } = module;
  const tenantName = tenantId?.name || "Sin notaría";
  const attendantName = attendantId?.fullName || attendantId?.email || "Sin asignar";

  return (
    <div className="module-card">
      {/* HEADER */}
      <div className="module-card__header">
        <div className="module-card__info">
          <h3 className="module-card__name">{name}</h3>
          {tenantName && <p className="module-card__tenant">Notaría: {tenantName}</p>}
        </div>

        <span className={`module-card__status ${active ? "module-card__status--active" : "module-card__status--inactive"}`}>
          {active ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* BODY */}
      <div className="module-card__body">
        {description && (
          <div className="module-card__detail">
            <CustomIcon name="mdi:information" size="sm" />
            <span>{description}</span>
          </div>
        )}

        <div className="module-card__detail">
          <CustomIcon name="mdi:account" size="sm" />
          <span>Asesor: {attendantName}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="module-card__actions">
        <Can any={[MODULE_PERMISSIONS.UPDATE, MODULE_PERMISSIONS.MANAGE]}>
          <CustomButton variant="outline" size="sm" onClick={() => onEdit?.(module)}>
            <CustomIcon name="mdi:pencil" size="sm" />
            Editar
          </CustomButton>
        </Can>
        <Can any={[MODULE_PERMISSIONS.DELETE, MODULE_PERMISSIONS.MANAGE]}>
          <CustomButton variant="ghost" size="sm" onClick={() => onDelete?.(module)}>
            <CustomIcon name="mdi:delete" size="sm" />
            Eliminar
          </CustomButton>
        </Can>
      </div>
    </div>
  );
};
