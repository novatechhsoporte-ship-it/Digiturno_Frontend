import { CustomButton, CustomInput, CustomModal, CustomSelect } from "@components/common";
import "./DisplayFormModal.scss";

export const DisplayFormModal = ({
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
  moduleOptions,
  watch,
  setValue,
  isSuperAdmin,
}) => {
  const renderField = (field) => {
    // Hide tenantId field if not super admin
    if (field.name === "tenantId" && !isSuperAdmin) {
      return null;
    }

    // Hide pairingCode field when editing (only show when creating)
    if (field.name === "pairingCode" && mode === "edit") {
      return null;
    }

    if (field.type === "select") {
      let options = [];
      if (field.name === "tenantId") {
        options = tenants.map((tenant) => ({
          value: tenant._id,
          label: tenant.name,
        }));
      } else if (field.name === "type") {
        options = field.options || [];
      }

      return (
        <div key={field.name} className={`display-form-modal__field ${field.full ? "display-form-modal__field--full" : ""}`}>
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

    if (field.type === "multiselect") {
      const selectedModules = watch("moduleIds") || [];
      return (
        <div key={field.name} className={`display-form-modal__field ${field.full ? "display-form-modal__field--full" : ""}`}>
          <label className="display-form-modal__label">
            {field.label}
            {field.required && <span className="display-form-modal__required">*</span>}
          </label>
          <select
            multiple
            className={`display-form-modal__multiselect ${errors[field.name] ? "display-form-modal__multiselect--error" : ""}`}
            {...register(field.name)}
            value={selectedModules}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, (option) => option.value);
              setValue(field.name, values, { shouldValidate: true });
            }}
          >
            {moduleOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors[field.name] && <span className="display-form-modal__error">{errors[field.name].message}</span>}
          <p className="display-form-modal__hint">Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples módulos</p>
        </div>
      );
    }

    return (
      <div key={field.name} className={`display-form-modal__field ${field.full ? "display-form-modal__field--full" : ""}`}>
        <CustomInput
          label={field.label}
          type={field.type || "text"}
          required={field.required}
          error={errors[field.name]?.message}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          {...register(field.name)}
        />
        {field.hint && <p className="display-form-modal__hint">{field.hint}</p>}
      </div>
    );
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={mode === "edit" ? "Editar Pantalla" : "Registrar Pantalla"} size="lg">
      <form className="display-form-modal__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="display-form-modal__grid">{FORM_FIELDS.map(renderField)}</div>

        <div className="display-form-modal__actions">
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton type="submit" disabled={isDisabled || isSubmitting}>
            {isSubmitting ? "Guardando..." : mode === "edit" ? "Actualizar Pantalla" : "Registrar Pantalla"}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};
