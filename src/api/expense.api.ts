import apiClient from './client';
import type {
  Expense,
  ExpenseCreateDto,
  ExpenseUpdateDto,
  ExpenseListResponse,
} from '../types/expense.types';

export const expenseApi = {
  getAll: async (page = 1, limit = 10, category?: string): Promise<ExpenseListResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) params.append('category', category);
    const response = await apiClient.get(`/expenses?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ message: string; data: Expense }> => {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (data: ExpenseCreateDto): Promise<{ message: string; data: Expense }> => {
    const response = await apiClient.post('/expenses', data);
    return response.data;
  },

  update: async (id: string, data: ExpenseUpdateDto): Promise<{ message: string; data: Expense }> => {
    const response = await apiClient.put(`/expenses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },
};
