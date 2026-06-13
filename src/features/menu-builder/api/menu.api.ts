import { apiClient } from '@/shared/api/client';
import { Dish } from '../types/dishes.types';
import { CategoryData } from '../types/categories.types';
import { DishFormValues } from '../schemas/dishes.schema';
import { FullMenuResponse } from '../types/menu-board.types';

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

  uploadDishPhoto: async (id: string, photo: File): Promise<Dish> => {
    const formData = new FormData();
    formData.append('photo', photo);
    return await apiClient.patch<Dish>(`/menu/owner/dishes/${id}/photo`, formData);
  },

  deleteDish: async (id: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/dishes/${id}`);
  },
  
  reorderCategories: async (items: { id: string; sortOrder: number }[]): Promise<void> => {
    // Виправлено 404: NestJS очікує PATCH або PUT для оновлення порядку всього масиву
    await apiClient.patch('/menu/owner/categories/reorder', { items });
  },

  reorderDishes: async (items: { id: string; sortOrder: number }[]): Promise<void> => {
    // Виправлено 404: Переведено на PATCH для синхронізації з роутами NestJS
    await apiClient.patch('/menu/owner/dishes/reorder', { items });
  }
};