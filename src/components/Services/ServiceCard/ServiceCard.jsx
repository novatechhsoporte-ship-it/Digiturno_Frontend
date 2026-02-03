import React from "react";

import { Can } from "@components/Permissions/Can";
import { SERVICE_PERMISSIONS } from "@core/permissions";
import { CustomIcon, CustomButton } from "@components/common";

import "./ServiceCard.scss";

/**
 * ServiceCard Component
 *
 * @param {Object} service - Service data
 * @param {Function} onEdit - Edit callback
 * @param {Function} onDelete - Delete callback
 */
export const ServiceCard = ({ service, onEdit, onDelete }) => {
  const { name, description, tenantId, active } = service;
  const tenantName = tenantId?.name || "Sin notaría";

  return (
    <div className="service-card">
      {/* HEADER */}
      <div className="service-card__header">
        <div className="service-card__info">
          <h3 className="service-card__name">{name}</h3>
          {tenantName && <p className="service-card__tenant">Notaría: {tenantName}</p>}
        </div>

        <span className={`service-card__status ${active ? "service-card__status--active" : "service-card__status--inactive"}`}>
          {active ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* BODY */}
      <div className="service-card__body">
        {description && (
          <div className="service-card__detail">
            <CustomIcon name="mdi:information" size="sm" />
            <span>{description}</span>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="service-card__actions">
        <Can any={[SERVICE_PERMISSIONS.UPDATE, SERVICE_PERMISSIONS.MANAGE]}>
          <CustomButton variant="outline" size="sm" onClick={() => onEdit?.(service)}>
            <CustomIcon name="mdi:pencil" size="sm" />
            Editar
          </CustomButton>
        </Can>
        <Can any={[SERVICE_PERMISSIONS.DELETE, SERVICE_PERMISSIONS.MANAGE]}>
          <CustomButton variant="ghost" size="sm" onClick={() => onDelete?.(service)}>
            <CustomIcon name="mdi:delete" size="sm" />
            Eliminar
          </CustomButton>
        </Can>
      </div>
    </div>
  );
};

