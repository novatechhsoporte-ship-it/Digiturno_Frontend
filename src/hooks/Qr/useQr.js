import { useState, useCallback, useMemo } from "react";
import { QrApi } from "@core/api/qr";
import { TenantsApi } from "@core/api/tenants";
import { useCustomForm } from "@utils/useCustomForm.jsx";
import { qrSchema, FORM_FIELDS } from "@schemas/Qr";
import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { useAuth } from "@/store/authStore";

const qrKeys = createQueryKeyFactory("qr");

export const useQr = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("SUPERADMIN") || false;
  const userTenantId = user?.tenantId;

  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedQr, setSelectedQr] = useState(null);
  const [mode, setMode] = useState("create");
  const [filters, setFilters] = useState({
    tenantId: isSuperAdmin ? "" : userTenantId || "",
    search: "",
  });

  // Form for QR
  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset, watch, setValue } = useCustomForm({
    schema: qrSchema,
    formOptions: {
      defaultValues: {
        tenantId: isSuperAdmin ? "" : userTenantId || "",
        expiresAt: "",
      },
    },
  });

  // Query for tenants
  const { data: tenants = [], isLoading: loadingTenants } = useQueryAdapter(
    ["tenants", "list"],
    () => TenantsApi.listTenants(),
    {
      enabled: true,
      showErrorToast: true,
    }
  );

  // Query for QR codes
  const {
    data: qrCodesResponse = [],
    isLoading: loadingQrCodes,
    refetch: refetchQrCodes,
  } = useQueryAdapter(
    qrKeys.list(filters),
    () => {
      // If not super admin, use user's tenantId
      const tenantIdToUse = isSuperAdmin ? filters.tenantId : userTenantId;
      return QrApi.listQrCodes(tenantIdToUse || "");
    },
    {
      enabled: isSuperAdmin ? Boolean(filters.tenantId) : Boolean(userTenantId),
      showErrorToast: true,
    }
  );

  const qrCodes = Array.isArray(qrCodesResponse)
    ? qrCodesResponse
    : Array.isArray(qrCodesResponse?.data)
      ? qrCodesResponse.data
      : [];

  // Mutation for create
  const createQrMutation = useMutationAdapter((payload) => QrApi.createPublicAccess(payload), {
    successMessage: "Código QR creado exitosamente",
    invalidateQueries: [qrKeys.list(filters)],
    onSuccess: (data) => {
      // Refetch QR list to get the new QR with all data
      refetchQrCodes();
      reset();
      setShowForm(false);
      setSelectedQr(null);
    },
  });

  // Mutation for update
  const updateQrMutation = useMutationAdapter(({ qrId, payload }) => QrApi.updateQrCode(qrId, payload), {
    successMessage: "Código QR actualizado exitosamente",
    invalidateQueries: [qrKeys.list(filters)],
    onSuccess: () => {
      reset();
      setShowForm(false);
      setSelectedQr(null);
    },
  });

  // Mutation for delete
  const deleteQrMutation = useMutationAdapter((qrId) => QrApi.deleteQrCode(qrId), {
    successMessage: "Código QR eliminado exitosamente",
    invalidateQueries: [qrKeys.list(filters)],
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setSelectedQr(null);
    },
  });

  /* ================= CREATE / UPDATE ================= */
  const onSubmit = async (values) => {
    const payload = {
      tenantId: values.tenantId,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : null,
    };

    if (mode === "edit") {
      const isActiveValue = watch("isActive");
      updateQrMutation.mutate({
        qrId: selectedQr._id,
        payload: {
          isActive: isActiveValue !== undefined ? isActiveValue : selectedQr.isActive,
          expiresAt: payload.expiresAt,
        },
      });
    } else {
      createQrMutation.mutate(payload);
    }
  };

  /* ================= EDIT ================= */
  const handleEditQr = useCallback(
    async (qr) => {
      setMode("edit");
      setSelectedQr(qr);

      // Fetch full QR data to get qrBase64 and publicUrl
      try {
        const response = await QrApi.getQrById(qr._id);
        const fullQrData = response.data?.data || response.data || qr;
        setSelectedQr(fullQrData);

        reset({
          tenantId: fullQrData.tenantId?._id || fullQrData.tenantId || "",
          expiresAt: fullQrData.expiresAt ? new Date(fullQrData.expiresAt).toISOString().slice(0, 16) : "",
          isActive: fullQrData.isActive,
        });
      } catch (error) {
        console.error("Error fetching QR details:", error);
        // Fallback to original qr data
        reset({
          tenantId: qr.tenantId?._id || qr.tenantId || "",
          expiresAt: qr.expiresAt ? new Date(qr.expiresAt).toISOString().slice(0, 16) : "",
          isActive: qr.isActive,
        });
      }

      setShowForm(true);
    },
    [reset]
  );

  /* ================= DELETE ================= */
  const handleAskDelete = useCallback((qr) => {
    setSelectedQr(qr);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedQr?._id) {
      deleteQrMutation.mutate(selectedQr._id);
    }
  }, [selectedQr, deleteQrMutation]);

  const handleShowForm = useCallback(() => {
    setMode("create");
    setSelectedQr(null);
    reset({
      tenantId: isSuperAdmin ? "" : userTenantId || "",
      expiresAt: "",
    });
    setShowForm(true);
  }, [reset, isSuperAdmin, userTenantId]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const loading = loadingQrCodes || loadingTenants;

  return {
    // Data
    qrCodes,
    tenants,
    loading,
    isSuperAdmin,
    userTenantId,

    // UI State
    showForm,
    showDeleteConfirm,
    selectedQr,
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
    handleEditQr,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
    deleteQrMutation,
    setShowForm,
  };
};

