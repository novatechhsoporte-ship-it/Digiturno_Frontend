import { axiosClient } from "@config/adapters/axiosClient";

export const DashboardApi = {
  /**
   * Get dashboard statistics (today summary + by module/service/origin)
   */
  getStats: () => axiosClient.get("/dashboard/stats"),

  /**
   * Get real-time Andon module status (currentTicket, pendingQuantity, attendant, serviceType)
   */
  getModulesStatus: () => axiosClient.get("/dashboard/modules-status"),
};
