import { apiClient } from '@/shared/api/client';
import { AnalyticsSummary } from '../types/analytics.types';

export const analyticsApi = {
  getSummary: async (restaurantId: number): Promise<AnalyticsSummary> => {
    return await apiClient.get<AnalyticsSummary>(`/restaurants/${restaurantId}/analytics`);
  }
};