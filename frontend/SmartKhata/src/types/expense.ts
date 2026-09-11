export type ExpenseCategory =
  | 'RENT'
  | 'ELECTRICITY'
  | 'WATER'
  | 'INTERNET'
  | 'SALARY'
  | 'PURCHASE'
  | 'TRANSPORT'
  | 'MAINTENANCE'
  | 'MARKETING'
  | 'TAX'
  | 'STATIONERY'
  | 'OTHER';

export interface ExpenseRequest {
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  description?: string;
}

export interface ExpenseResponse {
  id: number;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  description?: string;
}
