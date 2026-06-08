import { useState, useMemo } from "react";
import { useQueryAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { DashboardApi } from "@core/api/dashboard";
import { ModulesApi } from "@core/api/modules";
import { ServicesApi } from "@core/api/services";
import { UsersApi } from "@core/api/users";
import { useAuth } from "@/store/authStore";

export const useDashboardReports = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Filter States
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [attendantId, setAttendantId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");

  const filters = useMemo(
    () => ({
      startDate,
      endDate,
      attendantId: attendantId || undefined,
      moduleId: moduleId || undefined,
      serviceTypeId: serviceTypeId || undefined,
    }),
    [startDate, endDate, attendantId, moduleId, serviceTypeId]
  );

  const reportsKeys = createQueryKeyFactory(`dashboard-reports:${tenantId || "global"}`);

  // Fetch Reports Data
  const {
    data: reportData,
    isLoading: loadingReports,
    isError: errorReports,
    refetch: refetchReports,
  } = useQueryAdapter([...reportsKeys.all, filters], () => DashboardApi.getReports(filters), {
    enabled: !!tenantId,
    showErrorToast: true,
  });

  // Fetch Modules for Dropdown
  const { data: modulesData = [] } = useQueryAdapter(
    ["dropdown-modules", tenantId],
    () => ModulesApi.listModules({ tenantId, active: true }),
    {
      enabled: !!tenantId,
      staleTime: 300000, // 5 minutes cache
    }
  );

  const modules = modulesData?.data || modulesData || [];

  // Fetch Services for Dropdown
  const { data: servicesData = [] } = useQueryAdapter(
    ["dropdown-services", tenantId],
    () => ServicesApi.listServices({ tenantId, active: true }),
    {
      enabled: !!tenantId,
      staleTime: 300000,
    }
  );

  const services = servicesData?.data || servicesData || [];

  // Fetch Users (Attendants) for Dropdown
  const { data: usersData = [] } = useQueryAdapter(
    ["dropdown-attendants", tenantId],
    () => UsersApi.listUsers({ tenantId, status: true }),
    {
      enabled: !!tenantId,
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
    moduleOptions,
    serviceOptions,
    attendantOptions,
    summary: reports.summary || {},
    tickets: reports.tickets || [],
    isLoading: loadingReports,
    isError: errorReports,
    refetch: refetchReports,
  };
};
