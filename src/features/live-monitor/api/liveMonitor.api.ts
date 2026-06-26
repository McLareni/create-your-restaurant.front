import { apiClient } from '@/shared/api/client';
import { LiveMonitorSnapshot } from '../types/liveMonitor.types';

export const liveMonitorApi = {
  getTablesWithActiveOrders: async (restaurantId: number): Promise<LiveMonitorSnapshot> => {
    return await apiClient.get<LiveMonitorSnapshot>(
      `/restaurants/${restaurantId}/live-monitor/tables`,
      { cache: 'no-store' }
    );
  }
};
