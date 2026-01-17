import { axiosClient } from "@config/adapters/axiosClient";

export const UsersApi = {
  listUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.tenantId) queryParams.append("tenantId", params.tenantId);
    if (params.roleName) queryParams.append("roleName", params.roleName);
    if (params.status !== undefined) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return axiosClient.get(`/admin/users${queryString ? `?${queryString}` : ""}`);
  },
  createUser: (payload) => axiosClient.post(`/admin/users`, payload),
  updateUser: (userId, payload) => axiosClient.put(`/admin/users/${userId}`, payload),
  deleteUser: (userId) => axiosClient.delete(`/admin/users/${userId}`),
  getUserById: (userId) => axiosClient.get(`/admin/users/${userId}`),
};
