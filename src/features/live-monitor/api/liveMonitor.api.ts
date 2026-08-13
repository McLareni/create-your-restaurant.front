import { apiClient } from '@/shared/api/client';
import { LiveMonitorSnapshot, LiveMonitorOrder } from '../types/liveMonitor.types';

export const liveMonitorApi = {
  getTablesWithActiveOrders: async (restaurantId: number): Promise<LiveMonitorSnapshot> => {
    return await apiClient.get<LiveMonitorSnapshot>(
      `/restaurants/${restaurantId}/live-monitor/tables`,
      { cache: 'no-store' }
    );
  },

  getHistory: async (restaurantId: number, date?: string): Promise<{ orders: LiveMonitorOrder[] }> => {
    const url = `/restaurants/${restaurantId}/live-monitor/history${date ? `?date=${date}` : ''}`;
    return await apiClient.get<{ orders: LiveMonitorOrder[] }>(url);
  },

  resolveWaiterCall: async (restaurantId: number, tableId: string): Promise<unknown> => {
    return await apiClient.delete(
      `/restaurants/${restaurantId}/live-calls/${tableId}`
    );
  },

  updateOrderStatus: async (restaurantId: number, orderId: string, status: string): Promise<unknown> => {
    return await apiClient.patch(
      `/restaurants/${restaurantId}/orders/${orderId}`,
      { status }
    );
  }
};