import { apiClient } from '@/shared/api/client';

export const modifiersApi = {
  async getGroups(restaurantId: number) {
    return await apiClient.get<any>(`/restaurants/${restaurantId}/modifiers`);
  },

  async createGroup(restaurantId: number, data: any) {
    return await apiClient.post<any>(`/restaurants/${restaurantId}/modifiers`, data);
  },

  async updateGroup(restaurantId: number, groupId: string, data: any) {
    return await apiClient.patch<any>(`/restaurants/${restaurantId}/modifiers/${groupId}`, data);
  },

  async deleteGroup(restaurantId: number, groupId: string) {
    return await apiClient.delete<any>(`/restaurants/${restaurantId}/modifiers/${groupId}`);
  }
};