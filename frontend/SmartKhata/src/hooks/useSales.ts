import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saleService } from '../services/saleService';
import { SaleRequest } from '../types/sale';
import { DASHBOARD_QUERY_KEY } from './useDashboard';
import { PRODUCTS_QUERY_KEY } from './useProducts';

export const SALES_QUERY_KEY = ['sales'];
export const SALE_DETAIL_KEY = (id: number) => ['sales', id];

export const useSales = () => {
  const queryClient = useQueryClient();

  const salesQuery = useQuery({
    queryKey: SALES_QUERY_KEY,
    queryFn: saleService.getSales,
  });

  const createSaleMutation = useMutation({
    mutationFn: (data: SaleRequest) => saleService.createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  const cancelSaleMutation = useMutation({
    mutationFn: ({ saleId, reason }: { saleId: number; reason: string }) =>
      saleService.cancelSale(saleId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SALE_DETAIL_KEY(variables.saleId) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  return {
    ...salesQuery,
    createSale: createSaleMutation.mutateAsync,
    isCreating: createSaleMutation.isPending,
    cancelSale: cancelSaleMutation.mutateAsync,
    isCancelling: cancelSaleMutation.isPending,
  };
};

export const useSaleDetail = (id: number) => {
  return useQuery({
    queryKey: SALE_DETAIL_KEY(id),
    queryFn: () => saleService.getSaleById(id),
    enabled: !!id && !isNaN(id),
  });
};
