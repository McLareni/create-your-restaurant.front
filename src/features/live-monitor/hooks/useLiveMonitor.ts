import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { liveMonitorApi } from '@/features/live-monitor/api/liveMonitor.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useSocketStore } from '@/shared/store/useSocketStore';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import { attachLiveMonitorListeners } from '@/features/live-monitor/services/liveMonitorSocket.service';
import { useTranslation } from '@/shared/hooks/useTranslation';

export const useLiveMonitor = (historyDate?: string) => {
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : NaN;
  const { socket, isConnected, connect } = useSocketStore();
  const { t } = useTranslation();

  const queryKey = QUERY_KEYS.liveMonitor(restaurantId);

  const query = useQuery({
    queryKey,
    queryFn: () => liveMonitorApi.getTablesWithActiveOrders(restaurantId),
    enabled: Number.isFinite(restaurantId),
    refetchOnWindowFocus: false,
  });

  const historyQuery = useQuery({
    queryKey: [...queryKey, 'history', historyDate],
    queryFn: () => liveMonitorApi.getHistory(restaurantId, historyDate),
    enabled: Number.isFinite(restaurantId),
    refetchOnWindowFocus: false,
  });

  const resolveWaiterCallMutation = useMutation({
    mutationFn: (tableId: string) => {
      if (!Number.isFinite(restaurantId)) throw new Error('Restaurant is not selected');
      return liveMonitorApi.resolveWaiterCall(restaurantId, tableId);
    },
    onSuccess: () => {
      toast.success(t('liveCalls.tableStatusUpdated'));
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'serverError');
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => {
      if (!Number.isFinite(restaurantId)) throw new Error('Restaurant is not selected');
      return liveMonitorApi.updateOrderStatus(restaurantId, orderId, status);
    },
    onSuccess: () => {
      toast.success(t('liveCalls.orderStatusUpdated'));
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'serverError');
    },
  });

  const prevCallIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!query.data?.tables) return;
    
    const currentCallIds = new Set(
      query.data.tables.filter((t) => t.isWaiterCallActive).map((t) => t.id)
    );
    
    prevCallIdsRef.current = currentCallIds;
  }, [query.data?.tables]);

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
    updateOrderStatus: (orderId: string, status: string) => updateOrderStatusMutation.mutate({ orderId, status }),
    isUpdatingOrderStatus: updateOrderStatusMutation.isPending,
    updatingOrderId: updateOrderStatusMutation.variables?.orderId,
    historyOrders: historyQuery.data?.orders ?? [],
    isHistoryLoading: historyQuery.isLoading,
    refetchHistory: historyQuery.refetch,
  };
};