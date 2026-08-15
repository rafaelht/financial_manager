export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}

export interface CreateTransactionDto {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: number;
}

export interface UpdateTransactionDto {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: number;
}
