export interface Expense {
  id: string;
  category: 'lahan' | 'transportasi' | 'lainnya';
  description: string;
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseCreateDto {
  category: 'lahan' | 'transportasi' | 'lainnya';
  description: string;
  amount: number;
  date: string;
}

export interface ExpenseUpdateDto {
  category?: 'lahan' | 'transportasi' | 'lainnya';
  description?: string;
  amount?: number;
  date?: string;
}

export interface ExpenseListResponse {
  message: string;
  data: {
    expenses: Expense[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  lahan: 'Kebutuhan Lahan',
  transportasi: 'Transportasi',
  lainnya: 'Lainnya',
};
