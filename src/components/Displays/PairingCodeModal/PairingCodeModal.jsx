import { CustomButton, CustomInput, CustomModal } from "@components/common";
import "./PairingCodeModal.scss";

export const PairingCodeModal = ({
  isOpen,
  onClose,
  registerPairing,
  handleSubmitPairing,
  errorsPairing,
  isSubmittingPairing,
  isDisabledPairing,
  onSubmitPairing,
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Registrar Nueva Pantalla" size="sm">
      <form className="pairing-code-modal__form" onSubmit={handleSubmitPairing(onSubmitPairing)}>
        <div className="pairing-code-modal__field">
          <CustomInput
            label="Código de Emparejamiento"
            placeholder="Ingrese el código de 6 dígitos"
            required
            error={errorsPairing.pairingCode?.message}
            maxLength={6}
            {...registerPairing("pairingCode")}
          />
          <p className="pairing-code-modal__hint">
            Ingrese el código de 6 dígitos que aparece en la pantalla que desea registrar
          </p>
        </div>

        <div className="pairing-code-modal__actions">
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton type="submit" disabled={isDisabledPairing || isSubmittingPairing}>
            {isSubmittingPairing ? "Registrando..." : "Continuar"}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};

