import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { CustomerRequest } from '../types/customer';
import { DASHBOARD_QUERY_KEY } from './useDashboard';

export const CUSTOMERS_QUERY_KEY = ['customers'];
export const CUSTOMER_DETAIL_KEY = (id: number) => ['customers', id];
export const CUSTOMER_LEDGER_KEY = (id: number) => ['customerLedger', id];

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: customerService.getCustomers,
  });

  const createCustomerMutation = useMutation({
    mutationFn: (data: CustomerRequest) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CustomerRequest> }) =>
      customerService.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CUSTOMER_DETAIL_KEY(variables.id) });
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: number) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  return {
    ...customersQuery,
    createCustomer: createCustomerMutation.mutateAsync,
    isCreating: createCustomerMutation.isPending,
    updateCustomer: updateCustomerMutation.mutateAsync,
    isUpdating: updateCustomerMutation.isPending,
    deleteCustomer: deleteCustomerMutation.mutateAsync,
    isDeleting: deleteCustomerMutation.isPending,
  };
};

export const useCustomerDetail = (id: number) => {
  return useQuery({
    queryKey: CUSTOMER_DETAIL_KEY(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id && !isNaN(id),
  });
};

export const useCustomerLedger = (customerId: number) => {
  return useQuery({
    queryKey: CUSTOMER_LEDGER_KEY(customerId),
    queryFn: () => customerService.getCustomerLedger(customerId),
    enabled: !!customerId && !isNaN(customerId),
  });
};
