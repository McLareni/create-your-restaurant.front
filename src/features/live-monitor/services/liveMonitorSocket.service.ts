import { QueryClient } from '@tanstack/react-query';
import type { Socket } from 'socket.io-client';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import type { LiveMonitorSnapshot, OrdersChangedPayload } from '@/features/live-monitor/types/liveMonitor.types';

export const attachLiveMonitorListeners = (
  socket: Socket,
  queryClient: QueryClient,
  restaurantId: number
) => {
  const queryKey = QUERY_KEYS.liveMonitor(restaurantId);

  const handleOrdersChanged = (payload: OrdersChangedPayload) => {
    if (Number(payload.restaurantId) !== restaurantId) return;
    queryClient.setQueryData<LiveMonitorSnapshot>(queryKey, payload.snapshot);
  };

  socket.on('live-monitor:orders-changed', handleOrdersChanged);

  return () => {
    socket.off('live-monitor:orders-changed', handleOrdersChanged);
  };
};