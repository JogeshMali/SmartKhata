export type PaymentType = 'CASH' | 'CREDIT' | 'UPI' | 'CARD';
export type SaleStatus = 'COMPLETED' | 'CANCELLED';

export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

export interface SaleRequest {
  customerId?: number | null;
  paymentType: PaymentType;
  items: SaleItemRequest[];
}

export interface SaleItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface SaleResponse {
  id: number;
  saleDate: string;
  customerId?: number | null;
  customerName?: string | null;
  paymentType: PaymentType;
  totalAmount: number;
  status?: SaleStatus;
  items: SaleItemResponse[];
}
