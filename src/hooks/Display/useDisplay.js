import { useState, useCallback, useMemo } from "react";
import { DisplaysApi } from "@core/api/displays";
import { TenantsApi } from "@core/api/tenants";
import { ModulesApi } from "@core/api/modules";
import { useCustomForm } from "@utils/useCustomForm.jsx";
import { displaySchema, pairingCodeSchema, FORM_FIELDS } from "@schemas/Displays";
import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { useAuth } from "@/store/authStore";

const displayKeys = createQueryKeyFactory("displays");

export const useDisplay = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("SUPERADMIN") || false;
  const userTenantId = user?.tenantId;

  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [pairingCode, setPairingCode] = useState("");
  const [mode, setMode] = useState("create");
  const [filters, setFilters] = useState({
    tenantId: isSuperAdmin ? "" : userTenantId || "",
    status: "",
    search: "",
  });

  // Form for display
  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset, watch, setValue } = useCustomForm({
    schema: displaySchema,
    formOptions: {
      defaultValues: {
        name: "",
        type: "TV",
        location: "",
        tenantId: isSuperAdmin ? "" : userTenantId || "",
        moduleIds: [],
        pairingCode: "",
      },
    },
  });

  // Form for pairing code
  const {
    register: registerPairing,
    handleSubmit: handleSubmitPairing,
    errors: errorsPairing,
    isSubmitting: isSubmittingPairing,
    isDisabled: isDisabledPairing,
    reset: resetPairing,
  } = useCustomForm({
    schema: pairingCodeSchema,
    formOptions: {
      defaultValues: {
        pairingCode: "",
      },
    },
  });

  // Watch tenantId to load modules when it changes
  const selectedTenantId = watch("tenantId");
  const currentDisplayId = mode === "edit" && selectedDisplay?._id ? selectedDisplay._id : null;

  // Query for tenants
  const { data: tenants = [], isLoading: loadingTenants } = useQueryAdapter(["tenants", "list"], () => TenantsApi.listTenants(), {
    enabled: true,
    showErrorToast: true,
  });

  console.log("tenants ss:>> ", tenants);

  // Query for displays
  const {
    data: displaysReponse = [],
    isLoading: loadingDisplays,
    refetch: refetchDisplays,
  } = useQueryAdapter(
    displayKeys.list(filters),
    () => {
      // If not super admin, use user's tenantId
      const tenantIdToUse = isSuperAdmin ? filters.tenantId : userTenantId;
      return DisplaysApi.listDisplays(tenantIdToUse || "");
    },
    {
      enabled: isSuperAdmin ? Boolean(filters.tenantId) : Boolean(userTenantId),
      showErrorToast: true,
    }
  );

  const displays = Array.isArray(displaysReponse)
    ? displaysReponse
    : Array.isArray(displaysReponse?.data)
      ? displaysReponse.data
      : [];

  // const {
  //   data: currentTicketResponse,
  //   isLoading: loadingCurrent,
  //   refetch: refetchCurrentTicket,
  // } = useQueryAdapter(["tickets", "current", filters.tenantId], () => TicketsApi.getCurrentAttendantTicket(filters.tenantId), {
  //   enabled: Boolean(filters.tenantId),
  //   staleTime: Infinity,
  //   cacheTime: Infinity,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  // });

  // const currentTicket = useMemo(() => {
  //   if (!currentTicketResponse) return null;

  //   const data = currentTicketResponse?.data?.data || currentTicketResponse?.data;
  //   if (!data || (typeof data === "object" && !Array.isArray(data) && Object.keys(data).length === 0)) {
  //     return null;
  //   }

  //   return data;
  // }, [currentTicketResponse]);

  // Query for modules (for multiselect)
  const { data: modulesResponse = [] } = useQueryAdapter(
    ["modules", "list", selectedTenantId],
    () => ModulesApi.listModules({ tenantId: selectedTenantId, active: true }),
    {
      enabled: Boolean(selectedTenantId),
      showErrorToast: false,
    }
  );

  const modules = useMemo(() => {
    console.log("modulesResponse :>> ", modulesResponse);
    if (!modulesResponse) return null;

    const data = modulesResponse?.data?.data || modulesResponse?.data;
    if (!data || (typeof data === "object" && !Array.isArray(data) && Object.keys(data).length === 0)) {
      return null;
    }

    return data;
  }, [modulesResponse]);

  console.log("modules fuera:>> ", modules);

  // Mutation for create/update
  const createDisplayMutation = useMutationAdapter(({ tenantId, payload }) => DisplaysApi.confirmPairing(payload), {
    successMessage: "Pantalla registrada exitosamente",
    invalidateQueries: [displayKeys.list(filters)],
    onSuccess: () => {
      reset();
      setShowForm(false);
      setShowPairingModal(false);
      resetPairing();
      setSelectedDisplay(null);
      setPairingCode("");
    },
  });

  const updateDisplayMutation = useMutationAdapter(({ displayId, payload }) => DisplaysApi.updateDisplay(displayId, payload), {
    successMessage: "Pantalla actualizada exitosamente",
    invalidateQueries: [displayKeys.list(filters)],
    onSuccess: () => {
      reset();
      setShowForm(false);
      setSelectedDisplay(null);
    },
  });

  // Mutation for delete
  const deleteDisplayMutation = useMutationAdapter((displayId) => DisplaysApi.deleteDisplay(displayId), {
    successMessage: "Pantalla eliminada exitosamente",
    invalidateQueries: [displayKeys.list(filters)],
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setSelectedDisplay(null);
    },
  });

  /* ================= PAIRING CODE SUBMIT ================= */
  const onSubmitPairingCode = useCallback(
    async (values) => {
      // Store pairing code and show form modal
      setPairingCode(values.pairingCode);
      setShowPairingModal(false);
      setShowForm(true);
      // Set pairing code and tenantId in form
      setValue("pairingCode", values.pairingCode);
      if (!isSuperAdmin && userTenantId) {
        setValue("tenantId", userTenantId);
      }
    },
    [setValue, isSuperAdmin, userTenantId]
  );

  /* ================= CREATE / UPDATE ================= */
  const onSubmit = async (values) => {
    const payload = {
      pairingCode: values.pairingCode || "",
      name: values.name.trim(),
      type: values.type,
      location: values.location?.trim() || "",
      tenantId: values.tenantId,
      moduleIds: Array.isArray(values.moduleIds) ? values.moduleIds : [],
    };

    if (mode === "edit") {
      updateDisplayMutation.mutate({
        displayId: selectedDisplay._id,
        payload: {
          name: payload.name,
          type: payload.type,
          location: payload.location,
          moduleIds: payload.moduleIds,
        },
      });
    } else {
      // Create via pairing confirmation
      createDisplayMutation.mutate({
        tenantId: values.tenantId,
        payload,
      });
    }
  };

  /* ================= EDIT ================= */
  const handleEditDisplay = useCallback(
    (display) => {
      setMode("edit");
      setSelectedDisplay(display);

      reset({
        name: display.name || "",
        type: display.type || "TV",
        location: display.location || "",
        tenantId: display.tenantId?._id || display.tenantId || "",
        moduleIds: display.moduleIds?.map((m) => m._id || m) || [],
        pairingCode: "", // Not needed for edit
      });

      setShowForm(true);
    },
    [reset]
  );

  /* ================= DELETE ================= */
  const handleAskDelete = useCallback((display) => {
    setSelectedDisplay(display);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedDisplay?._id) {
      deleteDisplayMutation.mutate(selectedDisplay._id);
    }
  }, [selectedDisplay, deleteDisplayMutation]);

  const handleShowForm = useCallback(() => {
    setMode("create");
    setSelectedDisplay(null);
    setPairingCode("");
    reset({
      name: "",
      type: "TV",
      location: "",
      tenantId: isSuperAdmin ? "" : userTenantId || "",
      moduleIds: [],
      pairingCode: "",
    });
    resetPairing();
    setShowPairingModal(true);
  }, [reset, resetPairing, isSuperAdmin, userTenantId]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Prepare module options for multiselect
  const moduleOptions = useMemo(() => {
    return modules?.map((module) => ({
      value: module._id,
      label: module.name,
    }));
  }, [modules]);

  const loading = loadingDisplays || loadingTenants;

  return {
    // Data
    displays,
    tenants,
    modules,
    moduleOptions,
    loading,
    isSuperAdmin,
    userTenantId,

    // UI State
    showForm,
    showDeleteConfirm,
    showPairingModal,
    selectedDisplay,
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

    // Pairing form methods
    registerPairing,
    handleSubmitPairing,
    errorsPairing,
    isSubmittingPairing,
    isDisabledPairing,
    onSubmitPairingCode,
    watch,
    setValue,

    // Actions
    handleShowForm,
    handleEditDisplay,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    setShowPairingModal,
    handleFilterChange,
    deleteDisplayMutation,
    setShowForm,
  };
};
