import { useState, useCallback, useMemo } from "react";

import { ServicesApi } from "@core/api/services";
import { TenantsApi } from "@core/api/tenants";
import { useAuth } from "@/store/authStore";
import { useAbility } from "@hooks/";
import { useCustomForm } from "@utils/useCustomForm";
import { serviceSchema, DEFAULT_SERVICE_VALUES, FORM_FIELDS } from "@schemas/Services";
import { createQueryKeyFactory, useMutationAdapter, useQueryAdapter, QUERY_PRESETS } from "@config/adapters/queryAdapter";

const serviceKeys = createQueryKeyFactory("services");

export const useServices = () => {
  const { user } = useAuth();
  const { isSuperAdmin } = useAbility();

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

  const { register, handleSubmit, errors, isSubmitting, reset, watch, setValue } = useCustomForm({
    schema: serviceSchema,
    formOptions: {
      defaultValues: {
        ...DEFAULT_SERVICE_VALUES,
        tenantId: isSuperAdmin ? "" : userTenantId || "",
      },
    },
  });

  const isDisabled = isSubmitting;

  const { data: tenantsRaw = [], isLoading: loadingTenants } = useQueryAdapter(
    ["tenants", "list"],
    () => TenantsApi.listTenants(),
    {
      enabled: isSuperAdmin,
      showErrorToast: true,
      staleTime: QUERY_PRESETS.SEMI_STATIC.staleTime,
    }
  );

  const tenants = useMemo(() => tenantsRaw?.data ?? tenantsRaw ?? [], [tenantsRaw]);

  const { data: servicesRaw = [], isLoading: loadingServices } = useQueryAdapter(
    serviceKeys.list(filters),
    () => {
      const params = {};
      const tenantIdToUse = isSuperAdmin ? filters.tenantId : userTenantId;
      if (tenantIdToUse) params.tenantId = tenantIdToUse;
      if (filters.active !== "") params.active = filters.active === "true";
      if (filters.search) params.search = filters.search;
      return ServicesApi.listServices(params);
    },
    {
      enabled: isSuperAdmin ? true : Boolean(userTenantId),
      showErrorToast: true,
    }
  );

  const services = useMemo(() => servicesRaw?.data ?? servicesRaw ?? [], [servicesRaw]);

  const _closeForm = useCallback(() => {
    setShowForm(false);
    setSelectedService(null);
    setMode("create");
  }, []);

  const _buildPayload = (values) => ({
    name: values.name,
    ...(values.description && { description: values.description }),
    active: values.active ?? true,
  });

  const { mutateAsync: createService, isPending: creating } = useMutationAdapter(
    ({ tenantId, payload }) => ServicesApi.createService(tenantId, payload),
    {
      successMessage: "Servicio creado exitosamente",
      invalidateQueries: [serviceKeys.lists()],
      onSuccess: () => {
        reset({ ...DEFAULT_SERVICE_VALUES, tenantId: isSuperAdmin ? "" : userTenantId || "" });
        _closeForm();
      },
    }
  );

  const { mutateAsync: updateService, isPending: updating } = useMutationAdapter(
    ({ serviceId, payload }) => ServicesApi.updateService(serviceId, payload),
    {
      successMessage: "Servicio actualizado exitosamente",
      invalidateQueries: [serviceKeys.lists()],
      onSuccess: () => {
        reset({ ...DEFAULT_SERVICE_VALUES, tenantId: isSuperAdmin ? "" : userTenantId || "" });
        _closeForm();
      },
    }
  );

  const { mutate: deleteService, isPending: deleting } = useMutationAdapter((serviceId) => ServicesApi.deleteService(serviceId), {
    successMessage: "Servicio eliminado exitosamente",
    invalidateQueries: [serviceKeys.lists()],
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setSelectedService(null);
    },
  });

  const onSubmit = useCallback(
    async (values) => {
      const payload = _buildPayload(values);

      if (mode === "edit") {
        await updateService({ serviceId: selectedService._id, payload });
      } else {
        const tenantIdToUse = isSuperAdmin ? values.tenantId : userTenantId;
        await createService({ tenantId: tenantIdToUse, payload });
      }
    },
    [mode, selectedService, isSuperAdmin, userTenantId, createService, updateService]
  );

  const handleShowForm = useCallback(() => {
    setMode("create");
    setSelectedService(null);
    reset({ ...DEFAULT_SERVICE_VALUES, tenantId: isSuperAdmin ? "" : userTenantId || "" });
    setShowForm(true);
  }, [reset, isSuperAdmin, userTenantId]);

  const handleEditService = useCallback(
    (service) => {
      setMode("edit");
      setSelectedService(service);
      reset({
        name: service.name || "",
        description: service.description || "",
        tenantId: service.tenantId?._id || service.tenantId || "",
        active: service.active ?? true,
      });
      setShowForm(true);
    },
    [reset]
  );

  const handleAskDelete = useCallback((service) => {
    setSelectedService(service);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedService?._id) {
      deleteService(selectedService._id);
    }
  }, [selectedService, deleteService]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const loading = loadingServices || (isSuperAdmin && loadingTenants);
  const isMutating = creating || updating || deleting;

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

    // Form
    register,
    handleSubmit,
    errors,
    isSubmitting: isMutating,
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
    setShowForm,
    isDeleting: deleting,
  };
};
