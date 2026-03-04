import { CustomButton } from "@components/common";
import "./PublicQrServiceSelection.scss";

export const PublicQrServiceSelection = ({ services = [], loading, onSelect, onCancel }) => {
  return (
    <div className="public-qr__step fade-in">
      <div className="public-qr__step-header">
        <h2 className="public-qr__step-title">Selecciona el Servicio</h2>
        <p className="public-qr__step-subtitle">¿En qué te podemos ayudar hoy?</p>
      </div>

      <div className="public-qr-services">
        <div className="public-qr-services__grid">
          {loading ? (
            <div className="public-qr-services__loading">
              <div className="public-qr__spinner"></div>
              <p>Cargando servicios...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="public-qr-services__empty">
              <p>No hay servicios disponibles.</p>
            </div>
          ) : (
            services.map((service) => (
              <button key={service._id} type="button" className="public-qr-services__card" onClick={() => onSelect(service)}>
                <h3 className="public-qr-services__card-name">{service.name}</h3>
                {service.description && <p className="public-qr-services__card-description">{service.description}</p>}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="public-qr__form-actions mt-6">
        <CustomButton variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Volver a Mis Datos
        </CustomButton>
      </div>
    </div>
  );
};
