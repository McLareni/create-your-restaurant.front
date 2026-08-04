import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { liveMonitorApi } from '@/features/live-monitor/api/liveMonitor.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useSocketStore } from '@/shared/store/useSocketStore';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import { attachLiveMonitorListeners } from '@/features/live-monitor/services/liveMonitorSocket.service';

export const useLiveMonitor = () => {
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : NaN;
  const { socket, isConnected, connect } = useSocketStore();

  const queryKey = QUERY_KEYS.liveMonitor(restaurantId);

  const query = useQuery({
    queryKey,
    queryFn: () => liveMonitorApi.getTablesWithActiveOrders(restaurantId),
    enabled: Number.isFinite(restaurantId),
    refetchOnWindowFocus: false,
  });

  const resolveWaiterCallMutation = useMutation({
    mutationFn: (tableId: string) => {
      if (!Number.isFinite(restaurantId)) throw new Error('Restaurant is not selected');
      return liveMonitorApi.resolveWaiterCall(restaurantId, tableId);
    },
    onSuccess: () => {
      toast.success('Статус столу оновлено');
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'serverError');
    },
  });

  useEffect(() => {
    if (Number.isFinite(restaurantId)) {
      void connect(restaurantId);
    }
  }, [restaurantId, connect]);

  useEffect(() => {
    if (!socket || !Number.isFinite(restaurantId)) return;

    const cleanup = attachLiveMonitorListeners(socket, queryClient, restaurantId);
    
    return cleanup;
  }, [socket, restaurantId, queryClient]);

  return {
    tables: query.data?.tables ?? [],
    generatedAt: query.data?.generatedAt ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSocketConnected: isConnected,
    refetch: query.refetch,
    resolveWaiterCall: (tableId: string) => resolveWaiterCallMutation.mutate(tableId),
    resolvingWaiterTableId: resolveWaiterCallMutation.variables,
    isResolvingWaiterCall: resolveWaiterCallMutation.isPending,
  };
};