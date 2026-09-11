import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services/expenseService';
import { ExpenseRequest } from '../types/expense';
import { DASHBOARD_QUERY_KEY } from './useDashboard';

export const EXPENSES_QUERY_KEY = ['expenses'];
export const EXPENSE_DETAIL_KEY = (id: number) => ['expenses', id];

export const useExpenses = () => {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: EXPENSES_QUERY_KEY,
    queryFn: expenseService.getExpenses,
  });

  const createExpenseMutation = useMutation({
    mutationFn: (data: ExpenseRequest) => expenseService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExpenseRequest> }) =>
      expenseService.updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: EXPENSE_DETAIL_KEY(variables.id) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: number) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  return {
    ...expensesQuery,
    createExpense: createExpenseMutation.mutateAsync,
    isCreating: createExpenseMutation.isPending,
    updateExpense: updateExpenseMutation.mutateAsync,
    isUpdating: updateExpenseMutation.isPending,
    deleteExpense: deleteExpenseMutation.mutateAsync,
    isDeleting: deleteExpenseMutation.isPending,
  };
};

export const useExpenseDetail = (id: number) => {
  return useQuery({
    queryKey: EXPENSE_DETAIL_KEY(id),
    queryFn: () => expenseService.getExpenseById(id),
    enabled: !!id && !isNaN(id),
  });
};
