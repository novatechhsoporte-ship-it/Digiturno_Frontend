import { CustomButton, CustomInput, CustomModal, CustomSelect } from "@components/common";
import { DOCUMENT_TYPE_OPTIONS } from "@schemas/Tickets";
import "./EditCustomerModal.scss";

export const EditCustomerModal = ({
  isOpen,
  onClose,
  editingCustomer,
  registerCustomer,
  handleSubmitCustomer,
  errorsCustomer,
  isSubmittingCustomer,
  isDisabledCustomer,
  onUpdateCustomer,
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Editar Cliente" size="md">
      <form className="edit-customer-modal" onSubmit={handleSubmitCustomer(onUpdateCustomer)}>
        <div className="edit-customer-modal__grid">
          <div className="edit-customer-modal__group">
            <CustomSelect
              label="Tipo de Documento *"
              options={DOCUMENT_TYPE_OPTIONS}
              required
              error={errorsCustomer.documentType?.message}
              {...registerCustomer("documentType")}
            />
          </div>

          <div className="edit-customer-modal__group">
            <CustomInput
              label="Número de Documento *"
              placeholder="Ingrese el número de documento"
              required
              error={errorsCustomer.documentNumber?.message}
              {...registerCustomer("documentNumber")}
            />
          </div>

          <div className="edit-customer-modal__group edit-customer-modal__group--full">
            <CustomInput
              label="Nombre Completo *"
              placeholder="Ingrese el nombre completo"
              required
              error={errorsCustomer.fullName?.message}
              {...registerCustomer("fullName")}
            />
          </div>

          <div className="edit-customer-modal__group">
            <CustomInput
              label="Correo Electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errorsCustomer.email?.message}
              {...registerCustomer("email")}
            />
          </div>

          <div className="edit-customer-modal__group">
            <CustomInput
              label="Teléfono"
              placeholder="Ingrese el teléfono"
              error={errorsCustomer.phone?.message}
              {...registerCustomer("phone")}
            />
          </div>
        </div>

        <div className="edit-customer-modal__actions">
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton type="submit" disabled={isDisabledCustomer || isSubmittingCustomer}>
            {isSubmittingCustomer ? "Guardando..." : "Guardar Cambios"}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};
