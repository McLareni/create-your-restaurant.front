import { apiClient } from '@/shared/api/client';
import { AnalyticsSummary } from '../types/analytics.types';

export const analyticsApi = {
  getSummary: (restaurantId: number) =>
    apiClient.get<AnalyticsSummary>(`/restaurants/${restaurantId}/analytics`),
};