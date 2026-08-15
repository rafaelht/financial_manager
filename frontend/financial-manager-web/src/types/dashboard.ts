import type { Transaction } from './transaction';

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  recentTransactions: Transaction[];
  expensesByCategory: Record<string, number>;
}
