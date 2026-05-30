import { apiClient } from '@/shared/api/client';
import { Combo, CreateComboDTO, UpdateComboDTO } from '../types/combos.types';

export const combosApi = {
  getAll: async (restaurantId: number): Promise<Combo[]> => {
    return await apiClient.get<Combo[]>(`/api/proxy/restaurants/${restaurantId}/combos`);
  },
  
  create: async (restaurantId: number, data: CreateComboDTO): Promise<Combo> => {
    return await apiClient.post<Combo>(`/api/proxy/restaurants/${restaurantId}/combos`, data);
  },

  update: async (restaurantId: number, id: string, data: UpdateComboDTO): Promise<Combo> => {
    return await apiClient.patch<Combo>(`/api/proxy/restaurants/${restaurantId}/combos/${id}`, data);
  },

  delete: async (restaurantId: number, id: string): Promise<void> => {
    await apiClient.delete(`/api/proxy/restaurants/${restaurantId}/combos/${id}`);
  }
};