import { CustomButton, CustomInput, CustomModal, CustomSelect } from "@components/common";
import "./ServiceFormModal.scss";

export const ServiceFormModal = ({
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
  isSuperAdmin,
  setValue,
}) => {
  const renderField = (field) => {
    // Checkbox
    if (field.type === "checkbox") {
      return (
        <div key={field.name} className="service-form-modal__field service-form-modal__field--full">
          <label className="service-form-modal__checkbox">
            <input type="checkbox" {...register(field.name)} />
            <span>{field.label}</span>
          </label>
        </div>
      );
    }

    // Select (tenantId)
    if (field.type === "select") {
      // Ocultar tenantId si NO es superAdmin
      if (field.name === "tenantId" && !isSuperAdmin) return null;

      const options = tenants.map((t) => ({ value: t._id, label: t.name }));

      return (
        <div key={field.name} className={`service-form-modal__field ${field.full ? "service-form-modal__field--full" : ""}`}>
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

    // Número — usamos onChange con setValue para garantizar que el valor sea number, no string
    if (field.type === "number") {
      return (
        <div key={field.name} className={`service-form-modal__field ${field.full ? "service-form-modal__field--full" : ""}`}>
          <CustomInput
            label={field.label}
            type="number"
            min={1}
            required={field.required}
            error={errors[field.name]?.message}
            {...register(field.name, {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            onChange={(e) => setValue(field.name, e.target.value === "" ? undefined : Number(e.target.value), { shouldValidate: true })}
          />
        </div>
      );
    }

    // Texto por defecto
    return (
      <div key={field.name} className={`service-form-modal__field ${field.full ? "service-form-modal__field--full" : ""}`}>
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

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={mode === "edit" ? "Editar Servicio" : "Nuevo Servicio"} size="lg">
      <form className="service-form-modal__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="service-form-modal__grid">{FORM_FIELDS.map(renderField).filter(Boolean)}</div>

        <div className="service-form-modal__actions">
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton type="submit" disabled={isDisabled || isSubmitting}>
            {isSubmitting ? "Guardando..." : mode === "edit" ? "Actualizar Servicio" : "Guardar Servicio"}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};

