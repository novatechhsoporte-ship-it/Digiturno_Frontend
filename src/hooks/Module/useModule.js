import { useState, useCallback, useMemo, useEffect } from "react";

import { useAuth } from "@/store/authStore";
import { ModulesApi } from "@core/api/modules";
import { TenantsApi } from "@core/api/tenants";
import { ServicesApi } from "@core/api/services";
import { useCustomForm } from "@utils/useCustomForm.jsx";
import { moduleSchema, FORM_FIELDS } from "@schemas/Modules";
import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory, QUERY_PRESETS } from "@config/adapters/queryAdapter";

const moduleKeys = createQueryKeyFactory("modules");

export const useModule = () => {
  const { user } = useAuth();
  const userTenantId = user?.tenantId ?? "";

  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [mode, setMode] = useState("create");
  const [filters, setFilters] = useState({
    tenantId: "",
    active: "",
    search: "",
  });

  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset, setValue } = useCustomForm({
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

  const resolvedTenantId = useMemo(() => {
    return userTenantId || filters.tenantId || null;
  }, [userTenantId, filters.tenantId]);

  // Query for tenants
  const { data: tenants = [], isLoading: loadingTenants } = useQueryAdapter(["tenants", "list"], () => TenantsApi.listTenants(), {
    enabled: true,
    showErrorToast: true,
    staleTime: QUERY_PRESETS.SEMI_STATIC,
  });

  // Query for services
  const { data: services = [] } = useQueryAdapter(["services", "list"], () => ServicesApi.listServices(), {
    enabled: true,
    showErrorToast: true,
    staleTime: QUERY_PRESETS.SEMI_STATIC,
  });

  // Query for modules
  const { data: modules = [], isLoading: loadingModules } = useQueryAdapter(
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

  // Query attendants
  const { data: attendants = [], isLoading: loadingAttendants } = useQueryAdapter(
    ["modules", "available-attendants", resolvedTenantId],
    () => ModulesApi.getAvailableAttendants(resolvedTenantId),
    {
      enabled: !!resolvedTenantId,
      showErrorToast: false,
    }
  );

  const optionsMap = useMemo(() => {
    const baseAttendants = attendants.map((a) => ({ value: a._id, label: a.fullName }));

    if (mode === "edit" && selectedModule?.attendantId) {
      const currentAttendant = selectedModule.attendantId;
      const currentId = currentAttendant._id || currentAttendant;
      const isAlreadyInList = baseAttendants.some((a) => a.value === currentId);

      if (!isAlreadyInList && currentAttendant.fullName) {
        baseAttendants.push({
          value: currentId,
          label: `${currentAttendant.fullName} (Actual)`,
        });
      }
    }

    return {
      tenantId: tenants.map((t) => ({ value: t._id, label: t.name })),
      modulesMap: modules.map((t) => ({ value: t._id, label: t.name })),
      attendantId: [{ value: "", label: "Sin asesor" }, ...baseAttendants],
      services: services.map((s) => ({ value: s._id, label: s.name })),
    };
  }, [tenants, modules, attendants, services, mode, selectedModule]);

  const availableAttendants = attendants ?? [];

  const onFormSuccess = () => {
    reset();
    setShowForm(false);
    setSelectedModule(null);
  };

  const invalidateQueries = [moduleKeys.list(filters), ["modules", "available-attendants", resolvedTenantId]];
  // Mutation for create/update
  const createModuleMutation = useMutationAdapter(({ tenantId, payload }) => ModulesApi.createModule(tenantId, payload), {
    successMessage: "Módulo creado exitosamente",
    invalidateQueries,
    onSuccess: onFormSuccess,
  });

  const updateModuleMutation = useMutationAdapter(({ moduleId, payload }) => ModulesApi.updateModule(moduleId, payload), {
    successMessage: "Módulo actualizado exitosamente",
    invalidateQueries,
    onSuccess: onFormSuccess,
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
    const tenantIdToUse = userTenantId || values.tenantId;

    if (!tenantIdToUse) {
      console.error("Tenant requerido");
      return;
    }

    const payload = {
      name: values.name.trim(),
      description: values?.description?.trim() ?? "",
      attendantId: values.attendantId === "" ? null : values.attendantId,
      active: values.active,
      services: Array.isArray(values.services) ? values.services : [values.services],
    };

    if (mode === "edit") {
      updateModuleMutation.mutate({
        moduleId: selectedModule._id,
        payload,
      });
    } else {
      createModuleMutation.mutate({
        tenantId: tenantIdToUse,
        payload,
      });
    }
  };

  /* ================= EDIT ================= */
  const handleEditModule = useCallback(
    (module) => {
      setMode("edit");
      setSelectedModule(module);
      const serviceId = Array.isArray(module.services)
        ? module.services[0]?._id || module.services[0]
        : module.services?._id || module.services;

      reset({
        name: module.name || "",
        description: module.description || "",
        tenantId: module.tenantId?._id || module.tenantId || "",
        attendantId: module.attendantId?._id || module.attendantId || "",
        active: module.active ?? true,
        services: serviceId || "",
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
    setFilters((prev) => {
      if (prev[key] === value) return prev;
      return { ...prev, [key]: value };
    });
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !selectedModule?.attendantId) return;

    setValue("attendantId", selectedModule.attendantId._id || selectedModule.attendantId, { shouldDirty: false });
  }, [selectedModule?._id, mode, setValue]);

  useEffect(() => {
    if (mode === "edit" && selectedModule?.attendantId && availableAttendants.length >= 0) {
      setValue("attendantId", selectedModule.attendantId._id || selectedModule.attendantId);
    }
  }, [mode, selectedModule, availableAttendants, setValue]);

  useEffect(() => {
    if (!userTenantId) return;

    // Setear tenant en el formulario
    setValue("tenantId", userTenantId, {
      shouldDirty: false,
      shouldValidate: true,
    });

    // Setear tenant en filtros
    setFilters((prev) => ({
      ...prev,
      tenantId: userTenantId,
    }));
  }, [userTenantId, setValue]);

  const loading = loadingModules || loadingTenants;

  return {
    // Data
    modules,
    tenants,
    availableAttendants,
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
    optionsMap,
  };
};
