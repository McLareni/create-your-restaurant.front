import { apiClient } from '@/shared/api/client';
import { ModifierGroup, CreateModifierGroupDTO, UpdateModifierGroupDTO } from '@/features/menu-builder/types/modifiers.types';

export const modifiersApi = {
  getGroups: async (restaurantId: number): Promise<ModifierGroup[]> => {
    return await apiClient.get<ModifierGroup[]>(`/restaurants/${restaurantId}/modifiers`);
  },

  createGroup: async (restaurantId: number, data: CreateModifierGroupDTO): Promise<ModifierGroup> => {
    return await apiClient.post<ModifierGroup>(`/restaurants/${restaurantId}/modifiers`, data);
  },

  updateGroup: async (restaurantId: number, groupId: string, data: UpdateModifierGroupDTO): Promise<ModifierGroup> => {
    return await apiClient.patch<ModifierGroup>(`/restaurants/${restaurantId}/modifiers/${groupId}`, data);
  },

  deleteGroup: async (restaurantId: number, groupId: string): Promise<void> => {
    await apiClient.delete(`/restaurants/${restaurantId}/modifiers/${groupId}`);
  }
};