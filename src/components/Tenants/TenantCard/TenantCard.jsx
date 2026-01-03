import React from "react";

import { Can } from "@components/Permissions/Can";
import { TENANT_PERMISSIONS } from "@core/permissions";
import { CustomIcon, CustomButton } from "@components/common";

import "./TenantCard.scss";

/**
 * TenantCard Component
 *
 * @param {Object} tenant - Tenant data
 * @param {Function} onEdit - Edit callback
 * @param {Function} onDelete - Delete callback
 */
export const TenantCard = ({ tenant, onEdit, onDelete }) => {
  const { name, taxId, status, address, city, phone, email, configuration } = tenant;

  const serviceHours = configuration?.serviceHours;

  return (
    <div className="tenant-card">
      {/* HEADER */}
      <div className="tenant-card__header">
        <div className="tenant-card__info">
          <h3 className="tenant-card__name">{name}</h3>
          {taxId && <p className="tenant-card__tax-id">Tax ID: {taxId}</p>}
        </div>

        <span className={`tenant-card__status ${status ? "tenant-card__status--active" : "tenant-card__status--inactive"}`}>
          {status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* BODY */}
      <div className="tenant-card__body">
        {address && (
          <div className="tenant-card__detail">
            <CustomIcon name="mdi:map-marker" size="sm" />
            <span>
              {address}
              {city && `, ${city}`}
            </span>
          </div>
        )}

        {phone && (
          <div className="tenant-card__detail">
            <CustomIcon name="mdi:phone" size="sm" />
            <span>{phone}</span>
          </div>
        )}

        {email && (
          <div className="tenant-card__detail">
            <CustomIcon name="mdi:email" size="sm" />
            <span>{email}</span>
          </div>
        )}

        {serviceHours && (
          <div className="tenant-card__detail">
            <CustomIcon name="mdi:clock-outline" size="sm" />
            <span>
              {serviceHours.start} – {serviceHours.end}
            </span>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="tenant-card__actions">
        <Can any={[TENANT_PERMISSIONS.UPDATE, TENANT_PERMISSIONS.MANAGE]}>
          <CustomButton variant="outline" size="sm" onClick={() => onEdit?.(tenant)}>
            <CustomIcon name="mdi:pencil" size="sm" />
            Editar
          </CustomButton>
        </Can>
        <Can any={[TENANT_PERMISSIONS.DELETE, TENANT_PERMISSIONS.MANAGE]}>
          <CustomButton variant="ghost" size="sm" onClick={() => onDelete?.(tenant)}>
            <CustomIcon name="mdi:delete" size="sm" />
            Eliminar
          </CustomButton>
        </Can>
      </div>
    </div>
  );
};
