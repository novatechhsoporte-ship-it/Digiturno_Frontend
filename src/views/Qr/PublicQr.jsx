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
