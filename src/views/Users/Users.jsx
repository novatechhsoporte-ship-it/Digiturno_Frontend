import { Can } from "@components/Permissions/Can";
import { USER_PERMISSIONS } from "@core/permissions";
import { CustomButton, CustomIcon, CustomInput, CustomModal, CustomSelect, CustomTable } from "@components/common";
import { useUsers } from "@hooks/Users/useUsers";
import { ROLE_LABELS } from "@schemas/Users";
import { UsersFilters } from "@components/users/UsersFilters";

import "./Users.scss";

export const Users = () => {
  const {
    //Props
    users,
    loading,
    showForm,
    showDeleteConfirm,
    selectedUser,
    FORM_FIELDS,
    mode,
    filters,
    tableActions,
    optionsMap,

    //methods
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    handleShowForm,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
  } = useUsers();

  const renderField = (field) => {
    const fieldKey = field.name;

    const commonProps = {
      label: field.label,
      fullWidth: field.full,
      error: errors[field.name]?.message,
      required: field.required,
      ...register(field.name),
    };

    if (field.type === "select") {
      return <CustomSelect key={fieldKey} {...commonProps} options={optionsMap[field.name] || []} />;
    }

    if (field.name === "password") {
      return (
        <CustomInput
          key={fieldKey}
          {...commonProps}
          type="password"
          icon="mdi:lock"
          label={mode === "edit" ? `${field.label} (dejar vacío para no cambiar)` : field.label}
          required={mode === "create" && field.required}
        />
      );
    }

    if (field.type === "email" || field.name === "email") {
      return <CustomInput key={fieldKey} {...commonProps} type="email" icon="mdi:email" />;
    }

    return <CustomInput key={fieldKey} {...commonProps} type={field.type || "text"} />;
  };

  const tableColumns = [
    { key: "fullName", label: "Nombre Completo" },
    { key: "email", label: "Email" },
    {
      key: "roles",
      label: "Rol",
      render: (user) => <span className="role-badge">{user.roles?.map((r) => ROLE_LABELS[r.name || r] || r).join(", ")}</span>,
    },
    {
      key: "tenantId",
      label: "Notaría",
      render: (user) => <span>{user.tenantId?.name || "Sin notaría"}</span>,
    },
    {
      key: "status",
      label: "Estado",
      render: (user) => (
        <span className={`status-badge ${user.status ? "active" : "inactive"}`}>{user.status ? "Activo" : "Inactivo"}</span>
      ),
    },
  ];

  return (
    <section className="users">
      {/* ================= HEADER ================= */}
      <header className="users__header">
        <div>
          <h1 className="users__title">Gestión de users</h1>
          <p className="users__subtitle">Administra los users del sistema</p>
        </div>

        <Can permission={USER_PERMISSIONS.CREATE}>
          <CustomButton variant="primary" onClick={handleShowForm}>
            <CustomIcon name="mdi:account-plus" size="sm" />
            Nuevo Usuario
          </CustomButton>
        </Can>
      </header>

      {/* ================= FILTERS ================= */}
      <UsersFilters filters={filters} optionsMap={optionsMap} handleFilterChange={handleFilterChange} />

      <CustomModal
        isOpen={showForm}
        onClose={handleShowForm}
        title={mode === "edit" ? `Editar Usuario` : `Nuevo Usuario`}
        size="lg"
      >
        <form className="users__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="users__grid">{FORM_FIELDS.map(renderField)}</div>

          <div className="users__actions">
            <CustomButton type="button" variant="outline" onClick={handleShowForm}>
              Cancelar
            </CustomButton>

            <CustomButton type="submit" disabled={isDisabled || isSubmitting}>
              {isSubmitting ? "Guardando..." : mode === "edit" ? "Actualizar Usuario" : "Guardar Usuario"}
            </CustomButton>
          </div>
        </form>
      </CustomModal>

      {/* ================= MODAL ELIMINAR ================= */}
      <CustomModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Eliminar Usuario" size="sm">
        <p>
          ¿Estás seguro de que deseas eliminar el usuario <strong>{selectedUser?.fullName}</strong>? Esta acción no se puede
          deshacer.
        </p>

        <div className="users__actions">
          <CustomButton variant="outline" onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </CustomButton>

          <Can any={[USER_PERMISSIONS.DELETE, USER_PERMISSIONS.MANAGE]}>
            <CustomButton variant="danger" onClick={handleConfirmDelete}>
              Eliminar
            </CustomButton>
          </Can>
        </div>
      </CustomModal>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="users users--state">Cargando users...</div>
      ) : (
        <CustomTable columns={tableColumns} data={users} actions={tableActions} className="users__table" />
      )}
    </section>
  );
};
