import { useState, useCallback } from "react";
import { toast } from "sonner";
import { CustomersApi } from "@core/api/customers";
import { useCustomForm } from "@utils/useCustomForm";
import { customerUpdateSchema, DEFAULT_CUSTOMER_UPDATE_VALUES } from "@schemas/Tickets";

/**
 * Hook for editing customer information
 */
export const useEditCustomer = (loadPendingTickets) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form for editing customer
  const {
    register: registerCustomer,
    handleSubmit: handleSubmitCustomer,
    errors: errorsCustomer,
    isSubmitting: isSubmittingCustomer,
    isDisabled: isDisabledCustomer,
    reset: resetCustomer,
    setValue: setValueCustomer,
  } = useCustomForm({
    schema: customerUpdateSchema,
    formOptions: {
      defaultValues: DEFAULT_CUSTOMER_UPDATE_VALUES,
    },
  });

  // Edit customer from ticket
  const handleEditCustomer = useCallback(
    (ticket) => {
      if (!ticket.customerId) return;

      setEditingCustomer(ticket.customerId);
      setValueCustomer("fullName", ticket.customerId.fullName || "");
      setValueCustomer("email", ticket.customerId.email || "");
      setValueCustomer("phone", ticket.customerId.phone?.toString() || "");
      setShowEditModal(true);
    },
    [setValueCustomer]
  );

  // Update customer
  const onUpdateCustomer = useCallback(
    async (values) => {
      if (!editingCustomer?._id) return;

      try {
        setLoading(true);
        const payload = {
          ...(values.fullName && { fullName: values.fullName.trim() }),
          ...(values.email && values.email.trim() && { email: values.email.trim() }),
          ...(values.phone && values.phone.trim() && { phone: values.phone.trim() }),
        };

        await CustomersApi.updateCustomer(editingCustomer._id, payload);
        toast.success("Cliente actualizado exitosamente");
        setShowEditModal(false);
        setEditingCustomer(null);
        resetCustomer();
        loadPendingTickets();
      } catch (err) {
        toast.error(err?.response?.data?.error || err?.message || "Error actualizando cliente");
      } finally {
        setLoading(false);
      }
    },
    [editingCustomer, resetCustomer, loadPendingTickets]
  );

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingCustomer(null);
    resetCustomer();
  }, [resetCustomer]);

  return {
    showEditModal,
    editingCustomer,
    loading: loading || isSubmittingCustomer,
    isSubmitting: isSubmittingCustomer,
    isDisabled: isDisabledCustomer,
    registerCustomer,
    handleSubmitCustomer,
    errorsCustomer,
    handleEditCustomer,
    onUpdateCustomer,
    handleCloseEditModal,
  };
};
