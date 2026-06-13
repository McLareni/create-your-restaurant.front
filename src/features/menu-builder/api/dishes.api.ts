import { apiClient } from '@/shared/api/client';
import { Dish } from '../types/dishes.types';
import { DishFormValues } from '../schemas/dishes.schema';
import { menuApi } from './menu.api';

export const dishesApi = {
  getAll: async (restaurantId: number): Promise<Dish[]> => {
    const response = await menuApi.getFullMenu(restaurantId);
    return response.categories.flatMap(cat => cat.dishes);
  },

  getTagsLookup: async (restaurantId: number): Promise<string[]> => {
    return await apiClient.get<string[]>(`/menu/owner/${restaurantId}/dishes/lookups/tags`);
  },

  getAllergensLookup: async (restaurantId: number): Promise<string[]> => {
    return await apiClient.get<string[]>(`/menu/owner/${restaurantId}/dishes/lookups/allergens`);
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

  create: async (categoryId: string, data: DishFormValues): Promise<Dish> => {
    return await menuApi.createDish(categoryId, data);
  },

  update: async (id: string, data: Partial<DishFormValues>): Promise<Dish> => {
    return await menuApi.updateDish(id, data);
  }
};