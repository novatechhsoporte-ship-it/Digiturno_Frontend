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
  tenants,
  attendantOptions,
}) => {
  const renderField = (field) => {
    if (field.type === "checkbox") {
      return (
        <div key={field.name} className="module-form-modal__field module-form-modal__field--full">
          <label className="module-form-modal__checkbox">
            <input type="checkbox" {...register(field.name)} />
            <span>{field.label}</span>
          </label>
        </div>
      );
    }

    if (field.type === "select") {
      let options = [];
      if (field.name === "tenantId") {
        options = tenants.map((tenant) => ({
          value: tenant._id,
          label: tenant.name,
        }));
      } else if (field.name === "attendantId") {
        options = [...attendantOptions];
      }

      return (
        <div key={field.name} className={`module-form-modal__field ${field.full ? "module-form-modal__field--full" : ""}`}>
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

    return (
      <div key={field.name} className={`module-form-modal__field ${field.full ? "module-form-modal__field--full" : ""}`}>
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
