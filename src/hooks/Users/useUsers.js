import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";

import { useAbility } from "@hooks/";
import { USER_PERMISSIONS } from "@core/permissions";
import { UsersApi } from "@core/api/users";
import { TenantsApi } from "@core/api/tenants";
import { useCustomForm } from "@utils/useCustomForm";
import { userSchema, FORM_FIELDS, DEFAULT_FORM_VALUES, ROLE_LABELS } from "@schemas/Users";
import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory, QUERY_PRESETS } from "@config/adapters/queryAdapter";

const usersKeys = createQueryKeyFactory("users");

export const useUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    tenantId: "",
    roleName: "",
    status: "",
    search: "",
  });

  const { canAny } = useAbility();
  const mode = selectedUser ? "edit" : "create";

  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset } = useCustomForm({
    schema: userSchema,
    formOptions: {
      defaultValues: DEFAULT_FORM_VALUES,
    },
  });

  // Query for tenants
  const { data: tenants = [] } = useQueryAdapter(["tenants", "list"], () => TenantsApi.listTenants(), {
    enabled: true,
    showErrorToast: true,
    staleTime: QUERY_PRESETS.SEMI_STATIC,
  });

  const buildUserListParams = (filters) => {
    const params = {};

    if (filters.tenantId) params.tenantId = filters.tenantId;
    if (filters.roleName) params.roleName = filters.roleName;
    if (filters.status !== "") params.status = filters.status === "true";
    if (filters.search) params.search = filters.search;

    return params;
  };

  const userListParams = useMemo(() => buildUserListParams(filters), [filters]);

  // Query for users
  const { data: users = [], isLoading: loadingUsers } = useQueryAdapter(
    usersKeys.list(filters),
    () => UsersApi.listUsers(userListParams),
    {
      enabled: true,
      showErrorToast: true,
      keepPreviousData: true,
    }
  );

  const buildPayload = (values, mode) => {
    const payload = {
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      status: values.status,
      ...(values.roleName && { roleName: values.roleName }),
      ...(values.tenantId && { tenantId: values.tenantId }),
      ...(values.documentType && { documentType: values.documentType }),
      ...(values.documentNumber && { documentNumber: values.documentNumber.trim() }),
    };

    if (values.password?.trim()) {
      payload.password = values.password;
    }

    return payload;
  };

  const onFormSuccess = () => {
    reset(DEFAULT_FORM_VALUES);
    setShowForm(false);
    setSelectedUser(null);
  };

  const invalidateQueries = [usersKeys.list(filters), ["users"]];
  const updateModuleMutation = useMutationAdapter(({ selectedUser, payload }) => UsersApi.updateUser(selectedUser._id, payload), {
    successMessage: "Usuario actualizado exitosamente",
    invalidateQueries,
    onSuccess: onFormSuccess,
  });

  const createModuleMutation = useMutationAdapter(({ payload }) => UsersApi.createUser(payload), {
    successMessage: "Usuario creado exitosamente",
    invalidateQueries,
    onSuccess: onFormSuccess,
  });

  const deleteModuleMutation = useMutationAdapter((userId) => UsersApi.deleteUser(userId), {
    successMessage: "Usuario eliminado exitosamente",
    invalidateQueries: [usersKeys.list(filters)],
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    },
  });

  /* ================= CREATE / UPDATE ================= */
  const onSubmit = async (values) => {
    try {
      if (mode === "create" && !values.password?.trim()) {
        toast.error("La contraseña es requerida para crear un usuario");
        return;
      }

      const payload = buildPayload(values, mode);

      if (mode === "edit") {
        updateModuleMutation.mutate({ selectedUser, payload });
      } else {
        createModuleMutation.mutate({ payload });
      }

      reset(DEFAULT_FORM_VALUES);
      setShowForm(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message || "Operación fallida");
    }
  };

  /* ================= EDIT ================= */
  const handleEditUser = (user) => {
    setSelectedUser(user);

    reset({
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
      roleName: user.roles?.[0]?.name || "",
      tenantId: user.tenantId?._id || user.tenantId || "",
      documentType: user.documentType || "",
      documentNumber: user.documentNumber || "",
      status: user.status ?? true,
    });

    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleAskDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = useCallback(() => {
    if (selectedUser?._id) {
      deleteModuleMutation.mutate(selectedUser._id);
    }
  }, [selectedUser, deleteModuleMutation]);

  const handleShowForm = () => {
    if (showForm) {
      reset(DEFAULT_FORM_VALUES);
      setSelectedUser(null);
    }
    setShowForm(!showForm);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const tableActions = useMemo(
    () =>
      [
        {
          icon: "mdi:pencil",
          tooltip: "Editar",
          color: "primary",
          onClick: handleEditUser,
          visible: canAny([USER_PERMISSIONS.UPDATE, USER_PERMISSIONS.MANAGE]),
        },
        {
          icon: "mdi:delete",
          tooltip: "Eliminar",
          color: "danger",
          onClick: handleAskDelete,
          visible: canAny([USER_PERMISSIONS.DELETE, USER_PERMISSIONS.MANAGE]),
        },
      ].filter((a) => a.visible !== false),
    [canAny, handleEditUser, handleAskDelete]
  );

  const optionsMap = useMemo(
    () => ({
      tenantId: tenants.map((t) => ({ value: t._id, label: t.name })),
      roleName: Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
      documentType: [
        { value: "CC", label: "Cédula de Ciudadanía" },
        { value: "CE", label: "Cédula de Extranjería" },
        { value: "NIT", label: "NIT" },
        { value: "PA", label: "Pasaporte" },
      ],
      tenantsOptions: [
        { value: "", label: "Todas las notarías" },
        ...tenants.map((tenant) => ({
          value: tenant._id,
          label: tenant.name,
        })),
      ],
    }),
    [tenants]
  );

  useEffect(() => {
    if (!showForm) {
      reset(DEFAULT_FORM_VALUES);
      setSelectedUser(null);
    }
  }, [showForm, reset]);

  return {
    //Props
    users,
    tenants,
    loading: loadingUsers,
    showForm,
    showDeleteConfirm,
    selectedUser,
    FORM_FIELDS,
    mode,
    filters,
    tableActions,
    optionsMap,

    //methods
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    handleShowForm,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
  };
};
