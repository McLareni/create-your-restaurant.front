import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { liveCallsApi } from '../api/live-calls.api';
import { LiveCallItem } from '../types/live-calls.types';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

export const useLiveCalls = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const hasModule = useAccessStore((state) => state.activeModules.includes('live-calls'));
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const [calls, setCalls] = useState<LiveCallItem[]>([]);
  const [dismissingIds, setDismissingIds] = useState<string[]>([]);

  const { data: initialCalls, isLoading } = useQuery({
    queryKey: ['live-calls-list', restaurantId],
    queryFn: () => liveCallsApi.getActiveCalls(restaurantId!),
    enabled: hasModule && !!restaurantId,
  });

  useEffect(() => {
    if (initialCalls) {
      setCalls(initialCalls);
    }
  }, [initialCalls]);

  useEffect(() => {
    if (!hasModule || !restaurantId) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const socket: Socket = io(socketUrl);

    socket.on('connect', () => {
      socket.emit('join_restaurant', { restaurantId });
    });

    socket.on('new_call', (call: LiveCallItem) => {
      setCalls((prev) => {
        if (prev.some((c) => c.id === call.id)) return prev;
        return [...prev, call];
      });
      toast(t('liveCalls.notification'), { icon: '🔔' });
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav');
        audio.play();
      } catch {}
    });

    socket.on('call_dismissed', (callId: string) => {
      setCalls((prev) => prev.filter((c) => c.id !== callId));
      setDismissingIds((prev) => prev.filter((id) => id !== callId));
    });

    return () => {
      socket.off('connect');
      socket.off('new_call');
      socket.off('call_dismissed');
      socket.disconnect();
    };
  }, [hasModule, restaurantId, t]);

  const dismissMutation = useMutation({
    mutationFn: (callId: string) => liveCallsApi.dismissCall(restaurantId!, callId),
    onMutate: (callId) => {
      setDismissingIds((prev) => [...prev, callId]);
    },
    onSuccess: (_, callId) => {
      queryClient.invalidateQueries({ queryKey: ['live-calls-list', restaurantId] });
      setCalls((prev) => prev.filter((c) => c.id !== callId));
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