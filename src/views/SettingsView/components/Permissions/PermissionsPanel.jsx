import { CustomIcon } from "@components/common";
import { ROLE_LABELS } from "@schemas/Users";
import { useSettingsPermissions } from "./useSettingsPermissions";
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

  if (isLoading) {
    return (
      <div className="permissions-loading">
        <div className="spinner" />
        <p>Cargando información...</p>
      </div>
    );
  }

  const renderUsersTable = () => (
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
  );

  const renderModulesTable = () => (
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
  );

  const renderModal = () => {
    if (!isModalOpen || !selectedEntity) return null;
    const { type, data } = selectedEntity;
    const entityName = type === "user" ? data.fullName : data.name;

    return (
      <div className="permissions-modal-overlay">
        <div className="permissions-modal">
          <header className="permissions-modal__header">
            <h3>Gestionar Permisos: {entityName}</h3>
            <button className="close-btn" onClick={handleCloseModal}>
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
                            handleAssignPermission(perm._id);
                          } else {
                            handleRemovePermission(perm._id);
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

      <div className="permissions-panel__content">{activeTab === "users" ? renderUsersTable() : renderModulesTable()}</div>

      {renderModal()}
    </div>
  );
};
