'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { liveMonitorApi } from '../api/liveMonitor.api';
import { getApiBaseUrl } from '@/shared/api/base-url';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import type { LiveMonitorSnapshot } from '../types/liveMonitor.types';

type OrdersChangedPayload = {
  restaurantId: number;
  changeType: 'created' | 'updated' | 'deleted';
  orderId: string;
  emittedAt: string;
  snapshot: LiveMonitorSnapshot;
};

const LIVE_MONITOR_QUERY_KEY = 'live-monitor-tables';

export const useLiveMonitor = () => {
  const queryClient = useQueryClient();
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : NaN;

  const query = useQuery({
    queryKey: [LIVE_MONITOR_QUERY_KEY, restaurantId],
    queryFn: () => liveMonitorApi.getTablesWithActiveOrders(restaurantId),
    enabled: Number.isFinite(restaurantId),
    refetchOnWindowFocus: false,
  });

  const socketUrl = useMemo(() => getApiBaseUrl(), []);

  useEffect(() => {
    if (!Number.isFinite(restaurantId) || !socketUrl) {
      return;
    }

    const socket: Socket = io(`${socketUrl}/live-monitor`, {
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: true,
      auth: { restaurantId },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
    });

    const handleConnect = () => {
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };

    const handleOrdersChanged = (payload: OrdersChangedPayload) => {
      if (Number(payload.restaurantId) !== restaurantId) {
        return;
      }

      queryClient.setQueryData<LiveMonitorSnapshot>(
        [LIVE_MONITOR_QUERY_KEY, restaurantId],
        payload.snapshot,
      );
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('live-monitor:orders-changed', handleOrdersChanged);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('live-monitor:orders-changed', handleOrdersChanged);
      socket.disconnect();
    };
  }, [queryClient, restaurantId, socketUrl]);

  return {
    tables: query.data?.tables ?? [],
    generatedAt: query.data?.generatedAt ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSocketConnected,
    refetch: query.refetch,
  };
};
