import { QrHeader, QrFilters, QrFormModal, DeleteQrModal, QrList } from "@components/Qr";
import { useQr } from "@hooks/";
import { CustomButton, CustomIcon } from "@components/common";
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

      {isSuperAdmin ? (
        <>
          <QrFilters filters={filters} tenants={tenants} onFilterChange={handleFilterChange} isSuperAdmin={isSuperAdmin} />
          <QrList qrCodes={qrCodes} loading={loading} onEdit={handleEditQr} onDelete={handleAskDelete} filters={filters} />
        </>
      ) : (
        <div className="qr__admin-view">
          {loading ? (
            <div className="qr__loading">Cargando código QR...</div>
          ) : qrCodes.length > 0 ? (
            <div className="qr__admin-single">
              <div className="qr__admin-card">
                <img src={qrCodes[0].qrBase64} alt="QR Code" className="qr__admin-image" />
                <div className="qr__admin-details">
                  <p>
                    <strong>URL Pública:</strong>{" "}
                    <a href={qrCodes[0].publicUrl} target="_blank" rel="noreferrer">
                      {qrCodes[0].publicUrl}
                    </a>
                  </p>
                  <p>
                    <strong>Estado:</strong> {qrCodes[0].isActive ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>
              <CustomButton className={"qr__regenate"} variant="primary" onClick={handleShowForm}>
                <CustomIcon name="mdi:refresh" size="sm" />
                Regenerar Código QR
              </CustomButton>
            </div>
          ) : (
            <div className="qr__admin-empty">
              <p>No hay un código QR generado para esta notaría.</p>
              <CustomButton variant="primary" onClick={handleShowForm}>
                <CustomIcon name="mdi:qrcode-plus" size="sm" />
                Generar Código QR
              </CustomButton>
            </div>
          )}
        </div>
      )}

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
    </section>
  );
};
