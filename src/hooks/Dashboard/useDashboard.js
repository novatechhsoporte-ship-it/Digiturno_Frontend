import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useQueryAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { DashboardApi } from "@core/api/dashboard";
import { getSocket } from "@config/socket/socket";
import { useAuth } from "@/store/authStore";

/**
 * useDashboard
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates all data needed by the Dashboard.
 *
 * Includes real-time synchronization via Socket.io by listening to specific
 * ticket events (created, called, completed, abandoned, recalled) and
 * invalidating the relevant queries.
 */
export const useDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Include tenantId in the query key to ensure cache isolation per tenant
  const tenantId = user?.tenantId;
  const dashboardKeys = createQueryKeyFactory(`dashboard:${tenantId || "global"}`);

  // ─── 1. Stats query (summary cards) ─────────────────────────────────────
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorObj,
    refetch: refetchStats,
  } = useQueryAdapter(dashboardKeys.all, () => DashboardApi.getStats(), {
    enabled: !!tenantId,
    refetchInterval: 60000, // Background sync every minute
    showErrorToast: true,
  });

  // ─── 2. Modules Andon status query (table) ───────────────────────────────
  const modulesKey = [...dashboardKeys.all, "modules-status"];

  const {
    data: modules = [],
    isLoading: modulesLoading,
    isError: modulesError,
    refetch: refetchModules,
  } = useQueryAdapter(modulesKey, () => DashboardApi.getModulesStatus(), {
    enabled: !!tenantId,
    refetchInterval: 60000,
    showErrorToast: false,
  });

  // ─── 3. Real-time updates via Socket.io ──────────────────────────────────
  useEffect(() => {
    if (!tenantId) return;

    const socket = getSocket();
    if (!socket) return;

    // Unified invalidation handler
    // Invalidating the base dashboardKey will trigger refetch for both Stats and Modules Status
    const refreshDashboardData = () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    };

    // Listen to all events that affect ticket counts or module statuses
    // Based on backend ticketService.js emissions
    socket.on("ticket:created", refreshDashboardData);
    socket.on("ticket:called", refreshDashboardData);
    socket.on("ticket:completed", refreshDashboardData);
    socket.on("ticket:abandoned", refreshDashboardData);
    socket.on("ticket:recalled", refreshDashboardData);

    return () => {
      socket.off("ticket:created", refreshDashboardData);
      socket.off("ticket:called", refreshDashboardData);
      socket.off("ticket:completed", refreshDashboardData);
      socket.off("ticket:abandoned", refreshDashboardData);
      socket.off("ticket:recalled", refreshDashboardData);
    };
  }, [queryClient, tenantId, dashboardKeys.all]);

  return {
    stats,
    isLoading: statsLoading || modulesLoading,
    isError: statsError || modulesError,
    error: statsErrorObj,
    refetch: () => {
      refetchStats();
      refetchModules();
    },
    modules,
    refetchModules,
  };
};
