import { axiosClient } from "@config/adapters/axiosClient";

export const ServicesApi = {
  listServices: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.tenantId) queryParams.append("tenantId", params.tenantId);
    if (params.active !== undefined) queryParams.append("active", params.active);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return axiosClient.get(`/services${queryString ? `?${queryString}` : ""}`);
  },
  createService: (tenantId, payload) => axiosClient.post(`/services/${tenantId}`, payload),
  updateService: (serviceId, payload) => axiosClient.put(`/services/${serviceId}`, payload),
  deleteService: (serviceId) => axiosClient.delete(`/services/${serviceId}`),
  getServiceById: (serviceId) => axiosClient.get(`/services/${serviceId}`),
};
