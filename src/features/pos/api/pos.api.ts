import { apiClient } from '@/shared/api/client';
import { PosStatusResponse, ConnectPosPayload, UpdatePosSettingsPayload, SyncMenuResponse } from '../types/pos.types';

export const posApi = {
  getStatus: (restaurantId: number) =>
    apiClient.get<PosStatusResponse>(`/restaurants/${restaurantId}/pos/status`),

  connect: (restaurantId: number, data: ConnectPosPayload) =>
    apiClient.post(`/restaurants/${restaurantId}/pos/connect`, data),

  updateSettings: (restaurantId: number, data: UpdatePosSettingsPayload) =>
    apiClient.patch(`/restaurants/${restaurantId}/pos/settings`, data),

  syncMenu: (restaurantId: number) =>
    apiClient.post<SyncMenuResponse>(`/restaurants/${restaurantId}/pos/sync-menu`),
};