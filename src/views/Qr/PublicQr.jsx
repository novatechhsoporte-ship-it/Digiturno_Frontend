import { useParams } from "react-router-dom";
import { usePublicQrForm } from "../../hooks/Qr/usePublicQrForm";
import { PublicQrWelcome } from "./components/PublicQr/PublicQrWelcome";
import { PublicQrCustomerForm } from "./components/PublicQr/PublicQrCustomerForm";
import { PublicQrServiceSelection } from "./components/PublicQr/PublicQrServiceSelection";
import { PublicQrSummary } from "./components/PublicQr/PublicQrSummary";
import { PublicQrResult } from "./components/PublicQr/PublicQrResult";
import "./PublicQr.scss";

const headerLogoSrc = `${import.meta.env.BASE_URL}brand/novatechhheader.svg`;

export const PublicQr = () => {
  const { token } = useParams();

  const {
    tenant,
    schedule,
    services,
    loading,
    error,
    step,
    selectedService,
    generatedTicket,
    loadingServices,
    creatingTicket,
    register,
    handleSubmit,
    errors,
    formValues,
    prevStep,
    handleStartRequest,
    handleCustomerDataNext,
    handleServiceSelect,
    handleConfirmTicket,
    handleNewTicket,
  } = usePublicQrForm(token);

  if (loading) {
    return (
      <div className="public-qr public-qr--loading">
        <div className="public-qr__spinner"></div>
        <p>Cargando información del QR...</p>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="public-qr public-qr--error">
        <h2 className="public-qr__error-title">QR inválido</h2>
        <p className="public-qr__error-message">{error || "El código QR no es válido o ha sido desactivado."}</p>
      </div>
    );
  }

  // Check if public access is currently closed (off-hours, weekends, holidays)
  if (schedule && schedule.isOpen === false) {
    return (
      <div className="public-qr">
        <header className="public-qr__header">
          <img className="public-qr__header-logo" src={headerLogoSrc} alt="Novatech" />
        </header>

        <div className="public-qr__content">
          <div className="public-qr__closed fade-in">
            <div className="public-qr__closed-icon">🕒</div>
            <h2 className="public-qr__closed-title">Notaría Cerrada</h2>
            <p className="public-qr__closed-message">
              {schedule.message || "En este momento no nos encontramos en horario de atención al público."}
            </p>

            {schedule.scheduleInfo && (
              <div className="public-qr__closed-card">
                <h4 className="public-qr__closed-subtitle">Horarios de Atención:</h4>
                <ul className="public-qr__closed-list">
                  <li>📅 <strong>Lunes a Viernes:</strong> {schedule.scheduleInfo.weekday?.replace("Lunes a Viernes de ", "") || "08:00 a 17:00"}</li>
                  <li>📅 <strong>Sábados:</strong> {schedule.scheduleInfo.saturday?.replace("Sábados de ", "") || "08:00 a 15:00 (3:00 p.m.)"}</li>
                  {schedule.scheduleInfo.lunch && (
                    <li>🍽️ <strong>Almuerzo:</strong> {schedule.scheduleInfo.lunch?.replace("Almuerzo general de ", "")}</li>
                  )}
                  <li>⛔ <strong>Domingos y Festivos:</strong> Sin atención al público</li>
                </ul>
              </div>
            )}

            <p className="public-qr__closed-footer">
              Por favor escanea nuevamente el código QR dentro del horario de atención laboral.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-qr">
      {/* Header with Logo */}
      <header className="public-qr__header">
        <img className="public-qr__header-logo" src={headerLogoSrc} alt="Novatech" />
      </header>

      <div className="public-qr__content">
        {step === 0 && (
          <PublicQrWelcome tenant={tenant} onStart={handleStartRequest} />
        )}

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleCustomerDataNext(); }}>
            <PublicQrCustomerForm
              register={register}
              errors={errors}
              onNext={handleCustomerDataNext}
              onCancel={() => handleNewTicket()}
            />
          </form>
        )}

        {step === 2 && (
          <PublicQrServiceSelection
            services={services}
            loading={loadingServices}
            onSelect={handleServiceSelect}
            onCancel={prevStep}
          />
        )}

        {step === 3 && (
          <PublicQrSummary
            formValues={formValues}
            selectedService={selectedService}
            onConfirm={handleConfirmTicket}
            onCancel={prevStep}
            creating={creatingTicket}
          />
        )}

        {step === 4 && generatedTicket && (
          <PublicQrResult
            ticket={generatedTicket}
            service={selectedService}
            customerName={formValues.fullName}
            onNewTicket={handleNewTicket}
          />
        )}
      </div>
    </div>
  );
};
