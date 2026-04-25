import { CustomButton, CustomInput, CustomModal, CustomSelect } from "@components/common";
import "./ModuleFormModal.scss";

export const ModuleFormModal = ({
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
  optionsMap = {},
  control,
  setValue,
}) => {
  const renderField = (field) => {
    const fieldClass = ["module-form-modal__field", field.full && "module-form-modal__field--full"].filter(Boolean).join(" ");

    // Checkbox
    if (field.type === "checkbox") {
      return (
        <div key={field.name} className={fieldClass}>
          <label className="module-form-modal__checkbox">
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

    // Number
    if (field.type === "number") {
      return (
        <div key={field.name} className={fieldClass}>
          <CustomInput
            label={field.label}
            type="number"
            min={0}
            required={field.required}
            error={errors[field.name]?.message}
            {...register(field.name, {
              setValueAs: (v) => (v === "" ? null : Number(v)),
            })}
            onChange={(e) =>
              setValue?.(field.name, e.target.value === "" ? null : Number(e.target.value), { shouldValidate: true })
            }
          />
          {field.hint && <p className="module-form-modal__hint">{field.hint}</p>}
        </div>
      );
    }

    // Input (default)
    return (
      <div key={field.name} className={fieldClass}>
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
    <CustomModal isOpen={isOpen} onClose={onClose} title={mode === "edit" ? "Editar Módulo" : "Nuevo Módulo"} size="lg">
      <form className="module-form-modal__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="module-form-modal__grid">{FORM_FIELDS.map(renderField)}</div>

        <div className="module-form-modal__actions">
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton type="submit" disabled={isDisabled || isSubmitting}>
            {isSubmitting ? "Guardando..." : mode === "edit" ? "Actualizar Módulo" : "Guardar Módulo"}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};
