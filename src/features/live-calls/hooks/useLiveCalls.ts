import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useSocketStore } from '@/shared/store/useSocketStore';
import { liveCallsApi } from '@/features/live-calls/api/live-calls.api';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import { attachLiveCallsListeners } from '@/features/live-calls/services/liveCallsSocket.service';
import type { LiveCallItem } from '@/features/live-calls/types/live-calls.types';

export const useLiveCalls = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasModule = useAccessStore((state) => state.activeModules.includes('live-calls'));
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;
  
  const socket = useSocketStore((state) => state.socket);
  const connect = useSocketStore((state) => state.connect);

  const [dismissingIds, setDismissingIds] = useState<string[]>([]);
  const queryKey = QUERY_KEYS.liveCalls(restaurantId);

  const { data: calls = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => liveCallsApi.getActiveCalls(restaurantId!),
    enabled: hasModule && !!restaurantId,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav');
    }
  }, []);

  useEffect(() => {
    if (!hasModule || !restaurantId) return;
    void connect(restaurantId);
  }, [hasModule, restaurantId, connect]);

  useEffect(() => {
    if (!socket || !restaurantId) return;

    const handleNewCallAlert = () => {
      toast(t('liveCalls.notification'), { icon: '🔔' });
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    };

    const cleanup = attachLiveCallsListeners(socket, queryClient, restaurantId, handleNewCallAlert);
    
    return cleanup;
  }, [socket, queryClient, restaurantId, t]);

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