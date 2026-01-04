import React from "react";

import { Can } from "@components/Permissions/Can";
import { MODULE_PERMISSIONS } from "@core/permissions";
import { CustomButton, CustomIcon, CustomInput, CustomModal, CustomSelect } from "@components/common";
import { ModuleCard } from "@components/Modules/ModuleCard/ModuleCard";
import { useModule } from "@hooks/";

import "./Modules.scss";

export const Modules = () => {
  const {
    //Props
    modules,
    tenants,
    loading,
    showForm,
    showDeleteConfirm,
    selectedModule,
    FORM_FIELDS,
    mode,
    filters,

    //methods
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    handleShowForm,
    handleEditModule,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
  } = useModule();

  const renderField = (field) => {
    if (field.type === "checkbox") {
      return (
        <div key={field.name} className="modules__field modules__field--full">
          <label className="modules__checkbox">
            <input type="checkbox" {...register(field.name)} />
            <span>{field.label}</span>
          </label>
        </div>
      );
    }

    if (field.type === "select") {
      let options = [];
      if (field.name === "tenantId") {
        options = tenants.map((tenant) => ({
          value: tenant._id,
          label: tenant.name,
        }));
      } else if (field.name === "attendantId") {
        // TODO: Load attendants when needed
        options = [];
      }

      return (
        <div key={field.name} className={`modules__field ${field.full ? "modules__field--full" : ""}`}>
          <CustomSelect
            label={field.label}
            required={field.required}
            error={errors[field.name]?.message}
            options={options}
            {...register(field.name)}
          />
        </div>
      );
    }

    return (
      <div key={field.name} className={`modules__field ${field.full ? "modules__field--full" : ""}`}>
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
      return <div className="modules modules--state">Cargando módulos...</div>;
    }

    if (!modules.length) {
      return <div className="modules modules--state">No hay módulos registrados</div>;
    }

    return (
      <div className="modules__list">
        {modules.map((module) => (
          <ModuleCard key={module._id} module={module} onEdit={handleEditModule} onDelete={handleAskDelete} />
        ))}
      </div>
    );
  };

  return (
    <section className="modules">
      {/* ================= HEADER ================= */}
      <header className="modules__header">
        <div>
          <h1 className="modules__title">Gestión de Módulos</h1>
          <p className="modules__subtitle">Administra los módulos de atención</p>
        </div>

        <Can permission={MODULE_PERMISSIONS.CREATE}>
          <CustomButton variant="primary" onClick={handleShowForm}>
            <CustomIcon name="mdi:plus" size="sm" />
            Nuevo Módulo
          </CustomButton>
        </Can>
      </header>

      {/* ================= FILTERS ================= */}
      <div className="modules__filters">
        <div className="modules__filter-group">
          <CustomSelect
            label="Filtrar por Notaría"
            value={filters.tenantId}
            onChange={(e) => handleFilterChange("tenantId", e.target.value)}
            options={[
              { value: "", label: "Todas las notarías" },
              ...tenants.map((tenant) => ({
                value: tenant._id,
                label: tenant.name,
              })),
            ]}
          />
        </div>

        <div className="modules__filter-group">
          <CustomSelect
            label="Estado"
            value={filters.active}
            onChange={(e) => handleFilterChange("active", e.target.value)}
            options={[
              { value: "", label: "Todos" },
              { value: "true", label: "Activos" },
              { value: "false", label: "Inactivos" },
            ]}
          />
        </div>

        <div className="modules__filter-group modules__filter-group--search">
          <CustomInput
            label="Buscar"
            placeholder="Buscar por nombre o descripción..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      {/* ================= MODAL NEW ================= */}
      <CustomModal
        isOpen={showForm}
        onClose={handleShowForm}
        title={mode === "edit" ? `Editar Módulo` : `Nuevo Módulo`}
        size="lg"
      >
        <form className="modules__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="modules__grid">{FORM_FIELDS.map(renderField)}</div>

          <div className="modules__actions">
            <CustomButton type="button" variant="outline" onClick={handleShowForm}>
              Cancelar
            </CustomButton>

            <CustomButton type="submit" disabled={isDisabled || isSubmitting}>
              {isSubmitting ? "Guardando..." : mode === "edit" ? "Actualizar Módulo" : "Guardar Módulo"}
            </CustomButton>
          </div>
        </form>
      </CustomModal>

      {/* ================= MODAL ELIMINAR ================= */}
      <CustomModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Eliminar Módulo" size="sm">
        <p>
          ¿Estás seguro de que deseas eliminar el módulo <strong>{selectedModule?.name}</strong>? Esta acción no se puede
          deshacer.
        </p>

        <div className="modules__actions">
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
