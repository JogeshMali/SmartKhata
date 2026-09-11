import { axiosInstance } from '../api/axiosInstance';
import {
  CustomerStatementResponse,
  PaymentRequest,
  PaymentResponse,
  TransactionRequest,
  TransactionResponse,
} from '../types/transaction';

export const transactionService = {
  addTransaction: async (
    customerId: number,
    data: TransactionRequest
  ): Promise<TransactionResponse> => {
    const response = await axiosInstance.post<TransactionResponse>(
      `/customers/${customerId}/transactions`,
      data
    );
    return response.data;
  },

  getCustomerTransactions: async (
    customerId: number
  ): Promise<TransactionResponse[]> => {
    const response = await axiosInstance.get<TransactionResponse[]>(
      `/customers/${customerId}/transactions`
    );
    return response.data;
  },

  recordPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
    const response = await axiosInstance.post<PaymentResponse>('/payment', data);
    return response.data;
  },

  getCustomerStatement: async (
    customerId: number
  ): Promise<CustomerStatementResponse> => {
    const response = await axiosInstance.get<CustomerStatementResponse>(
      `/statement/${customerId}`
    );
    return response.data;
  },
};
