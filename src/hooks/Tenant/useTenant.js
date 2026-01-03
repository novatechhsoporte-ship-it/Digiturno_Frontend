import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { TenantsApi } from "@core/api/tenants";
import { useCustomForm } from "@utils/useCustomForm";
import { tenantSchema, FORM_FIELDS } from "@schemas/Tenants";

export const useTenant = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [mode, setMode] = useState("create");

  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset } = useCustomForm({
    schema: tenantSchema,
    formOptions: {
      defaultValues: {
        name: "",
        taxId: "",
        address: "",
        city: "",
        phone: "",
        email: "",
        status: true,
        serviceHoursStart: "08:00",
        serviceHoursEnd: "17:00",
        maxWaitingTimeMinutes: "30",
      },
    },
  });

  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await TenantsApi.listTenants();
      setTenants(Array.isArray(response?.data) ? response.data : []);
    } catch {
      toast.error("Error loading tenants");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        address: values.address.trim(),
        phone: Number(values.phone),
        status: values.status,
        ...(values.taxId && { taxId: values.taxId.trim() }),
        ...(values.email && { email: values.email.trim() }),
        ...(values.city && { city: values.city.trim() }),
        configuration: {
          serviceHours: {
            start: values.serviceHoursStart,
            end: values.serviceHoursEnd,
          },
          ...(values.maxWaitingTimeMinutes && {
            maxWaitingTimeMinutes: Number(values.maxWaitingTimeMinutes),
          }),
        },
      };

      if (mode === "edit") {
        await TenantsApi.updateTenant(selectedTenant._id, payload);
        toast.success("Tenant updated successfully");
      } else {
        await TenantsApi.createTenant(payload);
        toast.success("Tenant created successfully");
      }

      reset();
      setShowForm(false);
      setSelectedTenant(null);
      loadTenants();
    } catch (err) {
      toast.error(err?.message || "Operation failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEditTenant = (tenant) => {
    setMode("edit");
    setSelectedTenant(tenant);

    reset({
      name: tenant.name || "",
      taxId: tenant.taxId || "",
      address: tenant.address || "",
      city: tenant.city || "",
      phone: tenant.phone.toString() || "",
      email: tenant.email || "",
      status: tenant.status ?? true,
      serviceHoursStart: tenant.configuration?.serviceHours?.start || "08:00",
      serviceHoursEnd: tenant.configuration?.serviceHours?.end || "17:00",
      maxWaitingTimeMinutes: tenant.configuration?.maxWaitingTimeMinutes.toString() || "30",
    });

    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleAskDelete = (tenant) => {
    setSelectedTenant(tenant);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await TenantsApi.deleteTenant(selectedTenant._id);
      toast.success("Tenant deleted");
      setShowDeleteConfirm(false);
      setSelectedTenant(null);
      loadTenants();
    } catch {
      toast.error("Error deleting tenant");
    }
  };

  const handleShowForm = () => {
    setMode("create");
    setSelectedTenant(null);
    reset();
    setShowForm(!showForm);
  };

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  return {
    //Props
    tenants,
    loading,
    showForm,
    showDeleteConfirm,
    selectedTenant,
    FORM_FIELDS,
    mode,

    //methods
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    handleShowForm,
    handleEditTenant,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
  };
};
