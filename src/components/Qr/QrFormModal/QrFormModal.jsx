import { CustomButton, CustomInput, CustomModal, CustomSelect } from "@components/common";
import "./QrFormModal.scss";

export const QrFormModal = ({
  isOpen,
  onClose,
  mode,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  isDisabled,
  onSubmit,
  FORM_FIELDS,
  tenants,
  watch,
  setValue,
  isSuperAdmin,
}) => {
  const renderField = (field) => {
    // Hide tenantId field if not super admin
    if (field.name === "tenantId" && !isSuperAdmin) {
      return null;
    }

    if (field.type === "select") {
      let options = [];
      if (field.name === "tenantId") {
        options = tenants.map((tenant) => ({
          value: tenant._id,
          label: tenant.name,
        }));
      }

      return (
        <div key={field.name} className={`qr-form-modal__field ${field.full ? "qr-form-modal__field--full" : ""}`}>
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

    if (field.type === "datetime-local") {
      return (
        <div key={field.name} className={`qr-form-modal__field ${field.full ? "qr-form-modal__field--full" : ""}`}>
          <CustomInput
            label={field.label}
            type="datetime-local"
            required={field.required}
            error={errors[field.name]?.message}
            placeholder={field.placeholder}
            {...register(field.name)}
          />
        </div>
      );
    }

    return (
      <div key={field.name} className={`qr-form-modal__field ${field.full ? "qr-form-modal__field--full" : ""}`}>
        <CustomInput
          label={field.label}
          type={field.type}
          required={field.required}
          error={errors[field.name]?.message}
          placeholder={field.placeholder}
          {...register(field.name)}
        />
      </div>
    );
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={mode === "edit" ? "Editar Código QR" : "Crear Código QR"} size="md">
      <form className="qr-form-modal" onSubmit={handleSubmit(onSubmit)}>
        <div className="qr-form-modal__fields">
          {FORM_FIELDS.map((field) => renderField(field))}
        </div>

        {mode === "edit" && (
          <div className="qr-form-modal__field">
            <label className="qr-form-modal__label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                {...register("isActive")}
                className="qr-form-modal__checkbox"
              />
              <span className="qr-form-modal__checkbox-label">Estado: Activo</span>
            </label>
          </div>
        )}

        <div className="qr-form-modal__actions">
          <CustomButton variant="outline" type="button" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton variant="primary" type="submit" disabled={isDisabled || isSubmitting}>
            {isSubmitting ? "Guardando..." : mode === "edit" ? "Actualizar" : "Crear"}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};

