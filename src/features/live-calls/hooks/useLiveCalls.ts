import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { liveCallsApi } from '@/features/live-calls/api/live-calls.api';
import type { LiveCallItem } from '@/features/live-calls/types/live-calls.types';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

export const useLiveCalls = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const hasModule = useAccessStore((state) => state.activeModules.includes('live-calls'));
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const [dismissingIds, setDismissingIds] = useState<string[]>([]);
  const queryKey = ['live-calls-list', restaurantId];

  const { data: calls = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => liveCallsApi.getActiveCalls(restaurantId!),
    enabled: hasModule && !!restaurantId,
  });

  useEffect(() => {
    if (!hasModule || !restaurantId) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const socket: Socket = io(socketUrl);

    socket.on('connect', () => {
      socket.emit('join_restaurant', { restaurantId });
    });

    socket.on('new_call', (call: LiveCallItem) => {
      queryClient.setQueryData<LiveCallItem[]>(queryKey, (prev) => {
        if (!prev) return [call];
        if (prev.some((c) => c.id === call.id)) return prev;
        return [...prev, call];
      });
      toast(t('liveCalls.notification'), { icon: '🔔' });
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav');
        void audio.play();
      } catch {}
    });

    socket.on('call_dismissed', (callId: string) => {
      queryClient.setQueryData<LiveCallItem[]>(queryKey, (prev) => prev ? prev.filter((c) => c.id !== callId) : []);
      setDismissingIds((prev) => prev.filter((id) => id !== callId));
    });

    return () => {
      socket.disconnect();
    };
  }, [hasModule, restaurantId, queryClient]);

  const dismissMutation = useMutation({
    mutationFn: (callId: string) => liveCallsApi.dismissCall(restaurantId!, callId),
    onMutate: (callId) => {
      setDismissingIds((prev) => [...prev, callId]);
    },
    onSuccess: (_, callId) => {
      queryClient.setQueryData<LiveCallItem[]>(queryKey, (prev) => prev ? prev.filter((c) => c.id !== callId) : []);
      setDismissingIds((prev) => prev.filter((id) => id !== callId));
    },
    onError: (_, callId) => {
      setDismissingIds((prev) => prev.filter((id) => id !== callId));
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const handleDismiss = async (callId: string) => {
    await dismissMutation.mutateAsync(callId);
  };

  const handleNavigateToMarketplace = () => {
    router.push('/dashboard/marketplace');
  };

  return {
    t,
    hasModule,
    calls,
    isLoading,
    dismissingIds,
    handleDismiss,
    handleNavigateToMarketplace,
  };
};