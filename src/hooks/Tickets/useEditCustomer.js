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

      const customer = ticket.customerId;
      setEditingCustomer(customer);
      resetCustomer({
        documentType: customer.documentType || "CC",
        documentNumber: customer.documentNumber ? customer.documentNumber.toString() : "",
        fullName: customer.fullName || "",
        email: customer.email || "",
        phone: customer.phone ? customer.phone.toString() : "",
      });
      setShowEditModal(true);
    },
    [resetCustomer]
  );

  // Update customer
  const onUpdateCustomer = useCallback(
    async (values) => {
      if (!editingCustomer?._id) return;

      try {
        setLoading(true);

        const docType = values.documentType || editingCustomer.documentType || "CC";
        const docNumber = (values.documentNumber && String(values.documentNumber).trim())
          ? Number(String(values.documentNumber).trim())
          : (editingCustomer.documentNumber ? Number(editingCustomer.documentNumber) : undefined);
        const fullName = (values.fullName && values.fullName.trim())
          ? values.fullName.trim()
          : editingCustomer.fullName;

        const email = values.email !== undefined && values.email.trim() !== ""
          ? values.email.trim()
          : (editingCustomer.email || "");

        const phone = values.phone && String(values.phone).trim()
          ? Number(String(values.phone).trim())
          : (editingCustomer.phone ? Number(editingCustomer.phone) : null);

        const payload = {
          documentType: docType,
          ...(docNumber && { documentNumber: docNumber }),
          ...(fullName && { fullName }),
          ...(email && { email }),
          ...(phone && { phone }),
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
