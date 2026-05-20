import { apiClient } from '@/shared/api/client';
import { Dish, CreateDishDTO } from '../types/dishes.types';

export const dishesApi = {
  getAll: async (restaurantId: number): Promise<Dish[]> => {
    const response = await apiClient.get<{ categories: { dishes: Dish[] }[] }>(`/menu/owner/${restaurantId}`);
    return response.categories.flatMap(cat => cat.dishes);
  },

  getTagsLookup: async (): Promise<string[]> => {
    return apiClient.get<string[]>('/menu/owner/dishes/lookups/tags');
  },

  getAllergensLookup: async (): Promise<string[]> => {
    return apiClient.get<string[]>('/menu/owner/dishes/lookups/allergens');
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
  }
};