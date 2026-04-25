import React from "react";
import { CustomIcon } from "@components/common";

export const AssignPermissionModal = ({ isOpen, selectedEntity, publicPermissions, onClose, onAssign, onRemove }) => {
  if (!isOpen || !selectedEntity) return null;

  const { type, data } = selectedEntity;
  const entityName = type === "user" ? data.fullName : data.name;

  return (
    <div className="permissions-modal-overlay">
      <div className="permissions-modal">
        <header className="permissions-modal__header">
          <h3>Gestionar Permisos: {entityName}</h3>
          <button className="close-btn" onClick={onClose}>
            <CustomIcon name="mdi:close" size="sm" />
          </button>
        </header>

        <div className="permissions-modal__body">
          <p className="description">
            Habilita o deshabilita los permisos públicos adicionales para este {type === "user" ? "usuario" : "módulo"}.
          </p>

          <div className="permissions-list">
            {publicPermissions.map((perm) => {
              const hasPermission = data.publicPermissions?.some((p) => p._id === perm._id || p === perm._id);

              return (
                <div key={perm._id} className="permission-item">
                  <div className="permission-info">
                    <strong>{perm.displayName}</strong>
                    <span>{perm.description}</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={hasPermission}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onAssign(perm._id);
                        } else {
                          onRemove(perm._id);
                        }
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              );
            })}
            {publicPermissions.length === 0 && <div className="empty-state">No hay permisos públicos configurados.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
