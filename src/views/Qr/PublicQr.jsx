import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QrApi } from "@core/api/qr";
import { TicketsApi } from "@core/api/tickets";
import { ServicesApi } from "@core/api/services";
import { useCustomForm } from "@utils/useCustomForm.jsx";
import { toast } from "sonner";
import { CustomButton, CustomInput, CustomSelect, CustomModal } from "@components/common";
import { ticketSchema } from "@schemas/Tickets";
import "./PublicQr.scss";

const headerLogoSrc = `${import.meta.env.BASE_URL}brand/novatechhheader.svg`;

const DOCUMENT_TYPES = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PA", label: "Pasaporte" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "NIT", label: "NIT" },
  { value: "PASSPORT", label: "Pasaporte" },
];

export const PublicQr = () => {
  const { token } = useParams();
  const [tenant, setTenant] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0); // 0: bienvenida, 1: datos, 2: servicios, 3: turno generado
  const [selectedService, setSelectedService] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [creatingTicket, setCreatingTicket] = useState(false);

  // Form for customer data
  const { register, handleSubmit, errors, isSubmitting, reset, watch } = useCustomForm({
    schema: ticketSchema,
    formOptions: {
      defaultValues: {
        documentNumber: "",
        documentType: "CC",
        fullName: "",
        phone: "",
        email: "",
      },
    },
  });

  const formValues = watch();

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await QrApi.getQrByToken(token);
        console.log("response Qr:>> ", response);
        const tenantData = response.data?.tenant || response.data?.data?.tenant;
        setTenant(tenantData);

        // Fetch services for this tenant
        if (tenantData?._id) {
          await fetchServices(tenantData._id);
        }
      } catch (err) {
        console.error("Error fetching tenant:", err);
        setError("QR inválido o desactivado");
        toast.error("QR inválido o desactivado");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTenant();
    }
  }, [token]);

  const fetchServices = async (tenantId) => {
    try {
      setLoadingServices(true);
      const response = await ServicesApi.listServices({ tenantId, active: true });
      console.log("response :>> ", response);
      const servicesData = response.data?.data || response.data || [];
      setServices(servicesData);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("Error al cargar los servicios");
    } finally {
      setLoadingServices(false);
    }
  };

  const handleStartRequest = () => {
    setStep(1);
  };

  const onCustomerDataSubmit = async (values) => {
    // Validate required fields
    if (!values.documentNumber || !values.fullName || !values.phone) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Move to services selection step
    setStep(2);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowConfirmModal(true);
  };

  const handleConfirmTicket = async () => {
    try {
      if (!tenant?._id || !selectedService?._id) {
        toast.error("Error: información incompleta");
        return;
      }

      setCreatingTicket(true);

      const response = await TicketsApi.createTicket({
        tenantId: tenant._id,
        documentNumber: formValues.documentNumber.trim(),
        documentType: formValues.documentType,
        fullName: formValues.fullName.trim(),
        phone: formValues.phone.trim(),
        email: formValues.email?.trim() || undefined,
        serviceId: selectedService._id,
        origin: "PUBLIC",
      });

      console.log("response :>> ", response);
      if (!response.success) {
        toast.error("Error al crear el turno");
        throw new Error(response);
      }

      // const result = response.data || response;

      // console.log("result :>> ", result);

      console.log("response.data :>> ", response.data);

      setGeneratedTicket(response.data);
      setShowConfirmModal(false);
      setStep(3);
      toast.success("Turno creado exitosamente");
    } catch (err) {
      console.error("Error creating ticket:", err);
      toast.error(err?.response?.data?.message || "Error al crear el turno");
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleNewTicket = () => {
    setStep(0);
    setSelectedService(null);
    setGeneratedTicket(null);
    reset();
  };

  if (loading) {
    return (
      <div className="public-qr public-qr--loading">
        <div className="public-qr__spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="public-qr public-qr--error">
        <h2 className="public-qr__error-title">QR inválido</h2>
        <p className="public-qr__error-message">{error || "El código QR no es válido o ha sido desactivado"}</p>
      </div>
    );
  }

  return (
    <div className="public-qr">
      {/* Header with Novatech logo */}
      <header className="public-qr__header">
        <img className="public-qr__header-logo" src={headerLogoSrc} alt="Novatech" />
      </header>

      <div className="public-qr__content">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="public-qr__welcome">
            <div className="public-qr__welcome-content">
              <h1 className="public-qr__welcome-title">Bienvenido a {tenant.name}</h1>
              <p className="public-qr__welcome-message">Solicita tu turno de manera rápida y sencilla</p>
              <CustomButton variant="primary" size="lg" onClick={handleStartRequest} className="public-qr__welcome-button">
                Solicitar Turno
              </CustomButton>
            </div>
          </div>
        )}

        {/* Step 1: Customer Data Form */}
        {step === 1 && (
          <div className="public-qr__form-container">
            <h2 className="public-qr__form-title">Datos Personales</h2>
            <form className="public-qr__form" onSubmit={handleSubmit(onCustomerDataSubmit)}>
              <div className="public-qr__form-grid">
                <div className="public-qr__field">
                  <CustomSelect
                    label="Tipo de Documento"
                    required
                    error={errors.documentType?.message}
                    options={DOCUMENT_TYPES}
                    {...register("documentType")}
                  />
                </div>

                <div className="public-qr__field">
                  <CustomInput
                    label="Número de Documento"
                    type="text"
                    required
                    placeholder="Ingrese su número de documento"
                    error={errors.documentNumber?.message}
                    {...register("documentNumber")}
                  />
                </div>

                <div className="public-qr__field public-qr__field--full">
                  <CustomInput
                    label="Nombre Completo"
                    type="text"
                    required
                    placeholder="Ingrese su nombre completo"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />
                </div>

                <div className="public-qr__field">
                  <CustomInput
                    label="Teléfono"
                    type="tel"
                    required
                    placeholder="Ingrese su teléfono"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>

                <div className="public-qr__field">
                  <CustomInput
                    label="Correo Electrónico (Opcional)"
                    type="email"
                    placeholder="Ingrese su correo (opcional)"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
              </div>

              <div className="public-qr__form-actions">
                <CustomButton type="button" variant="outline" onClick={() => setStep(0)}>
                  Volver
                </CustomButton>
                <CustomButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Validando..." : "Solicitar Turno"}
                </CustomButton>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Services Selection */}
        {step === 2 && (
          <div className="public-qr__services">
            <h2 className="public-qr__services-title">Selecciona el tipo de servicio</h2>
            {loadingServices ? (
              <div className="public-qr__services-loading">Cargando servicios...</div>
            ) : services.length === 0 ? (
              <div className="public-qr__services-empty">No hay servicios disponibles</div>
            ) : (
              <div className="public-qr__services-grid">
                {services.map((service) => (
                  <div key={service._id} className="public-qr__service-card" onClick={() => handleServiceSelect(service)}>
                    <div className="public-qr__service-card-content">
                      <h3 className="public-qr__service-card-name">{service.name}</h3>
                      {service.description && <p className="public-qr__service-card-description">{service.description}</p>}
                    </div>
                    <div className="public-qr__service-card-arrow">→</div>
                  </div>
                ))}
              </div>
            )}
            <div className="public-qr__services-actions">
              <CustomButton variant="outline" onClick={() => setStep(1)}>
                Volver
              </CustomButton>
            </div>
          </div>
        )}

        {/* Step 3: Generated Ticket */}
        {step === 3 && generatedTicket && (
          <div className="public-qr__ticket-result">
            <div className="public-qr__ticket-result-content">
              <div className="public-qr__ticket-result-icon">✓</div>
              <h2 className="public-qr__ticket-result-title">¡Turno Generado!</h2>
              <div className="public-qr__ticket-result-number">{generatedTicket.ticketNumber}</div>
              <p className="public-qr__ticket-result-message">
                Tu turno ha sido creado exitosamente. Por favor espera a ser llamado.
              </p>
              <div className="public-qr__ticket-result-info">
                <p>
                  <strong>Servicio:</strong> {selectedService?.name}
                </p>
                <p>
                  <strong>Cliente:</strong> {formValues.fullName}
                </p>
              </div>
              <CustomButton variant="primary" size="lg" onClick={handleNewTicket} className="public-qr__ticket-result-button">
                Solicitar Otro Turno
              </CustomButton>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <CustomModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Confirmar Servicio" size="md">
        <div className="public-qr__confirm-modal">
          <div className="public-qr__confirm-modal-content">
            <h3 className="public-qr__confirm-modal-subtitle">Datos del Cliente</h3>
            <div className="public-qr__confirm-modal-info">
              <p>
                <strong>Nombre:</strong> {formValues.fullName}
              </p>
              <p>
                <strong>Documento:</strong> {formValues.documentType} {formValues.documentNumber}
              </p>
              <p>
                <strong>Teléfono:</strong> {formValues.phone}
              </p>
              {formValues.email && (
                <p>
                  <strong>Email:</strong> {formValues.email}
                </p>
              )}
            </div>

            <div className="public-qr__confirm-modal-divider"></div>

            <h3 className="public-qr__confirm-modal-subtitle">Servicio Seleccionado</h3>
            <div className="public-qr__confirm-modal-service">
              <p className="public-qr__confirm-modal-service-name">{selectedService?.name}</p>
              {selectedService?.description && (
                <p className="public-qr__confirm-modal-service-description">{selectedService.description}</p>
              )}
            </div>
          </div>

          <div className="public-qr__confirm-modal-actions">
            <CustomButton variant="outline" onClick={() => setShowConfirmModal(false)} disabled={creatingTicket}>
              Cancelar
            </CustomButton>
            <CustomButton variant="primary" onClick={handleConfirmTicket} disabled={creatingTicket}>
              {creatingTicket ? "Generando turno..." : "Confirmar"}
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};
