import { apiClient } from '@/shared/api/client';
import { LiveMonitorSnapshot } from '../types/liveMonitor.types';

export const liveMonitorApi = {
  getTablesWithActiveOrders: (restaurantId: number) =>
    apiClient.get<LiveMonitorSnapshot>(
      `/restaurants/${restaurantId}/live-monitor/tables`,
      { cache: 'no-store' },
    ),

  resolveWaiterCall: (restaurantId: number, tableId: string) =>
    apiClient.patch<{ message: string; tableId: string }>(
      `/restaurants/${restaurantId}/live-monitor/tables/${tableId}/waiter-call/resolve`,
      {},
    ),
};
