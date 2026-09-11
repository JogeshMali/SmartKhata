export type TransactionType = 'CREDIT' | 'PAYMENT';

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  note?: string;
}

export interface TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  note?: string;
  transactionDate: string;
}

export interface PaymentRequest {
  customerId: number;
  amount: number;
  note?: string;
}

export interface PaymentResponse {
  id: number;
  customerId: number;
  customerName: string;
  amount: number;
  type: 'PAYMENT';
  transactionDate: string;
  note?: string;
}

export interface StatementTransactionItem {
  id: number;
  transactionDate: string;
  type: TransactionType;
  amount: number;
  note?: string;
  runningBalance: number;
}

export interface CustomerStatementResponse {
  customerId: number;
  customerName: string;
  phone: string;
  outstandingBalance: number;
  transactions: StatementTransactionItem[];
}
