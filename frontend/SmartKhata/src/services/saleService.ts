import { axiosInstance } from '../api/axiosInstance';
import { SaleRequest, SaleResponse } from '../types/sale';

export const saleService = {
  createSale: async (data: SaleRequest): Promise<SaleResponse> => {
    const response = await axiosInstance.post<SaleResponse>('/sales', data);
    return response.data;
  },

  getSales: async (): Promise<SaleResponse[]> => {
    const response = await axiosInstance.get<SaleResponse[]>('/sales');
    return response.data;
  },

  getSaleById: async (saleId: number): Promise<SaleResponse> => {
    const response = await axiosInstance.get<SaleResponse>(`/sales/${saleId}`);
    return response.data;
  },

  cancelSale: async (saleId: number, reason: string): Promise<SaleResponse> => {
    const response = await axiosInstance.patch<SaleResponse>(
      `/sales/${saleId}/cancel?reason=${encodeURIComponent(reason)}`
    );
    return response.data;
  },
};
