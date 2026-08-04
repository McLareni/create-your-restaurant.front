import { apiClient } from '@/shared/api/client';
import type { Combo, CreateComboDTO } from '@/features/menu-builder/types/combos.types';

export const combosApi = {
  getAll: async (): Promise<Combo[]> => {
    return await apiClient.get<Combo[]>('/combos');
  },
  
  create: async (data: CreateComboDTO): Promise<Combo> => {
    return await apiClient.post<Combo>('/combos', data);
  },

  update: async (id: string, data: CreateComboDTO): Promise<Combo> => {
    return await apiClient.patch<Combo>(`/combos/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/combos/${id}`);
  }
};