'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
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

  const resolveWaiterCallMutation = useMutation({
    mutationFn: (tableId: string) => {
      if (!Number.isFinite(restaurantId)) {
        throw new Error('Restaurant is not selected');
      }

      return liveMonitorApi.resolveWaiterCall(restaurantId, tableId);
    },
    onSuccess: () => {
      toast.success('Статус столу оновлено');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'serverError';
      toast.error(message);
    },
  });

  const socketUrl = useMemo(() => getApiBaseUrl(), []);

  useEffect(() => {
    if (!Number.isFinite(restaurantId) || !socketUrl) {
      return;
    }
    let isCancelled = false;
    let socket: Socket | null = null;

    const initSocket = async () => {
      try {
        const tokenResponse = await fetch('/api/auth/socket-session', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!tokenResponse.ok) {
          return;
        }

        const tokenPayload = (await tokenResponse.json()) as { token?: string };
        const sessionToken = tokenPayload.token;

        if (isCancelled || !sessionToken) {
          return;
        }

        socket = io(`${socketUrl}/live-monitor`, {
          path: '/socket.io',
          transports: ['websocket', 'polling'],
          withCredentials: true,
          auth: { restaurantId, token: sessionToken },
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
      } catch {
        setIsSocketConnected(false);
      }
    };

    void initSocket();

    return () => {
      isCancelled = true;
      setIsSocketConnected(false);

      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, [queryClient, restaurantId, socketUrl]);

  return {
    tables: query.data?.tables ?? [],
    generatedAt: query.data?.generatedAt ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSocketConnected,
    refetch: query.refetch,
    resolveWaiterCall: (tableId: string) =>
      resolveWaiterCallMutation.mutate(tableId),
    resolvingWaiterTableId: resolveWaiterCallMutation.variables,
    isResolvingWaiterCall: resolveWaiterCallMutation.isPending,
  };
};
