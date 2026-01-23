import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { TenantsApi } from "@core/api/tenants";
import { ModulesApi } from "@core/api/modules";
import { useAuth } from "@/store/authStore";
import { useAbility } from "@hooks/";

/**
 * Hook for managing tenant and module filters
 */
export const useTicketFilters = () => {
  const { user: authUser } = useAuth();
  const { isSuperAdmin } = useAbility();

  const [tenants, setTenants] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(isSuperAdmin ? "" : authUser?.tenantId || "");
  const [selectedModule, setSelectedModule] = useState("");

  // Update selectedTenant when authUser changes (for ADMIN/RECEPTION)
  useEffect(() => {
    if (!isSuperAdmin && authUser?.tenantId) {
      setSelectedTenant(authUser.tenantId);
    }
  }, [isSuperAdmin, authUser?.tenantId]);

  // Load tenants (only for SUPERADMIN)
  const loadTenants = useCallback(async () => {
    if (!isSuperAdmin) return;

    try {
      const response = await TenantsApi.listTenants();
      setTenants(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      toast.error(err?.message || "Error loading tenants");
    }
  }, [isSuperAdmin]);

  // Load modules for selected tenant
  const loadModules = useCallback(async () => {
    if (!selectedTenant) {
      setModules([]);
      return;
    }

    try {
      const response = await ModulesApi.listModules({ tenantId: selectedTenant, active: true });
      setModules(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      toast.error(err?.message || "Error loading modules");
    }
  }, [selectedTenant]);

  // Options for selects
  const tenantOptions = useMemo(
    () => [
      { value: "", label: "Seleccione una notaría" },
      ...tenants.map((tenant) => ({
        value: tenant._id,
        label: tenant.name,
      })),
    ],
    [tenants]
  );

  const moduleOptions = useMemo(
    () => [
      { value: "", label: "Sin asignar" },
      ...modules.map((module) => ({
        value: module._id,
        label: module.name,
      })),
    ],
    [modules]
  );

  const moduleFilterOptions = useMemo(
    () => [
      { value: "", label: "Todos los módulos" },
      ...modules.map((module) => ({
        value: module._id,
        label: module.name,
      })),
    ],
    [modules]
  );

  // Load data on mount
  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  return {
    tenants,
    modules,
    selectedTenant,
    setSelectedTenant,
    selectedModule,
    setSelectedModule,
    tenantOptions,
    moduleOptions,
    moduleFilterOptions,
    isSuperAdmin,
  };
};
