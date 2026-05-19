import { apiClient } from '@/shared/api/client';
import { Dish, CreateDishDTO } from '../types/dishes.types';

export const dishesApi = {
  // Примітка: метод getAll може потребувати оновлення, залежно від того,
  // чи є окремий GET ендпоінт для всіх страв, чи вони приходять вкладеними в категорії
  getAll: async (): Promise<Dish[]> => {
    try {
      const response = await apiClient.get<any>('/menu/owner/dishes');
      return Array.isArray(response) ? response : response.dishes || [];
    } catch (error) {
      console.warn("GET /dishes не знайдено, повертаємо порожній масив");
      return [];
    }
  },

  create: async (categoryId: string, data: CreateDishDTO): Promise<Dish> => {
    const response = await apiClient.post<any>(`/menu/owner/categories/${categoryId}/dishes`, data);
    return response.dish || response;
  },

  update: async (id: string, data: Partial<Dish>): Promise<Dish> => {
    const response = await apiClient.patch<any>(`/menu/owner/dishes/${id}`, data);
    return response.dish || response;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/dishes/${id}`);
  },

  bulkUpdatePrices: async (updates: { id: string; price: number }[]): Promise<void> => {
    await Promise.all(
      updates.map((update) => 
        apiClient.patch(`/menu/owner/dishes/${update.id}`, { price: update.price })
      )
    );
  }
};