import {
  DisplaysHeader,
  DisplaysFilters,
  DisplayFormModal,
  PairingCodeModal,
  DeleteDisplayModal,
  DisplaysList,
} from "@components/Displays";
import { useDisplay } from "@hooks/";

import "./Displays.scss";

export const Displays = () => {
  const {
    // Data
    displays,
    tenants,
    moduleOptions,
    loading,
    isSuperAdmin,

    // UI State
    showForm,
    showDeleteConfirm,
    showPairingModal,
    selectedDisplay,
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

    // Pairing form methods
    registerPairing,
    handleSubmitPairing,
    errorsPairing,
    isSubmittingPairing,
    isDisabledPairing,
    onSubmitPairingCode,

    // Actions
    handleShowForm,
    handleEditDisplay,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    setShowPairingModal,
    handleFilterChange,
    deleteDisplayMutation,
    setShowForm,
  } = useDisplay();

  return (
    <section className="displays">
      <DisplaysHeader onNewDisplay={handleShowForm} />

      <DisplaysFilters filters={filters} tenants={tenants} onFilterChange={handleFilterChange} isSuperAdmin={isSuperAdmin} />

      <PairingCodeModal
        isOpen={showPairingModal}
        onClose={() => setShowPairingModal(false)}
        registerPairing={registerPairing}
        handleSubmitPairing={handleSubmitPairing}
        errorsPairing={errorsPairing}
        isSubmittingPairing={isSubmittingPairing}
        isDisabledPairing={isDisabledPairing}
        onSubmitPairing={onSubmitPairingCode}
      />

      <DisplayFormModal
        isOpen={showForm}
        onClose={() => {
          setShowPairingModal(false);
          setShowForm(false);
        }}
        mode={mode}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        onSubmit={onSubmit}
        FORM_FIELDS={FORM_FIELDS}
        tenants={tenants}
        moduleOptions={moduleOptions}
        watch={watch}
        setValue={setValue}
        isSuperAdmin={isSuperAdmin}
      />

      <DeleteDisplayModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        displayName={selectedDisplay?.name}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteDisplayMutation.isPending}
      />

      <DisplaysList displays={displays} loading={loading} onEdit={handleEditDisplay} onDelete={handleAskDelete} />
    </section>
  );
};
