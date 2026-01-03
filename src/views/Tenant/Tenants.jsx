import React from "react";

import { Can } from "@components/Permissions/Can";
import { TENANT_PERMISSIONS } from "@core/permissions/";
import { CustomButton, CustomIcon, CustomInput, CustomModal } from "@components/common";
import { TenantCard } from "@components/Tenants/TenantCard/TenantCard";
import { useTenant } from "@hooks/";

import "./Tenants.scss";

export const Tenants = () => {
  const {
    //Props
    tenants,
    loading,
    showForm,
    showDeleteConfirm,
    selectedTenant,
    FORM_FIELDS,
    mode,

    //methods
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    handleShowForm,
    handleEditTenant,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
  } = useTenant();

  const renderField = (field) => {
    if (field.type === "checkbox") {
      return (
        <div key={field.name} className="tenants__field tenants__field--full">
          <label className="tenants__checkbox">
            <input type="checkbox" {...register(field.name)} />
            <span>{field.label}</span>
          </label>
        </div>
      );
    }

    return (
      <div key={field.name} className="tenants__field">
        <CustomInput
          label={field.label}
          type={field.type || "text"}
          required={field.required}
          error={errors[field.name]?.message}
          {...register(field.name)}
        />
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="tenants tenants--state">Cargando notarías...</div>;
    }

    if (!tenants.length) {
      return <div className="tenants tenants--state">No hay notarías registradas</div>;
    }

    return (
      <div className="tenants__list">
        {tenants.map((tenant) => (
          <TenantCard key={tenant._id} tenant={tenant} onEdit={handleEditTenant} onDelete={handleAskDelete} />
        ))}
      </div>
    );
  };

  return (
    <section className="tenants">
      {/* ================= HEADER ================= */}
      <header className="tenants__header">
        <div>
          <h1 className="tenants__title">Gestión de Notarías</h1>
          <p className="tenants__subtitle">Administra las notarías del sistema</p>
        </div>

        <Can permission={TENANT_PERMISSIONS.CREATE}>
          <CustomButton variant="primary" onClick={handleShowForm}>
            <CustomIcon name="mdi:plus" size="sm" />
            Nueva Notaría
          </CustomButton>
        </Can>
      </header>

      {/* ================= MODAL NEW ================= */}
      <CustomModal
        isOpen={showForm}
        onClose={handleShowForm}
        title={mode === "edit" ? `Editar Notaría` : `Nueva Notaría`}
        size="lg"
      >
        <form className="tenants__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="tenants__grid">{FORM_FIELDS.map(renderField)}</div>

          <div className="tenants__actions">
            <CustomButton type="button" variant="outline" onClick={handleShowForm}>
              Cancelar
            </CustomButton>

            <CustomButton type="submit" disabled={isDisabled || isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Notaría"}
            </CustomButton>
          </div>
        </form>
      </CustomModal>

      {/* ================= MODAL ELIMINAR ================= */}
      <CustomModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Eliminar Notaría" size="sm">
        <p>
          ¿Estás seguro de que deseas eliminar la notaría <strong>{selectedTenant?.name}</strong>? Esta acción no se puede
          deshacer.
        </p>

        <div className="tenants__actions">
          <CustomButton variant="outline" onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </CustomButton>

          <CustomButton variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </CustomButton>
        </div>
      </CustomModal>

      {/* ================= CONTENT ================= */}
      {renderContent()}
    </section>
  );
};
