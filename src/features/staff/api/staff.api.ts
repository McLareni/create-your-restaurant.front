import { apiClient } from '@/shared/api/client';

export const staffApi = {
  async getStaff(restaurantId: number) {
    return await apiClient.get<any>(`/restaurants/${restaurantId}/staff`);
  },

  async createStaff(restaurantId: number, data: any) {
    return await apiClient.post<any>(`/restaurants/${restaurantId}/staff`, data);
  },

  async updateStaff(restaurantId: number, staffId: string, data: any) {
    return await apiClient.patch<any>(`/restaurants/${restaurantId}/staff/${staffId}`, data);
  },

  async deleteStaff(restaurantId: number, staffId: string) {
    return await apiClient.delete<any>(`/restaurants/${restaurantId}/staff/${staffId}`);
  }
};