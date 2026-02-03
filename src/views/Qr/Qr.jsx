import { QrHeader, QrFilters, QrFormModal, DeleteQrModal, QrList } from "@components/Qr";
import { useQr } from "@hooks/";

import "./Qr.scss";

export const Qr = () => {
  const {
    // Data
    qrCodes,
    tenants,
    loading,
    isSuperAdmin,

    // UI State
    showForm,
    showDeleteConfirm,
    selectedQr,
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
    handleEditQr,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
    deleteQrMutation,
    setShowForm,
  } = useQr();

  return (
    <section className="qr">
      <QrHeader onNewQr={handleShowForm} />

      <QrFilters filters={filters} tenants={tenants} onFilterChange={handleFilterChange} isSuperAdmin={isSuperAdmin} />

      <QrFormModal
        isOpen={showForm}
        onClose={() => {
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
        watch={watch}
        setValue={setValue}
        isSuperAdmin={isSuperAdmin}
      />

      <DeleteQrModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        qrToken={selectedQr?.publicToken}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteQrMutation.isPending}
      />

      <QrList qrCodes={qrCodes} loading={loading} onEdit={handleEditQr} onDelete={handleAskDelete} filters={filters} />
    </section>
  );
};

