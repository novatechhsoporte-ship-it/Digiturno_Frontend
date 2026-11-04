import { useState, useMemo } from "react";
import { useQueryAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { DashboardApi } from "@core/api/dashboard";
import { ModulesApi } from "@core/api/modules";
import { ServicesApi } from "@core/api/services";
import { UsersApi } from "@core/api/users";
import { TenantsApi } from "@core/api/tenants";
import { useAuth } from "@/store/authStore";

export const useDashboardReports = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId;
  const isSuperAdmin = user?.roles?.includes("SUPERADMIN") || false;
  const currentTenantName = user?.tenantName || user?.tenant?.name || "";

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Filter States
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [attendantId, setAttendantId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");

  // For SuperAdmin, effective tenant is whatever was selected (or undefined for consolidated).
  // For normal Admin, effective tenant is strictly locked to their own tenantId.
  const effectiveTenantId = isSuperAdmin ? selectedTenantId || undefined : tenantId;

  const filters = useMemo(
    () => ({
      startDate,
      endDate,
      attendantId: attendantId || undefined,
      moduleId: moduleId || undefined,
      serviceTypeId: serviceTypeId || undefined,
      ...(isSuperAdmin && selectedTenantId ? { tenantId: selectedTenantId } : {}),
    }),
    [startDate, endDate, attendantId, moduleId, serviceTypeId, isSuperAdmin, selectedTenantId]
  );

  const reportsKeys = createQueryKeyFactory(`dashboard-reports:${effectiveTenantId || "global"}`);

  // Fetch Reports Data
  const {
    data: reportData,
    isLoading: loadingReports,
    isError: errorReports,
    refetch: refetchReports,
  } = useQueryAdapter([...reportsKeys.all, filters], () => DashboardApi.getReports(filters), {
    enabled: !!tenantId || isSuperAdmin,
    refetchInterval: 30000,
    showErrorToast: true,
  });

  // Fetch Tenants for Dropdown ONLY if SuperAdmin
  const { data: tenantsData = [] } = useQueryAdapter(
    ["dropdown-tenants"],
    () => TenantsApi.listTenants(),
    {
      enabled: isSuperAdmin,
      staleTime: 300000,
    }
  );

  // Non-superadmins MUST NOT receive other tenants
  const tenants = isSuperAdmin
    ? Array.isArray(tenantsData)
      ? tenantsData
      : tenantsData?.data || []
    : [];

  // Fetch Modules for Dropdown
  const { data: modulesData = [] } = useQueryAdapter(
    ["dropdown-modules", effectiveTenantId],
    () => ModulesApi.listModules({ tenantId: effectiveTenantId, active: true }),
    {
      enabled: !!effectiveTenantId,
      staleTime: 300000, // 5 minutes cache
    }
  );

  const modules = modulesData?.data || modulesData || [];

  // Fetch Services for Dropdown
  const { data: servicesData = [] } = useQueryAdapter(
    ["dropdown-services", effectiveTenantId],
    () => ServicesApi.listServices({ tenantId: effectiveTenantId, active: true }),
    {
      enabled: !!effectiveTenantId,
      staleTime: 300000,
    }
  );

  const services = servicesData?.data || servicesData || [];

  // Fetch Users (Attendants) for Dropdown
  const { data: usersData = [] } = useQueryAdapter(
    ["dropdown-attendants", effectiveTenantId],
    () => UsersApi.listUsers({ tenantId: effectiveTenantId, status: true }),
    {
      enabled: !!effectiveTenantId,
      staleTime: 300000,
    }
  );

  const users = usersData?.data || usersData || [];

  // Format options for select inputs
  const moduleOptions = useMemo(
    () => [{ value: "", label: "Todos los Módulos" }, ...modules.map((m) => ({ value: m._id, label: m.name }))],
    [modules]
  );

  const serviceOptions = useMemo(
    () => [{ value: "", label: "Todos los Servicios" }, ...services.map((s) => ({ value: s._id, label: s.name }))],
    [services]
  );

  const attendantOptions = useMemo(
    () => [
      { value: "", label: "Todos los Funcionarios" },
      ...users
        .filter((u) => u.roles?.some((r) => r.name !== "SUPERADMIN"))
        .map((u) => ({ value: u._id || u.id, label: u.fullName })),
    ],
    [users]
  );

  const reports = reportData?.data || reportData || { summary: {}, tickets: [] };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    attendantId,
    setAttendantId,
    moduleId,
    setModuleId,
    serviceTypeId,
    setServiceTypeId,
    selectedTenantId,
    setSelectedTenantId,
    isSuperAdmin,
    currentTenantName,
    moduleOptions,
    serviceOptions,
    attendantOptions,
    summary: reports.summary || {},
    hourlyDistribution: reports.hourlyDistribution || [],
    byService: reports.byService || [],
    byAttendant: reports.byAttendant || [],
    tenants,
    services,
    tickets: reports.tickets || [],
    isLoading: loadingReports,
    isError: errorReports,
    refetch: refetchReports,
  };
};
