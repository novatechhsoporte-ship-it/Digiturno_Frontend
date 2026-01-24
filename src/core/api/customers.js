import { axiosClient } from "@config/adapters/axiosClient";

export const CustomersApi = {
  updateCustomer: (customerId, payload) => axiosClient.put(`/customers/${customerId}`, payload),
};
