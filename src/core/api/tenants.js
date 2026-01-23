import { axiosClient } from "@config/adapters/axiosClient";

export const TenantsApi = {
  listTenants: () => axiosClient.get(`/tenants`),
  createTenant: (payload) => axiosClient.post(`/tenants`, payload),
  updateTenant: (idTenant, payload) => axiosClient.put(`/tenants/${idTenant}`, payload),
  deleteTenant: (idTenant) => axiosClient.delete(`/tenants/${idTenant}`),
};
