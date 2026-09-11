import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ProductRequest } from '../types/product';
import { DASHBOARD_QUERY_KEY } from './useDashboard';

export const PRODUCTS_QUERY_KEY = ['products'];
export const PRODUCT_DETAIL_KEY = (id: number) => ['products', id];

export const useProducts = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productService.getProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: (data: ProductRequest) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductRequest> }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_DETAIL_KEY(variables.id) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  return {
    ...productsQuery,
    createProduct: createProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    updateProduct: updateProductMutation.mutateAsync,
    isUpdating: updateProductMutation.isPending,
    deleteProduct: deleteProductMutation.mutateAsync,
    isDeleting: deleteProductMutation.isPending,
  };
};

export const useProductDetail = (id: number) => {
  return useQuery({
    queryKey: PRODUCT_DETAIL_KEY(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id && !isNaN(id),
  });
};
