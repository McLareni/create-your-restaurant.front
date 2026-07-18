import { apiClient } from '@/shared/api/client';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { CategoryData } from '@/features/menu-builder/types/categories.types';
import type { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';
import type { FullMenuResponse, ReorderItem } from '@/features/menu-builder/types/menu-board.types';

export const menuApi = {
  getFullMenu: async (restaurantId: number): Promise<FullMenuResponse> => {
    return await apiClient.get<FullMenuResponse>(`/menu/owner/${restaurantId}`);
  },

  createCategory: async (data: { restaurantId: number; name: string; sortOrder: number }): Promise<CategoryData> => {
    return await apiClient.post<CategoryData>('/menu/owner/categories', data);
  },

  updateCategory: async (id: string, data: { name: string; sortOrder?: number }): Promise<CategoryData> => {
    return await apiClient.patch<CategoryData>(`/menu/owner/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/categories/${id}`);
  },

  createDish: async (categoryId: string, data: DishFormValues): Promise<Dish> => {
    return await apiClient.post<Dish>(`/menu/owner/categories/${categoryId}/dishes`, data);
  },

  updateDish: async (id: string, data: Partial<DishFormValues> & { categoryId?: string; sortOrder?: number }): Promise<Dish> => {
    return await apiClient.patch<Dish>(`/menu/owner/dishes/${id}`, data);
  },

  uploadDishPhoto: async (id: string, file: File): Promise<Dish> => {
    const formData = new FormData();
    formData.append('photo', file);
    return await apiClient.patch<Dish>(`/menu/owner/dishes/${id}`, formData);
  },

  deleteDish: async (id: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/dishes/${id}`);
  },
  
  reorderCategories: async (items: ReorderItem[]): Promise<void> => {
    return await apiClient.patch<void>('/menu/owner/categories/reorder', { items });
  },

  reorderDishes: async (items: ReorderItem[]): Promise<void> => {
    return await apiClient.patch<void>('/menu/owner/dishes/reorder', { items });
  },
};