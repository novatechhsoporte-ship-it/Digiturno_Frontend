import { ServicesHeader, ServicesFilters, ServiceFormModal, DeleteServiceModal, ServicesList } from "@components/Services";
import { useServices } from "@hooks/";

import "./Services.scss";

export const Services = () => {
  const {
    // Data
    services,
    tenants,
    loading,
    isSuperAdmin,

    // UI State
    showForm,
    showDeleteConfirm,
    selectedService,
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
    watch,
    setValue,

    // Actions
    handleShowForm,
    handleEditService,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
    setShowForm,
    isDeleting,
  } = useServices();

  return (
    <section className="services">
      <ServicesHeader onNewService={handleShowForm} />

      <ServicesFilters filters={filters} tenants={tenants} onFilterChange={handleFilterChange} isSuperAdmin={isSuperAdmin} />

      <ServiceFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        mode={mode}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        onSubmit={onSubmit}
        FORM_FIELDS={FORM_FIELDS}
        tenants={tenants}
        isSuperAdmin={isSuperAdmin}
        watch={watch}
        setValue={setValue}
      />

      <DeleteServiceModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        serviceName={selectedService?.name}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <ServicesList services={services} loading={loading} onEdit={handleEditService} onDelete={handleAskDelete} />
    </section>
  );
};

