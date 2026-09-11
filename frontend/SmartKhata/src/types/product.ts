export interface ProductRequest {
  name: string;
  price: number;
  stock: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  stock: number;
  minimumStock?: number;
}
