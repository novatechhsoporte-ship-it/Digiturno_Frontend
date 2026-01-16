import { ModulesHeader, ModulesFilters, ModuleFormModal, DeleteModuleModal, ModulesList } from "@components/Modules";
import { useModule } from "@hooks/";

import "./Modules.scss";

export const Modules = () => {
  const {
    // Data
    modules,
    tenants,
    attendantOptions,
    loading,

    // UI State
    showForm,
    showDeleteConfirm,
    selectedModule,
    FORM_FIELDS,
    mode,
    filters,

    // Form methods
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,

    // Actions
    handleShowForm,
    handleEditModule,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
    deleteModuleMutation,
  } = useModule();

  return (
    <section className="modules">
      <ModulesHeader onNewModule={handleShowForm} />

      <ModulesFilters filters={filters} tenants={tenants} onFilterChange={handleFilterChange} />

      <ModuleFormModal
        isOpen={showForm}
        onClose={handleShowForm}
        mode={mode}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        onSubmit={onSubmit}
        FORM_FIELDS={FORM_FIELDS}
        tenants={tenants}
        attendantOptions={attendantOptions}
      />

      <DeleteModuleModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        moduleName={selectedModule?.name}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteModuleMutation.isPending}
      />

      <ModulesList modules={modules} loading={loading} onEdit={handleEditModule} onDelete={handleAskDelete} />
    </section>
  );
};
