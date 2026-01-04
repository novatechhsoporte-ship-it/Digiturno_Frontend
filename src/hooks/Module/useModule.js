import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { ModulesApi } from "@core/api/modules";
import { TenantsApi } from "@core/api/tenants";
import { useCustomForm } from "@utils/useCustomForm";
import { moduleSchema, FORM_FIELDS } from "@schemas/Modules";

export const useModule = () => {
  const [modules, setModules] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [mode, setMode] = useState("create");
  const [filters, setFilters] = useState({
    tenantId: "",
    active: "",
    search: "",
  });

  const { register, handleSubmit, errors, isSubmitting, isDisabled, reset } = useCustomForm({
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

  const loadTenants = useCallback(async () => {
    try {
      const response = await TenantsApi.listTenants();
      setTenants(Array.isArray(response?.data) ? response.data : []);
    } catch {
      toast.error("Error loading tenants");
    }
  }, []);

  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.tenantId) params.tenantId = filters.tenantId;
      if (filters.active !== "") params.active = filters.active === "true";
      if (filters.search) params.search = filters.search;

      const response = await ModulesApi.listModules(params);
      setModules(Array.isArray(response?.data) ? response.data : []);
    } catch {
      toast.error("Error loading modules");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /* ================= CREATE / UPDATE ================= */
  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        ...(values.description && { description: values.description.trim() }),
        ...(values.attendantId && { attendantId: values.attendantId }),
        active: values.active,
      };

      if (mode === "edit") {
        await ModulesApi.updateModule(selectedModule._id, payload);
        toast.success("Módulo actualizado exitosamente");
      } else {
        await ModulesApi.createModule(values.tenantId, payload);
        toast.success("Módulo creado exitosamente");
      }

      reset();
      setShowForm(false);
      setSelectedModule(null);
      loadModules();
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message || "Operación fallida");
    }
  };

  /* ================= EDIT ================= */
  const handleEditModule = (module) => {
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
  };

  /* ================= DELETE ================= */
  const handleAskDelete = (module) => {
    setSelectedModule(module);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await ModulesApi.deleteModule(selectedModule._id);
      toast.success("Módulo eliminado");
      setShowDeleteConfirm(false);
      setSelectedModule(null);
      loadModules();
    } catch {
      toast.error("Error al eliminar módulo");
    }
  };

  const handleShowForm = () => {
    setMode("create");
    setSelectedModule(null);
    reset();
    setShowForm(!showForm);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  return {
    //Props
    modules,
    tenants,
    loading,
    showForm,
    showDeleteConfirm,
    selectedModule,
    FORM_FIELDS,
    mode,
    filters,

    //methods
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    handleShowForm,
    handleEditModule,
    handleAskDelete,
    handleConfirmDelete,
    setShowDeleteConfirm,
    handleFilterChange,
  };
};

