import { apiClient } from '@/shared/api/client';
import type { PosStatusResponse, ConnectPosPayload, UpdatePosSettingsPayload, SyncMenuResponse } from '@/features/pos/types/pos.types';

export const posApi = {
  getStatus: () =>
    apiClient.get<PosStatusResponse>('/pos/status'),

  connect: (data: ConnectPosPayload) =>
    apiClient.post('/pos/connect', data),

  updateSettings: (data: UpdatePosSettingsPayload) =>
    apiClient.patch('/pos/settings', data),

  syncMenu: () =>
    apiClient.post<SyncMenuResponse>('/pos/sync-menu'),

  disconnect: () =>
    apiClient.post('/pos/disconnect'),
};