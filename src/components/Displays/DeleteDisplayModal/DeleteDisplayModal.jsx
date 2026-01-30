import { CustomButton, CustomModal } from "@components/common";
import "./DeleteDisplayModal.scss";

export const DeleteDisplayModal = ({ isOpen, onClose, displayName, onConfirm, isDeleting }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Eliminar Pantalla" size="sm">
      <div className="delete-display-modal">
        <p className="delete-display-modal__message">
          ¿Estás seguro de que deseas eliminar la pantalla <strong>{displayName}</strong>? Esta acción no se puede deshacer.
        </p>

        <div className="delete-display-modal__actions">
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

