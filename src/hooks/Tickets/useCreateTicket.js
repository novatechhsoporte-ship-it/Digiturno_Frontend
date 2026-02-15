import { useState, useCallback, useMemo } from "react";

import { ServicesApi } from "@core/api/services";
import { TicketsApi } from "@core/api/tickets";
import { useAuth } from "@/store/authStore";
import { useAbility } from "@hooks/";
import { useCustomForm } from "@utils/useCustomForm";
import { ticketSchema, DEFAULT_FORM_VALUES } from "@schemas/Tickets";
import { createQueryKeyFactory, useMutationAdapter, useQueryAdapter, QUERY_PRESETS } from "@config/adapters/queryAdapter";

const ticketKeys = createQueryKeyFactory("tickets");

/** Hook for creating tickets **/
export const useCreateTicket = (selectedTenant, canCreate) => {
  const { user: authUser } = useAuth();
  const { isSuperAdmin } = useAbility();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form for creating tickets
  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset } = useCustomForm({
    schema: ticketSchema,
    formOptions: {
      defaultValues: DEFAULT_FORM_VALUES,
    },
  });

  const { mutateAsync: createTicket, isLoading: loading } = useMutationAdapter(
    async (values) => {
      const cleanPayload = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      const payload = {
        ...cleanPayload,
        tenantId: authUser?.tenantId,
      };

      return TicketsApi.createTicket(payload);
    },
    {
      successMessage: "Turno creado exitosamente",
      invalidateQueries: [ticketKeys.lists()],
      onSuccess: () => {
        reset();
        setShowCreateModal(false);
      },
    }
  );

  // Create ticket from customer data
  const onCreateTicket = useCallback(
    async (values) => {
      await createTicket(values);
    },
    [createTicket]
  );

  // Handle show create modal
  const handleShowCreateModal = useCallback(() => {
    reset();
    setShowCreateModal(true);
  }, [reset]);

  // Handle close create modal
  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
    reset();
  }, [reset]);

  // Check if button should be shown
  const showCreateButton = useMemo(() => {
    return canCreate || (isSuperAdmin ? selectedTenant : authUser?.tenantId);
  }, [canCreate, isSuperAdmin, selectedTenant, authUser?.tenantId]);

  // Query for services
  const { data: services = [] } = useQueryAdapter(
    ["services", "list"],
    () => ServicesApi.listServices({ tenantId: authUser.tenantId }),
    {
      enabled: true,
      showErrorToast: true,
      staleTime: QUERY_PRESETS.SEMI_STATIC,
    }
  );

  const servicesMap = useMemo(
    () =>
      services.map((s) => ({
        value: s._id,
        label: s.name,
      })),
    [services]
  );

  return {
    showCreateModal,
    loading: loading || isSubmitting,
    isSubmitting,
    isDisabled,
    register,
    handleSubmit,
    errors,
    onCreateTicket,
    handleShowCreateModal,
    handleCloseCreateModal,
    showCreateButton,
    servicesMap,
  };
};
