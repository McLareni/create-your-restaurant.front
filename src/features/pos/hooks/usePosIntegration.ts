import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { posApi } from '../api/pos.api';
import { z } from 'zod';
import toast from 'react-hot-toast';

const posConnectionSchema = z.object({
  apiKey: z.string().min(10, 'pos.errors.tokenTooShort').max(255, 'pos.errors.tokenTooLong'),
});

export const usePosIntegration = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const hasModule = useAccessStore((state) => state.activeModules.includes('pos-sync'));
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const [apiKey, setApiKey] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey: ['pos-status', restaurantId],
    queryFn: () => posApi.getStatus(restaurantId!),
    enabled: hasModule && !!restaurantId,
  });

  const connectMutation = useMutation({
    mutationFn: (data: { apiKey: string }) => posApi.connect(restaurantId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-status', restaurantId] });
      toast.success(t('pos.successTitle'));
      setApiKey('');
      setValidationError(null);
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: { importMenu?: boolean; syncStops?: boolean }) =>
      posApi.updateSettings(restaurantId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-status', restaurantId] });
      toast.success(t('common.success') || 'Збережено');
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const syncMenuMutation = useMutation({
    mutationFn: () => posApi.syncMenu(restaurantId!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      toast.success(`${t('pos.importMenu')}: ${data.categoriesCreated}, ${data.dishesCreated}`);
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const handleNavigateToMarketplace = () => {
    router.push('/dashboard/marketplace');
  };

  const handleConnect = async () => {
    setValidationError(null);
    const result = posConnectionSchema.safeParse({ apiKey: apiKey.trim() });
    
    if (!result.success) {
      const message = t(result.error.issues[0].message);
      setValidationError(message);
      toast.error(message);
      return;
    }

    await connectMutation.mutateAsync({ apiKey: result.data.apiKey });
  };

  const handleToggleImportMenu = async (val: boolean) => {
    await updateSettingsMutation.mutateAsync({ importMenu: val });
  };

  const handleToggleSyncStops = async (val: boolean) => {
    await updateSettingsMutation.mutateAsync({ syncStops: val });
  };

  const handleSyncMenu = async () => {
    await syncMenuMutation.mutateAsync();
  };

  return {
    t,
    hasModule,
    apiKey,
    setApiKey,
    validationError,
    isConnected: !!status?.isConnected,
    importMenu: !!status?.importMenu,
    syncStops: !!status?.syncStops,
    isSyncing: connectMutation.isPending || updateSettingsMutation.isPending,
    isMenuSyncing: syncMenuMutation.isPending,
    isLoading: isStatusLoading,
    handleNavigateToMarketplace,
    handleConnect,
    handleToggleImportMenu,
    handleToggleSyncStops,
    handleSyncMenu,
  };
};