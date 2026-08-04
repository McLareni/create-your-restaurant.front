import { apiClient } from '@/shared/api/client';
import type { InventoryItem, CreateInventoryItemDTO, UpdateInventoryItemDTO } from '@/features/menu-builder/types/inventory.types';

export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    return await apiClient.get<InventoryItem[]>('/inventory');
  },

  create: async (data: CreateInventoryItemDTO): Promise<InventoryItem> => {
    return await apiClient.post<InventoryItem>('/inventory', data);
  },

  update: async (data: UpdateInventoryItemDTO): Promise<InventoryItem> => {
    return await apiClient.patch<InventoryItem>(`/inventory/${data.id}`, data);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/inventory/${id}`);
  },
};