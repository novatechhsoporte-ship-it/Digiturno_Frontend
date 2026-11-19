import { useMemo } from "react";
import { getTicketFormFields, DOCUMENT_TYPE_OPTIONS } from "@schemas/Tickets";
import { GenericFormModal } from "@components/GenericFormModal/GenericFormModal";
import "./CreateTicketModal.scss";

export const CreateTicketModal = ({
  isOpen,
  onClose,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  isDisabled,
  onCreateTicket,
  servicesMap,
  requireContact = true,
}) => {
  const fields = useMemo(() => getTicketFormFields(requireContact), [requireContact]);

  const banner = requireContact ? (
    <div className="generic-form-modal__banner generic-form-modal__banner--info">
      <span className="generic-form-modal__banner-icon">ℹ️</span>
      <span className="generic-form-modal__banner-text">
        <strong>Datos de contacto requeridos:</strong> Esta notaría exige registrar el número de teléfono celular para generar el turno.
      </span>
    </div>
  ) : (
    <div className="generic-form-modal__banner generic-form-modal__banner--agile">
      <span className="generic-form-modal__banner-icon">⚡</span>
      <span className="generic-form-modal__banner-text">
        <strong>Modo de atención ágil:</strong> Solo se requiere Cédula y Nombre. El teléfono y correo son opcionales.
      </span>
    </div>
  );

  return (
    <GenericFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Turno"
      banner={banner}
      submitLabel="Crear Turno"
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      isSubmitting={isSubmitting}
      isDisabled={isDisabled}
      onSubmit={onCreateTicket}
      fields={fields}
      optionsMap={{
        services: servicesMap,
        documentTypes: DOCUMENT_TYPE_OPTIONS,
      }}
    />
  );
};
