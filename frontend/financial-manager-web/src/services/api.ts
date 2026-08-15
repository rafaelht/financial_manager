import axios, { type AxiosInstance } from 'axios';
import type { Transaction, CreateTransactionDto, UpdateTransactionDto } from '../types/transaction';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category';
import type { DashboardData } from '../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transactions
export const transactionAPI = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>('/transactions');
    return response.data;
  },

  getById: async (id: number): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTransactionDto): Promise<void> => {
    await apiClient.put(`/transactions/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};

// Categories
export const categoryAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCategoryDto): Promise<void> => {
    await apiClient.put(`/categories/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

// Dashboard
export const dashboardAPI = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/dashboard');
    return response.data;
  },
};

export default apiClient;
