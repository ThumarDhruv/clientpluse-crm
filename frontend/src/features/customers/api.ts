import { apiClient } from "@/lib/api-client";
import {
  Customer,
  CustomerFormData,
  CustomerQueryParams,
  PaginatedCustomersResponse,
} from "./types";

export const customerApi = {
  getCustomers: async (
    params: CustomerQueryParams = {}
  ): Promise<PaginatedCustomersResponse> => {
    const { data } = await apiClient.get<PaginatedCustomersResponse>(
      "/customers",
      {
        params: {
          page: params.page || 1,
          page_size: params.page_size || 10,
          search: params.search || undefined,
          status: params.status === "all" ? undefined : params.status,
          sort_by: params.sort_by || "created_at",
          sort_order: params.sort_order || "desc",
        },
      }
    );
    return data;
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const { data } = await apiClient.get<Customer>(`/customers/${id}`);
    return data;
  },

  createCustomer: async (payload: CustomerFormData): Promise<Customer> => {
    const { data } = await apiClient.post<Customer>("/customers", payload);
    return data;
  },

  updateCustomer: async (
    id: string,
    payload: Partial<CustomerFormData>
  ): Promise<Customer> => {
    const { data } = await apiClient.patch<Customer>(`/customers/${id}`, payload);
    return data;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};
