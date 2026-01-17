import { CustomButton, CustomModal } from "@components/common";
import "./DeleteModuleModal.scss";

export const DeleteModuleModal = ({ isOpen, onClose, moduleName, onConfirm, isDeleting }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Eliminar Módulo" size="sm">
      <div className="delete-module-modal">
        <p className="delete-module-modal__message">
          ¿Estás seguro de que deseas eliminar el módulo <strong>{moduleName}</strong>? Esta acción no se puede deshacer.
        </p>

        <div className="delete-module-modal__actions">
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


