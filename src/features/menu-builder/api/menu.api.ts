import { apiClient } from '@/shared/api/client';

export const menuApi = {
  getFullMenu: async (restaurantId: number): Promise<any> => {
    return await apiClient.get<any>(`/menu/owner/${restaurantId}`);
  },

  createCategory: async (data: { restaurantId: number; name: string; sortOrder: number }): Promise<any> => {
    return await apiClient.post<any>('/menu/owner/categories', data);
  },

  updateCategory: async (id: string, data: { name: string; sortOrder?: number }): Promise<any> => {
    return await apiClient.patch<any>(`/menu/owner/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<any> => {
    return await apiClient.delete<any>(`/menu/owner/categories/${id}`);
  },

  createDish: async (categoryId: string, data: any): Promise<any> => {
    return await apiClient.post<any>(`/menu/owner/categories/${categoryId}/dishes`, data);
  },

  updateDish: async (id: string, data: any): Promise<any> => {
    return await apiClient.patch<any>(`/menu/owner/dishes/${id}`, data);
  },

  deleteDish: async (id: string): Promise<any> => {
    return await apiClient.delete<any>(`/menu/owner/dishes/${id}`);
  },
  
  reorderDishes: async (items: { id: string; sortOrder: number }[]) => {
    return apiClient.patch('/menu/owner/dishes/reorder', { items });
  },
};