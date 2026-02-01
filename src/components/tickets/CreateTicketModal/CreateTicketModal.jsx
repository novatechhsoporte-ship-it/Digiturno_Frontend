import { TICKET_FORM_FIELDS, DOCUMENT_TYPE_OPTIONS } from "@schemas/Tickets";
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
}) => {
  return (
    <GenericFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Turno"
      submitLabel="Crear Turno"
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      isSubmitting={isSubmitting}
      isDisabled={isDisabled}
      onSubmit={onCreateTicket}
      fields={TICKET_FORM_FIELDS}
      optionsMap={{
        services: servicesMap,
        documentTypes: DOCUMENT_TYPE_OPTIONS,
      }}
    />
  );
};
