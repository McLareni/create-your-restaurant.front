import { apiClient } from '@/shared/api/client';
import { Dish, CreateDishDTO } from '../types/dishes.types';

export const dishesApi = {
  getAll: async (restaurantId: number): Promise<Dish[]> => {
    const response = await apiClient.get<{ categories: { dishes: Dish[] }[] }>(`/menu/owner/${restaurantId}`);
    return response.categories.flatMap(cat => cat.dishes);
  },

  getTagsLookup: async (restaurantId: number): Promise<string[]> => {
    return apiClient.get<string[]>(`/menu/owner/${restaurantId}/dishes/lookups/tags`);
  },

  getAllergensLookup: async (restaurantId: number): Promise<string[]> => {
    return apiClient.get<string[]>(`/menu/owner/${restaurantId}/dishes/lookups/allergens`);
  },

  createTagLookup: async (restaurantId: number, tagName: string): Promise<string> => {
    const response = await apiClient.post<{ name: string }>(`/menu/owner/${restaurantId}/dishes/lookups/tags`, { name: tagName });
    return response.name || tagName;
  },

  createAllergenLookup: async (restaurantId: number, allergenName: string): Promise<string> => {
    const response = await apiClient.post<{ name: string }>(`/menu/owner/${restaurantId}/dishes/lookups/allergens`, { name: allergenName });
    return response.name || allergenName;
  },

  deleteTagLookup: async (restaurantId: number, tagName: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/${restaurantId}/dishes/lookups/tags/${encodeURIComponent(tagName)}`);
  },

  deleteAllergenLookup: async (restaurantId: number, allergenName: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/${restaurantId}/dishes/lookups/allergens/${encodeURIComponent(allergenName)}`);
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