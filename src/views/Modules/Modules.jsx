import { ModulesHeader, ModulesFilters, ModuleFormModal, DeleteModuleModal, ModulesList } from "@components/Modules";
import { useModule } from "@hooks/";

import "./Modules.scss";

export const Modules = () => {
  const {
    // Data
    modules,
    tenants,
    optionsMap,
    loading,

    // UI State
    showForm,
    showDeleteConfirm,
    selectedModule,
    FORM_FIELDS,
    mode,
    filters,

    // Form methods
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    setValue,

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
        control={control}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        onSubmit={onSubmit}
        FORM_FIELDS={FORM_FIELDS}
        tenants={tenants}
        optionsMap={optionsMap}
        setValue={setValue}
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
