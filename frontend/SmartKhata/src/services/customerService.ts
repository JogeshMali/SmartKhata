import { axiosInstance } from '../api/axiosInstance';
import {
  CustomerLedgerResponse,
  CustomerRequest,
  CustomerResponse,
} from '../types/customer';

export const customerService = {
  getCustomers: async (): Promise<CustomerResponse[]> => {
    const response = await axiosInstance.get<CustomerResponse[]>('/customers');
    return response.data;
  },

  getCustomerById: async (id: number): Promise<CustomerResponse> => {
    const response = await axiosInstance.get<CustomerResponse>(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (data: CustomerRequest): Promise<CustomerResponse> => {
    const response = await axiosInstance.post<CustomerResponse>('/customers', data);
    return response.data;
  },

  updateCustomer: async (
    id: number,
    data: Partial<CustomerRequest>
  ): Promise<CustomerResponse> => {
    const response = await axiosInstance.patch<CustomerResponse>(
      `/customers/${id}`,
      data
    );
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/customers/${id}`);
  },

  getCustomerLedger: async (customerId: number): Promise<CustomerLedgerResponse> => {
    const response = await axiosInstance.get<CustomerLedgerResponse>(
      `/customers/${customerId}/ledger`
    );
    return response.data;
  },
};
