import { apiClient } from '@/shared/api/client';
import type { ModifierGroup, CreateModifierGroupDTO, UpdateModifierGroupDTO } from '@/features/menu-builder/types/modifiers.types';

export const modifiersApi = {
  getGroups: async (): Promise<ModifierGroup[]> => {
    return await apiClient.get<ModifierGroup[]>('/modifiers');
  },

  createGroup: async (data: CreateModifierGroupDTO): Promise<ModifierGroup> => {
    return await apiClient.post<ModifierGroup>('/modifiers', data);
  },

  updateGroup: async (groupId: string, data: UpdateModifierGroupDTO): Promise<ModifierGroup> => {
    return await apiClient.patch<ModifierGroup>(`/modifiers/${groupId}`, data);
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    await apiClient.delete(`/modifiers/${groupId}`);
  }
};