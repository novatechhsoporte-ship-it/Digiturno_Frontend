import { CustomButton, CustomModal } from "@components/common";
import "./DeleteQrModal.scss";

export const DeleteQrModal = ({ isOpen, onClose, qrToken, onConfirm, isDeleting }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Eliminar Código QR" size="sm">
      <div className="delete-qr-modal">
        <p className="delete-qr-modal__message">
          ¿Estás seguro de que deseas eliminar el código QR con token <strong>{qrToken}</strong>? Esta acción no se puede
          deshacer.
        </p>

        <div className="delete-qr-modal__actions">
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

