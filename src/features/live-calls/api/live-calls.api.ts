import { apiClient } from '@/shared/api/client';
import { LiveCallItem, TriggerCallPayload } from '../types/live-calls.types';

export const liveCallsApi = {
  getActiveCalls: (restaurantId: number) =>
    apiClient.get<LiveCallItem[]>(`/restaurants/${restaurantId}/live-calls`),

  dismissCall: (restaurantId: number, callId: string) =>
    apiClient.delete(`/restaurants/${restaurantId}/live-calls/${callId}`),

  publicTriggerCall: (restaurantId: number, data: TriggerCallPayload) =>
    apiClient.post(`/restaurants/${restaurantId}/live-calls/public/trigger`, data),
};