import { CustomButton } from "@components/common";

export const PublicQrWelcome = ({ tenant, onStart }) => {
  return (
    <div className="public-qr__welcome fade-in">
      <div className="public-qr__welcome-content">
        <div className="public-qr__welcome-icon">
          <span className="mdi mdi-ticket-confirmation-outline"></span>
        </div>
        <h1 className="public-qr__welcome-title">Bienvenido a {tenant.name}</h1>
        <p className="public-qr__welcome-message">Solicita tu turno virtual de manera rápida y sin filas.</p>
        <CustomButton variant="primary" size="lg" onClick={onStart} className="public-qr__welcome-button">
          Solicitar Turno
        </CustomButton>
      </div>
    </div>
  );
};
