import { axiosClient } from "@config/adapters/axiosClient";

export const TenantsApi = {
  listTenants: () => axiosClient.get(`/tenants`),
  createTenant: (payload) => axiosClient.post(`/tenants`, payload),
  updateTenant: (idTenant, payload) => axiosClient.put(`/tenants/${idTenant}`, payload),

  // getTenant: (token, id) => apiFetch(`/superadmin/tenants/${id}`, { token }),
  // deleteAdmin: (token, tenantId, id) => apiFetch(`/superadmin/tenants/${tenantId}/admins/${id}`, { method: 'DELETE', token }),
};
