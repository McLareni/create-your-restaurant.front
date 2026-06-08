import { apiClient } from '@/shared/api/client';
import { InventoryItem, CreateInventoryItemDTO, UpdateInventoryItemDTO } from '../types/inventory.types';

export const inventoryApi = {
  getAll: async (restaurantId: number): Promise<InventoryItem[]> => {
    return await apiClient.get<InventoryItem[]>(`/restaurants/${restaurantId}/inventory`);
  },

  create: async (restaurantId: number, data: CreateInventoryItemDTO): Promise<InventoryItem> => {
    return await apiClient.post<InventoryItem>(`/restaurants/${restaurantId}/inventory`, data);
  },

  update: async (restaurantId: number, data: UpdateInventoryItemDTO): Promise<InventoryItem> => {
    return await apiClient.patch<InventoryItem>(`/restaurants/${restaurantId}/inventory/${data.id}`, data);
  },

  delete: async (restaurantId: number, id: string): Promise<{ message: string }> => {
    return await apiClient.delete<{ message: string }>(`/restaurants/${restaurantId}/inventory/${id}`);
  },
};