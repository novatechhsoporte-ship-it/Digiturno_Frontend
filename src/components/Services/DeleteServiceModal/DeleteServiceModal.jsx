import { CustomButton, CustomModal } from "@components/common";
import "./DeleteServiceModal.scss";

export const DeleteServiceModal = ({ isOpen, onClose, serviceName, onConfirm, isDeleting }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Eliminar Servicio" size="sm">
      <div className="delete-service-modal">
        <p className="delete-service-modal__message">
          ¿Estás seguro de que deseas eliminar el servicio <strong>{serviceName}</strong>? Esta acción no se puede deshacer.
        </p>

        <div className="delete-service-modal__actions">
          <CustomButton variant="outline" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

