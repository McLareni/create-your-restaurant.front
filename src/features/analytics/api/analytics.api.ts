import { apiClient } from '@/shared/api/client';
import { AnalyticsSummary } from '../types/analytics.types';

export const analyticsApi = {
  getSummary: async (restaurantId: number, startDate?: string, endDate?: string): Promise<AnalyticsSummary> => {
    let url = `/restaurants/${restaurantId}/analytics`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return await apiClient.get<AnalyticsSummary>(url);
  }
};