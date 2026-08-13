import { apiClient } from '@/shared/api/client';
import { VisualSettings } from '@/shared/config/visual.constants';

export const visualApi = {
  getSettings: (restaurantId: number) =>
    apiClient.get<VisualSettings>(`/restaurants/${restaurantId}/visual`),
    
  updateSettings: (restaurantId: number, data: Partial<VisualSettings>) =>
    apiClient.patch<VisualSettings>(`/restaurants/${restaurantId}/visual`, data),
};
