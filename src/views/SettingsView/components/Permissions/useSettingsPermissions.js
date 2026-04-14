import { useState, useEffect, useCallback, useMemo } from "react";
import { axiosClient } from "@config/adapters/axiosClient";
import { toast } from "sonner";

export const useSettingsPermissions = () => {
  const [publicPermissions, setPublicPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const fetchInitialData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [permissionsRes, usersRes, modulesRes] = await Promise.all([
        axiosClient.get("/permissions/public/list"),
        axiosClient.get("/admin/users"),
        axiosClient.get("/modules"),
      ]);

      setPublicPermissions(permissionsRes.data || []);
      setUsers(usersRes.data || []);
      setModules(modulesRes.data || []);
    } catch (error) {
      console.error("Error fetching permissions data:", error);
      toast.error("Error al cargar los datos de permisos.");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Derive fresh data for the selected entity from the current lists
  const selectedEntity = useMemo(() => {
    if (!selectedEntityId) return null;
    const { type, id } = selectedEntityId;
    const list = type === "user" ? users : modules;
    const data = list.find((item) => (item._id || item.id) === id);
    return data ? { type, data } : null;
  }, [selectedEntityId, users, modules]);

  const handleOpenAssignModal = (entity, type) => {
    setSelectedEntityId({ type, id: entity._id || entity.id });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntityId(null);
  };

  const handleAssignPermission = async (permissionId) => {
    if (!selectedEntity) return;

    try {
      const { type, data } = selectedEntity;
      const endpoint = `/permissions/assign/${type}/${data._id || data.id}`;

      await axiosClient.post(endpoint, { permissionId });
      toast.success("Permiso asignado correctamente");
      fetchInitialData(true);
    } catch (error) {
      console.error("Error assigning permission:", error);
      toast.error("Error al asignar permiso");
    }
  };

  const handleRemovePermission = async (permissionId) => {
    if (!selectedEntity) return;

    try {
      const { type, data } = selectedEntity;
      const endpoint = `/permissions/assign/${type}/${data._id || data.id}`;

      await axiosClient.delete(endpoint, { data: { permissionId } });
      toast.success("Permiso removido correctamente");
      fetchInitialData(true);
    } catch (error) {
      console.error("Error removing permission:", error);
      toast.error("Error al remover permiso");
    }
  };

  return {
    publicPermissions,
    users,
    modules,
    isLoading,
    activeTab,
    setActiveTab,
    selectedEntity,
    isModalOpen,
    handleOpenAssignModal,
    handleCloseModal,
    handleAssignPermission,
    handleRemovePermission,
  };
};
