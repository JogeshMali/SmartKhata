import { axiosInstance } from '../api/axiosInstance';
import { ExpenseRequest, ExpenseResponse } from '../types/expense';

export const expenseService = {
  getExpenses: async (): Promise<ExpenseResponse[]> => {
    const response = await axiosInstance.get<ExpenseResponse[]>('/expenses');
    return response.data;
  },

  getExpenseById: async (expenseId: number): Promise<ExpenseResponse> => {
    const response = await axiosInstance.get<ExpenseResponse>(
      `/expenses/${expenseId}`
    );
    return response.data;
  },

  createExpense: async (data: ExpenseRequest): Promise<ExpenseResponse> => {
    const response = await axiosInstance.post<ExpenseResponse>('/expenses', data);
    return response.data;
  },

  updateExpense: async (
    expenseId: number,
    data: Partial<ExpenseRequest>
  ): Promise<ExpenseResponse> => {
    const response = await axiosInstance.patch<ExpenseResponse>(
      `/expenses/${expenseId}`,
      data
    );
    return response.data;
  },

  deleteExpense: async (expenseId: number): Promise<void> => {
    await axiosInstance.delete(`/expenses/${expenseId}`);
  },
};
