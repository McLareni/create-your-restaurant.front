import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { posApi } from '@/features/pos/api/pos.api';
import { posConnectionSchema } from '@/features/pos/schemas/pos.schemas';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import type { PosStatusResponse, UpdatePosSettingsPayload } from '@/features/pos/types/pos.types';

export const usePosIntegration = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const activeModules = useAccessStore((state) => state.activeModules);
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const hasModule = activeModules.includes('pos-sync');
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const [apiKey, setApiKey] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditingToken, setIsEditingToken] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

  const queryKey = QUERY_KEYS.posStatus(restaurantId);

  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey,
    queryFn: () => posApi.getStatus(),
    enabled: hasModule && !!restaurantId,
  });

  const connectMutation = useMutation({
    mutationFn: (data: { apiKey: string }) => posApi.connect(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      toast.success(t('pos.successTitle'));
      setApiKey('');
      setValidationError(null);
      setIsEditingToken(false);
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdatePosSettingsPayload) => posApi.updateSettings(data),
    onMutate: async (newSettings: UpdatePosSettingsPayload) => {
      await queryClient.cancelQueries({ queryKey });
      const previousStatus = queryClient.getQueryData<PosStatusResponse>(queryKey);
      
      queryClient.setQueryData<PosStatusResponse>(queryKey, (old) => old ? {
        ...old,
        ...newSettings,
      } : old);
      
      return { previousStatus };
    },
    onError: (_err, _newSettings, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(queryKey, context.previousStatus);
      }
      toast.error(t('auth.errors.defaultError'));
    },
    onSuccess: () => {
      toast.success(t('actions.save'));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const syncMenuMutation = useMutation({
    mutationFn: () => posApi.syncMenu(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fullMenu(restaurantId) });
      toast.success(t('pos.syncSuccess', { categories: data.categoriesCreated, dishes: data.dishesCreated }));
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => posApi.disconnect(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      toast.success(t('actions.delete'));
      setApiKey('');
      setValidationError(null);
      setIsEditingToken(false);
      setIsDisconnectModalOpen(false);
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const handleNavigateToMarketplace = () => {
    router.push('/dashboard/marketplace');
  };

  const handleConnect = () => {
    setValidationError(null);
    const result = posConnectionSchema.safeParse({ apiKey: apiKey.trim() });
    if (!result.success) {
      const message = t(result.error.issues[0].message);
      setValidationError(message);
      toast.error(message);
      return;
    }

    connectMutation.mutate({ apiKey: result.data.apiKey });
  };

  const handleToggleImportMenu = (val: boolean) => {
    updateSettingsMutation.mutate({ importMenu: val });
  };

  const handleToggleSyncStops = (val: boolean) => {
    updateSettingsMutation.mutate({ syncStops: val });
  };

  const handleSyncMenu = () => {
    syncMenuMutation.mutate();
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  return {
    t,
    hasModule,
    apiKey,
    setApiKey,
    validationError,
    isConnected: !!status?.isConnected && !isEditingToken,
    maskedApiKey: status?.maskedApiKey,
    importMenu: !!status?.importMenu,
    syncStops: !!status?.syncStops,
    isSyncing: connectMutation.isPending || updateSettingsMutation.isPending || disconnectMutation.isPending,
    isMenuSyncing: syncMenuMutation.isPending,
    isLoading: isStatusLoading,
    isEditingToken,
    setIsEditingToken,
    isDisconnectModalOpen,
    setIsDisconnectModalOpen,
    handleNavigateToMarketplace,
    handleConnect,
    handleToggleImportMenu,
    handleToggleSyncStops,
    handleSyncMenu,
    handleDisconnect,
  };
};