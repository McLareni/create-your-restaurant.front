import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocketStore } from '@/shared/store/useSocketStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { liveMonitorApi } from '@/features/live-monitor/api/liveMonitor.api';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import { OrdersChangedPayload } from '@/features/live-monitor/types/liveMonitor.types';

export const useLiveMonitorTracker = () => {
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : NaN;
  const { socket, connect } = useSocketStore();
  
  const query = useQuery({
    queryKey: QUERY_KEYS.liveMonitor(restaurantId),
    queryFn: () => liveMonitorApi.getTablesWithActiveOrders(restaurantId),
    enabled: Number.isFinite(restaurantId),
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/notification.mp3');
    }
  }, []);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log('Audio play blocked:', e));
    }
  };

  useEffect(() => {
    if (Number.isFinite(restaurantId)) {
      void connect(restaurantId);
    }
  }, [restaurantId, connect]);

  useEffect(() => {
    if (!socket || !Number.isFinite(restaurantId)) return;

    const handleOrdersChanged = (payload: OrdersChangedPayload) => {
      if (Number(payload.restaurantId) !== restaurantId) return;
      
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveMonitor(restaurantId) });
      
      if (payload.changeType === 'created') {
        playNotification();
      }
    };

    const handleWaiterCalled = (payload: { restaurantId: number; tableId: string; type: string }) => {
      if (Number(payload.restaurantId) !== restaurantId) return;
      
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.liveMonitor(restaurantId) });
      playNotification();
    };

    socket.on('live-monitor:orders-changed', handleOrdersChanged);
    socket.on('live-monitor:waiter-called', handleWaiterCalled);

    return () => {
      socket.off('live-monitor:orders-changed', handleOrdersChanged);
      socket.off('live-monitor:waiter-called', handleWaiterCalled);
    };
  }, [socket, restaurantId, queryClient]);

  let activeOrdersCount = 0;
  let activeWaiterCallsCount = 0;
  
  if (query.data?.tables) {
    query.data.tables.forEach(table => {
      activeOrdersCount += table.activeOrderCount;
      if (table.isWaiterCallActive) activeWaiterCallsCount++;
    });
  }

  return {
    activeOrdersCount,
    activeWaiterCallsCount,
    totalActiveTasks: activeOrdersCount + activeWaiterCallsCount
  };
};
