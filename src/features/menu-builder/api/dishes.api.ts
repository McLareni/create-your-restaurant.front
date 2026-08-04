import { apiClient } from '@/shared/api/client';
import type { Dish } from '../types/dishes.types';
import type { DishFormValues } from '../schemas/dishes.schema';
import { menuApi } from './menu.api';

export const dishesApi = {
  getTagsLookup: async (): Promise<string[]> => {
    return await apiClient.get<string[]>('/menu/owner/dishes/lookups/tags');
  },

  getAllergensLookup: async (): Promise<string[]> => {
    return await apiClient.get<string[]>('/menu/owner/dishes/lookups/allergens');
  },

  createTagLookup: async (tagName: string): Promise<string> => {
    const response = await apiClient.post<{ name: string }>('/menu/owner/dishes/lookups/tags', { name: tagName });
    return response.name || tagName;
  },

  createAllergenLookup: async (allergenName: string): Promise<string> => {
    const response = await apiClient.post<{ name: string }>('/menu/owner/dishes/lookups/allergens', { name: allergenName });
    return response.name || allergenName;
  },

  deleteTagLookup: async (tagName: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/dishes/lookups/tags/${encodeURIComponent(tagName)}`);
  },

  deleteAllergenLookup: async (allergenName: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/dishes/lookups/allergens/${encodeURIComponent(allergenName)}`);
  },

  create: async (categoryId: string, data: DishFormValues): Promise<Dish> => {
    return await menuApi.createDish(categoryId, data);
  },

  update: async (id: string, data: Partial<DishFormValues>): Promise<Dish> => {
    return await menuApi.updateDish(id, data);
  }
};