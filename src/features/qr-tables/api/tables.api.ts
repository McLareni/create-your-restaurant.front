import { apiClient } from '@/shared/api/client';
import { Table, CreateTableDTO, UpdateTableDTO } from '../types/tables.types';

export const tablesApi = {
  getAll: async (restaurantId: number): Promise<Table[]> => {
    return await apiClient.get<Table[]>(`/restaurants/${restaurantId}/tables`);
  },

  create: async (restaurantId: number, data: CreateTableDTO, restaurantSlug: string): Promise<Table> => {
    return await apiClient.post<Table>(`/restaurants/${restaurantId}/tables`, {
      ...data,
      slug: restaurantSlug // Передаємо slug на бекенд для формування QR
    });
  },

  update: async (restaurantId: number, id: string, data: UpdateTableDTO): Promise<Table> => {
    return await apiClient.patch<Table>(`/restaurants/${restaurantId}/tables/${id}`, data);
  },

  delete: async (restaurantId: number, id: string): Promise<void> => {
    await apiClient.delete(`/restaurants/${restaurantId}/tables/${id}`);
  }
};