import { useMemo } from "react";
import { CustomIcon } from "@components/common";
import { ROLE_LABELS } from "@schemas/Users";
import { useSettingsPermissions } from "./useSettingsPermissions";
import { AssignPermissionModal } from "./AssignPermissionModal";
import "./PermissionsPanel.scss";

export const PermissionsPanel = () => {
  const {
    publicPermissions,
    users,
    modules,
    isLoading,
    activeTab,
    setActiveTab,
    selectedEntity,
    isModalOpen,
    handleOpenAssignModal,
    handleCloseModal,
    handleAssignPermission,
    handleRemovePermission,
  } = useSettingsPermissions();

  const usersTable = useMemo(
    () => (
      <div className="permissions-table">
        <table>
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Permisos Extra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className="role-badge">
                    {user.roles && user.roles.length > 0 ? ROLE_LABELS[user.roles[0].name] || user.roles[0].name : "Usuario"}
                  </span>
                </td>
                <td>
                  <span className="count-badge">{user.publicPermissions?.length || 0}</span>
                </td>
                <td>
                  <button className="action-btn" onClick={() => handleOpenAssignModal(user, "user")}>
                    <CustomIcon name="mdi:pencil" size="sm" />
                    <span>Gestionar</span>
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    ),
    [users, handleOpenAssignModal]
  );

  const modulesTable = useMemo(
    () => (
      <div className="permissions-table">
        <table>
          <thead>
            <tr>
              <th>Nombre del Módulo</th>
              <th>Estado</th>
              <th>Permisos Extra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module._id || module.id}>
                <td>{module.name}</td>
                <td>
                  <span className={`status-badge ${module.active ? "active" : "inactive"}`}>
                    {module.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <span className="count-badge">{module.publicPermissions?.length || 0}</span>
                </td>
                <td>
                  <button className="action-btn" onClick={() => handleOpenAssignModal(module, "module")}>
                    <CustomIcon name="mdi:pencil" size="sm" />
                    <span>Gestionar</span>
                  </button>
                </td>
              </tr>
            ))}
            {modules.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-state">
                  No se encontraron módulos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    ),
    [modules, handleOpenAssignModal]
  );

  if (isLoading) {
    return (
      <div className="permissions-loading">
        <div className="spinner" />
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="permissions-panel">
      <div className="permissions-panel__header">
        <div className="title-section">
          <h2>Asignación de Permisos</h2>
          <p>Administra los permisos especiales otorgados directamente a usuarios o módulos.</p>
        </div>
      </div>

      <div className="permissions-tabs">
        <button className={`tab-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          <CustomIcon name="mdi:account-group" size="sm" />
          <span>Usuarios</span>
        </button>
        <button className={`tab-btn ${activeTab === "modules" ? "active" : ""}`} onClick={() => setActiveTab("modules")}>
          <CustomIcon name="mdi:view-module" size="sm" />
          <span>Módulos</span>
        </button>
      </div>

      <div className="permissions-panel__content">{activeTab === "users" ? usersTable : modulesTable}</div>

      <AssignPermissionModal
        isOpen={isModalOpen}
        selectedEntity={selectedEntity}
        publicPermissions={publicPermissions}
        onClose={handleCloseModal}
        onAssign={handleAssignPermission}
        onRemove={handleRemovePermission}
      />
    </div>
  );
};
