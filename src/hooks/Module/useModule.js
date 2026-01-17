import { useState, useCallback, useMemo, useEffect } from "react";
import { ModulesApi } from "@core/api/modules";
import { TenantsApi } from "@core/api/tenants";
import { useCustomForm } from "@utils/useCustomForm.jsx";
import { moduleSchema, FORM_FIELDS } from "@schemas/Modules";
import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";

const moduleKeys = createQueryKeyFactory("modules");

export const useModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [mode, setMode] = useState("create");
  const [filters, setFilters] = useState({
    tenantId: "",
    active: "",
    search: "",
  });

  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset, watch, setValue } = useCustomForm({
    schema: moduleSchema,
    formOptions: {
      defaultValues: {
        name: "",
        description: "",
        tenantId: "",
        attendantId: "",
        active: true,
      },
    },
  });

  // Watch tenantId to load available attendants when it changes
  const selectedTenantId = watch("tenantId");
  // Get current module ID when editing
  const currentModuleId = mode === "edit" && selectedModule?._id ? selectedModule._id : null;

  // Query for tenants
  const { data: tenantsResponse = [], isLoading: loadingTenants } = useQueryAdapter(
    ["tenants", "list"],
    () => TenantsApi.listTenants(),
    {
      enabled: true,
      showErrorToast: true,
    }
  );

  const tenants = tenantsResponse?.data ?? [];

  // Query for modules
  const {
    data: modulesResponse = [],
    isLoading: loadingModules,
    refetch: refetchModules,
  } = useQueryAdapter(
    moduleKeys.list(filters),
    () => {
      const params = {};
      if (filters.tenantId) params.tenantId = filters.tenantId;
      if (filters.active !== "") params.active = filters.active === "true";
      if (filters.search) params.search = filters.search;

      return ModulesApi.listModules(params);
    },
    {
      enabled: true,
      showErrorToast: true,
    }
  );

  const modules = modulesResponse?.data ?? [];

  // Query for available attendants (only when tenant is selected)
  // Include moduleId when editing to show current attendant
  const { data: responseAttendants = [], isLoading: loadingAttendants } = useQueryAdapter(
    ["modules", "available-attendants", selectedTenantId, currentModuleId],
    () => ModulesApi.getAvailableAttendants(selectedTenantId, currentModuleId),
    {
      enabled: Boolean(selectedTenantId),
      showErrorToast: false,
    }
  );

  const availableAttendants = responseAttendants?.data ?? [];

  // Mutation for create/update
  const createModuleMutation = useMutationAdapter(({ tenantId, payload }) => ModulesApi.createModule(tenantId, payload), {
    successMessage: "Módulo creado exitosamente",
    invalidateQueries: [moduleKeys.list(filters)],
    onSuccess: () => {
      reset();
      setShowForm(false);
      setSelectedModule(null);
    },
  });

  const updateModuleMutation = useMutationAdapter(({ moduleId, payload }) => ModulesApi.updateModule(moduleId, payload), {
    successMessage: "Módulo actualizado exitosamente",
    invalidateQueries: [moduleKeys.list(filters)],
    onSuccess: () => {
      reset();
      setShowForm(false);
      setSelectedModule(null);
    },
  });

  // Mutation for delete
  const deleteModuleMutation = useMutationAdapter((moduleId) => ModulesApi.deleteModule(moduleId), {
    successMessage: "Módulo eliminado exitosamente",
    invalidateQueries: [moduleKeys.list(filters)],
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setSelectedModule(null);
    },
  });

  /* ================= CREATE / UPDATE ================= */
  const onSubmit = async (values) => {
    const payload = {
      name: values.name.trim(),
      ...(values.description && { description: values.description.trim() }),
      ...(values.attendantId && values.attendantId.trim() !== "" && { attendantId: values.attendantId }),
      active: values.active,
    };

    if (values.attendantId === "" || !values.attendantId) {
      delete payload.attendantId;
    }

    if (mode === "edit") {
      updateModuleMutation.mutate({
        moduleId: selectedModule._id,
        payload,
      });
    } else {
      createModuleMutation.mutate({
        tenantId: values.tenantId,
        payload,
      });
    }
  };

  /* ================= EDIT ================= */
  const handleEditModule = useCallback(
    (module) => {
      reset();

      setMode("edit");
      setSelectedModule(module);

      reset({
        name: module.name || "",
        description: module.description || "",
        tenantId: module.tenantId?._id || module.tenantId || "",
        attendantId: module.attendantId?._id || module.attendantId || "",
        active: module.active ?? true,
      });

      setShowForm(true);
    },
    [reset]
  );

  /* ================= DELETE ================= */
  const handleAskDelete = useCallback((module) => {
    setSelectedModule(module);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedModule?._id) {
      deleteModuleMutation.mutate(selectedModule._id);
    }
  }, [selectedModule, deleteModuleMutation]);

  const handleShowForm = useCallback(() => {
    setMode("create");
    setSelectedModule(null);
    reset();
    setShowForm((prev) => !prev);
  }, [reset]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const currentAttendant = selectedModule?.attendantId
    ? {
        _id: selectedModule.attendantId._id || selectedModule.attendantId,
        fullName: selectedModule.attendantId.fullName,
        email: selectedModule.attendantId.email,
      }
    : null;

  const attendantOptions = useMemo(() => {
    const baseOptions = availableAttendants.map((attendant) => ({
      value: attendant._id,
      label: attendant.fullName || attendant.email || "Sin nombre",
    }));

    if (mode === "edit" && currentAttendant) {
      const exists = baseOptions.some((opt) => opt.value === currentAttendant._id);

      if (!exists) {
        return [
          {
            value: currentAttendant._id,
            label: currentAttendant.fullName || currentAttendant.email || "Sin nombre",
          },
          ...baseOptions,
        ];
      }
    }

    return baseOptions;
  }, [availableAttendants, currentAttendant, mode]);

  useEffect(() => {
    if (mode !== "edit" || !selectedModule?.attendantId) return;

    setValue("attendantId", selectedModule.attendantId._id || selectedModule.attendantId, { shouldDirty: false });
  }, [selectedModule?._id, mode, setValue]);

  useEffect(() => {
    if (mode === "edit" && selectedModule?.attendantId && availableAttendants.length >= 0) {
      setValue("attendantId", selectedModule.attendantId._id || selectedModule.attendantId);
    }
  }, [mode, selectedModule, availableAttendants, setValue]);

  const loading = loadingModules || loadingTenants;

  return {
    // Data
    modules,
    tenants,
    availableAttendants,
    attendantOptions,
    loading,
    loadingAttendants,

    // UI State
    showForm,
    showDeleteConfirm,
    selectedModule,
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

    // Actions
    handleShowForm,
    handleEditModule,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
    deleteModuleMutation,
  };
};
