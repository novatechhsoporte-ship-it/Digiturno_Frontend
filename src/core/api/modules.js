import { axiosClient } from "@config/adapters/axiosClient";

export const ModulesApi = {
  listModules: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.tenantId) queryParams.append("tenantId", params.tenantId);
    if (params.active !== undefined) queryParams.append("active", params.active);
    if (params.search) queryParams.append("search", params.search);
    
    const queryString = queryParams.toString();
    return axiosClient.get(`/modules${queryString ? `?${queryString}` : ""}`);
  },
  createModule: (tenantId, payload) => axiosClient.post(`/modules/${tenantId}`, payload),
  updateModule: (moduleId, payload) => axiosClient.put(`/modules/${moduleId}`, payload),
  deleteModule: (moduleId) => axiosClient.delete(`/modules/${moduleId}`),
  getModuleById: (moduleId) => axiosClient.get(`/modules/${moduleId}`),
};