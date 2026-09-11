export interface CustomerRequest {
  name: string;
  phone: string;
  address: string;
  creditLimit: number;
}

export interface CustomerResponse {
  id: number;
  name: string;
  phone: string;
  address: string;
  creditLimit: number;
  outstandingAmount?: number;
}

export interface CustomerLedgerResponse {
  customerId: number;
  customerName: string;
  totalCredit: number;
  totalPayment: number;
  outstandingAmount: number;
}
