import { CustomButton, CustomInput, CustomSelect, CustomModal } from "@components/common";
import "./GenericFormModal.scss";

export const GenericFormModal = ({
  isOpen,
  onClose,
  title,
  submitLabel,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  isDisabled,
  onSubmit,
  fields = [],
  optionsMap = {},
}) => {
  const renderField = (field) => {
    const fieldClass = ["generic-form-modal__field", field.full && "generic-form-modal__field--full"].filter(Boolean).join(" ");

    // Checkbox
    if (field.type === "checkbox") {
      return (
        <div key={field.name} className={fieldClass}>
          <label className="generic-form-modal__checkbox">
            <input type="checkbox" {...register(field.name)} />
            <span>{field.label}</span>
          </label>
        </div>
      );
    }

    // Select
    if (field.type === "select") {
      const options = optionsMap[field.optionsKey] || [];

      return (
        <div key={field.name} className={fieldClass}>
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

    // Input
    return (
      <div key={field.name} className={fieldClass}>
        <CustomInput
          label={field.label}
          type={field.type || "text"}
          placeholder={field.placeholder}
          required={field.required}
          error={errors[field.name]?.message}
          {...register(field.name)}
        />
      </div>
    );
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form className="generic-form-modal__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="generic-form-modal__grid">{fields.map(renderField)}</div>

        <div className="generic-form-modal__actions">
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton type="submit" disabled={isDisabled || isSubmitting}>
            {isSubmitting ? "Procesando..." : submitLabel}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};
