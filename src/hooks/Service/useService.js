import { useState, useCallback } from "react";
import { ServicesApi } from "@core/api/services";
import { TenantsApi } from "@core/api/tenants";
import { useCustomForm } from "@utils/useCustomForm.jsx";
import { serviceSchema, FORM_FIELDS } from "@schemas/Services";
import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { useAuth } from "@/store/authStore";

const serviceKeys = createQueryKeyFactory("services");

export const useService = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("SUPERADMIN") || false;
  const userTenantId = user?.tenantId;

  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [mode, setMode] = useState("create");
  const [filters, setFilters] = useState({
    tenantId: isSuperAdmin ? "" : userTenantId || "",
    active: "",
    search: "",
  });

  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset, watch, setValue } = useCustomForm({
    schema: serviceSchema,
    formOptions: {
      defaultValues: {
        name: "",
        description: "",
        tenantId: isSuperAdmin ? "" : userTenantId || "",
        active: true,
      },
    },
  });

  // Query for tenants
  const { data: tenants = [], isLoading: loadingTenants } = useQueryAdapter(["tenants", "list"], () => TenantsApi.listTenants(), {
    enabled: true,
    showErrorToast: true,
  });

  // Query for services
  const {
    data: services = [],
    isLoading: loadingServices,
    refetch: refetchServices,
  } = useQueryAdapter(
    serviceKeys.list(filters),
    () => {
      const params = {};
      if (filters.tenantId) params.tenantId = filters.tenantId;
      if (filters.active !== "") params.active = filters.active === "true";
      if (filters.search) params.search = filters.search;

      return ServicesApi.listServices(params);
    },
    {
      enabled: isSuperAdmin ? Boolean(filters.tenantId) : Boolean(userTenantId),
      showErrorToast: true,
    }
  );

  // Mutation for create
  const createServiceMutation = useMutationAdapter(({ tenantId, payload }) => ServicesApi.createService(tenantId, payload), {
    successMessage: "Servicio creado exitosamente",
    invalidateQueries: [serviceKeys.list(filters)],
    onSuccess: () => {
      reset();
      setShowForm(false);
      setSelectedService(null);
    },
  });

  // Mutation for update
  const updateServiceMutation = useMutationAdapter(({ serviceId, payload }) => ServicesApi.updateService(serviceId, payload), {
    successMessage: "Servicio actualizado exitosamente",
    invalidateQueries: [serviceKeys.list(filters)],
    onSuccess: () => {
      reset();
      setShowForm(false);
      setSelectedService(null);
    },
  });

  // Mutation for delete
  const deleteServiceMutation = useMutationAdapter((serviceId) => ServicesApi.deleteService(serviceId), {
    successMessage: "Servicio eliminado exitosamente",
    invalidateQueries: [serviceKeys.list(filters)],
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setSelectedService(null);
    },
  });

  /* ================= CREATE / UPDATE ================= */
  const onSubmit = async (values) => {
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || "",
      active: values.active !== undefined ? values.active : true,
    };

    // Determine tenantId - use form value for superadmin, userTenantId for admin
    const tenantIdToUse = isSuperAdmin ? values.tenantId : userTenantId;

    if (mode === "edit") {
      updateServiceMutation.mutate({
        serviceId: selectedService._id,
        payload,
      });
    } else {
      createServiceMutation.mutate({
        tenantId: tenantIdToUse,
        payload,
      });
    }
  };

  /* ================= EDIT ================= */
  const handleEditService = useCallback(
    (service) => {
      setMode("edit");
      setSelectedService(service);

      reset({
        name: service.name || "",
        description: service.description || "",
        tenantId: service.tenantId?._id || service.tenantId || "",
        active: service.active !== undefined ? service.active : true,
      });

      setShowForm(true);
    },
    [reset]
  );

  /* ================= DELETE ================= */
  const handleAskDelete = useCallback((service) => {
    setSelectedService(service);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedService?._id) {
      deleteServiceMutation.mutate(selectedService._id);
    }
  }, [selectedService, deleteServiceMutation]);

  const handleShowForm = useCallback(() => {
    setMode("create");
    setSelectedService(null);
    reset({
      name: "",
      description: "",
      tenantId: isSuperAdmin ? "" : userTenantId || "",
      active: true,
    });
    setShowForm(true);
  }, [reset, isSuperAdmin, userTenantId]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const loading = loadingServices || loadingTenants;

  return {
    // Data
    services,
    tenants,
    loading,
    isSuperAdmin,
    userTenantId,

    // UI State
    showForm,
    showDeleteConfirm,
    selectedService,
    FORM_FIELDS,
    mode,
    filters,

    // Form methods
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    watch,
    setValue,

    // Actions
    handleShowForm,
    handleEditService,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
    deleteServiceMutation,
    setShowForm,
  };
};
