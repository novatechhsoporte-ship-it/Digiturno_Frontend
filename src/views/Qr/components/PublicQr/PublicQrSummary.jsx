import { CustomButton, CustomIcon } from "@components/common";

export const PublicQrSummary = ({ formValues, selectedService, onConfirm, onCancel, creating }) => {
  return (
    <div className="public-qr__step fade-in">
      <div className="public-qr__step-header">
        <h2 className="public-qr__step-title">Confirma tu Turno</h2>
        <p className="public-qr__step-subtitle">Revisa que la información sea correcta antes de generar el ticket.</p>
      </div>

      <div className="public-qr__summary">
        <div className="public-qr__summary-card">
          <h3 className="public-qr__summary-subtitle">Datos del Cliente</h3>
          <div className="public-qr__summary-info">
            <p>
              <CustomIcon name="mdi:account" size="sm" /> <strong>Nombre:</strong> {formValues.fullName}
            </p>
            <p>
              <CustomIcon name="mdi:card-account-details-outline" size="sm" /> <strong>Documento:</strong>{" "}
              {formValues.documentType} {formValues.documentNumber}
            </p>
            <p>
              <CustomIcon name="mdi:phone" size="sm" /> <strong>Celular:</strong> {formValues.phone}
            </p>
            {formValues.email && (
              <p>
                <CustomIcon name="mdi:email-outline" size="sm" /> <strong>Email:</strong> {formValues.email}
              </p>
            )}
          </div>
        </div>

        <div className="public-qr__summary-card">
          <h3 className="public-qr__summary-subtitle">Servicio Seleccionado</h3>
          <div className="public-qr__summary-service">
            <div className="public-qr__summary-service-icon">
              <span className="mdi mdi-check-circle-outline"></span>
            </div>
            <div>
              <p className="public-qr__summary-service-name">{selectedService?.name}</p>
              {selectedService?.description && (
                <p className="public-qr__summary-service-description">{selectedService.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="public-qr__summary-actions">
        <CustomButton variant="outline" onClick={onCancel} disabled={creating} className="w-full sm:w-auto">
          Cambiar Servicio
        </CustomButton>
        <CustomButton variant="primary" size="lg" onClick={onConfirm} disabled={creating} className="w-full sm:w-auto">
          {creating ? "Generando turno..." : "Confirmar y Generar"}
        </CustomButton>
      </div>
    </div>
  );
};
