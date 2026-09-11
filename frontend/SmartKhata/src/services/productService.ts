import { axiosInstance } from '../api/axiosInstance';
import { ProductRequest, ProductResponse } from '../types/product';

export const productService = {
  getProducts: async (): Promise<ProductResponse[]> => {
    const response = await axiosInstance.get<ProductResponse[]>('/products');
    return response.data;
  },

  getProductById: async (productId: number): Promise<ProductResponse> => {
    const response = await axiosInstance.get<ProductResponse>(`/products/${productId}`);
    return response.data;
  },

  createProduct: async (data: ProductRequest): Promise<ProductResponse> => {
    const response = await axiosInstance.post<ProductResponse>('/products', data);
    return response.data;
  },

  updateProduct: async (
    productId: number,
    data: Partial<ProductRequest>
  ): Promise<ProductResponse> => {
    const response = await axiosInstance.patch<ProductResponse>(
      `/products/${productId}`,
      data
    );
    return response.data;
  },

  deleteProduct: async (productId: number): Promise<void> => {
    await axiosInstance.delete(`/products/${productId}`);
  },
};
