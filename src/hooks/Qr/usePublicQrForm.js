import { useState } from "react";
import { QrApi } from "@core/api/qr";
import { TicketsApi } from "@core/api/tickets";
import { ServicesApi } from "@core/api/services";
import { useCustomForm } from "@utils/useCustomForm.jsx";
import { ticketSchema } from "@schemas/Tickets";
import { toast } from "sonner";
import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";

const qrKeys = createQueryKeyFactory("qr");
const serviceKeys = createQueryKeyFactory("services");

export const usePublicQrForm = (token) => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [generatedTicket, setGeneratedTicket] = useState(null);

  // Fetch Tenant via QR Token
  const {
    data: tenantResponse,
    isLoading: loadingTenant,
    error: tenantError,
  } = useQueryAdapter(qrKeys.detail(token), () => QrApi.getQrByToken(token), {
    enabled: !!token,
    showErrorToast: false,
  });

  const tenant = tenantResponse?.tenant || tenantResponse?.data?.tenant || tenantResponse;

  // Fetch Services once token is available
  const { data: servicesResponse, isLoading: loadingServices } = useQueryAdapter(
    serviceKeys.list({ token, active: true }),
    () => QrApi.getPublicServicesByQrToken(token),
    {
      enabled: !!token,
    }
  );

  const services = servicesResponse?.data || servicesResponse || [];

  // Mutation to create ticket
  const createTicketMutation = useMutationAdapter((payload) => TicketsApi.createTicket(payload), {
    onSuccess: (data) => {
      setGeneratedTicket(data);
      setStep(4);
      toast.success("Turno creado exitosamente");
    },
  });

  const { register, handleSubmit, errors, isSubmitting, reset, watch, trigger } = useCustomForm({
    schema: ticketSchema,
    formOptions: {
      defaultValues: {
        documentNumber: "",
        documentType: "CC",
        fullName: "",
        phone: "",
        email: "",
        serviceTypeId: "",
      },
    },
  });

  const formValues = watch();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

  const handleStartRequest = () => {
    setStep(1);
  };

  const handleCustomerDataNext = async () => {
    const isStep1Valid = await trigger(["documentType", "documentNumber", "fullName", "phone", "email"]);
    if (isStep1Valid) {
      nextStep();
    } else {
      toast.error("Por favor, revisa los datos ingresados.");
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    nextStep();
  };

  const handleConfirmTicket = async () => {
    if (!tenant?._id || !selectedService?._id) {
      toast.error("Error: información incompleta");
      return;
    }

    createTicketMutation.mutate({
      tenantId: tenant._id,
      documentNumber: formValues.documentNumber.trim(),
      documentType: formValues.documentType,
      fullName: formValues.fullName.trim(),
      phone: formValues.phone.trim(),
      email: formValues.email?.trim() || undefined,
      serviceId: selectedService._id,
      origin: "PUBLIC",
    });
  };

  const handleNewTicket = () => {
    setStep(0);
    setSelectedService(null);
    setGeneratedTicket(null);
    reset();
  };

  return {
    tenant,
    services,
    loading: loadingTenant,
    error: tenantError ? "QR inválido o desactivado" : null,
    step,
    selectedService,
    generatedTicket,
    loadingServices,
    creatingTicket: createTicketMutation.isPending,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    formValues,
    setStep,
    nextStep,
    prevStep,
    handleStartRequest,
    handleCustomerDataNext,
    handleServiceSelect,
    handleConfirmTicket,
    handleNewTicket,
  };
};
