import { apiClient } from '@/shared/api/client';
import { Category, CreateCategoryDTO } from '../types/categories.types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<any>('/menu/owner/categories');
    const categories: Category[] = Array.isArray(response) ? response : response.categories || [];
    return categories.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  create: async (data: CreateCategoryDTO & { restaurantId: number; sortOrder: number }): Promise<Category> => {
    const response = await apiClient.post<any>('/menu/owner/categories', data);
    return response.category || response;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.patch<any>(`/menu/owner/categories/${id}`, data);
    return response.category || response;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/menu/owner/categories/${id}`);
  },

  // Послідовне оновлення сортування для запобігання стану перегонів в БД
  reorder: async (items: { id: string; sortOrder: number }[]): Promise<void> => {
    for (const item of items) {
      await apiClient.patch(`/menu/owner/categories/${item.id}`, { sortOrder: item.sortOrder });
    }
  }
};