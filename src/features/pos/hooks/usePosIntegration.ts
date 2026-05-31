'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { apiClient } from '@/shared/api/client';
import toast from 'react-hot-toast';

export const usePosIntegration = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const hasModule = useAccessStore((state) => state.hasModule);
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = Number(activeRestaurant?.id || 1);

  const [apiKey, setApiKey] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleNavigateToMarketplace = () => {
    router.push('/dashboard/marketplace');
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) return;
    setIsSyncing(true);
    try {
      await apiClient.post(`/restaurants/${restaurantId}/pos/connect`, { apiKey: apiKey.trim() });
      setIsConnected(true);
      toast.success(t('pos.successTitle'));
    } catch {
      toast.error(t('auth.errors.defaultError'));
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    t,
    hasModule: hasModule('pos-sync'),
    apiKey,
    setApiKey,
    isSyncing,
    isConnected,
    setIsConnected,
    handleNavigateToMarketplace,
    handleConnect
  };
};