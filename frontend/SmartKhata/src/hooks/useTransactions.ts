import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import { PaymentRequest, TransactionRequest } from '../types/transaction';
import { CUSTOMER_LEDGER_KEY, CUSTOMERS_QUERY_KEY } from './useCustomers';
import { DASHBOARD_QUERY_KEY } from './useDashboard';

export const TRANSACTIONS_KEY = (customerId: number) => ['transactions', customerId];
export const STATEMENT_KEY = (customerId: number) => ['statement', customerId];

export const useCustomerTransactions = (customerId: number) => {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: TRANSACTIONS_KEY(customerId),
    queryFn: () => transactionService.getCustomerTransactions(customerId),
    enabled: !!customerId && !isNaN(customerId),
  });

  const addTransactionMutation = useMutation({
    mutationFn: (data: TransactionRequest) =>
      transactionService.addTransaction(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY(customerId) });
      queryClient.invalidateQueries({ queryKey: CUSTOMER_LEDGER_KEY(customerId) });
      queryClient.invalidateQueries({ queryKey: STATEMENT_KEY(customerId) });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  return {
    ...transactionsQuery,
    addTransaction: addTransactionMutation.mutateAsync,
    isAddingTransaction: addTransactionMutation.isPending,
  };
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentRequest) => transactionService.recordPayment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_KEY(variables.customerId),
      });
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_LEDGER_KEY(variables.customerId),
      });
      queryClient.invalidateQueries({
        queryKey: STATEMENT_KEY(variables.customerId),
      });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};

export const useCustomerStatement = (customerId: number) => {
  return useQuery({
    queryKey: STATEMENT_KEY(customerId),
    queryFn: () => transactionService.getCustomerStatement(customerId),
    enabled: !!customerId && !isNaN(customerId),
  });
};
