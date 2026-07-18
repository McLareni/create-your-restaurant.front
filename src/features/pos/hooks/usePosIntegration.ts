import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { posApi } from '@/features/pos/api/pos.api';
import { posConnectionSchema } from '@/features/pos/schemas/pos.schemas';
import type { PosStatusResponse, UpdatePosSettingsPayload } from '@/features/pos/types/pos.types';
import toast from 'react-hot-toast';

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

  const [isTokenPanelOpen, setIsTokenPanelOpen] = useState(true);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(true);

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
      setIsEditingToken(false);
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdatePosSettingsPayload) =>
      posApi.updateSettings(restaurantId!, data),
    onMutate: async (newSettings: UpdatePosSettingsPayload) => {
      await queryClient.cancelQueries({ queryKey: ['pos-status', restaurantId] });
      const previousStatus = queryClient.getQueryData(['pos-status', restaurantId]);
      queryClient.setQueryData(['pos-status', restaurantId], (old: PosStatusResponse | undefined) => old ? {
        ...old,
        ...newSettings,
      } : old);
      return { previousStatus };
    },
    onError: (_err, _newSettings, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(['pos-status', restaurantId], context.previousStatus);
      }
      toast.error(t('auth.errors.defaultError'));
    },
    onSuccess: () => {
      toast.success(t('common.success') || 'Збережено');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-status', restaurantId] });
    },
  });

  const syncMenuMutation = useMutation({
    mutationFn: () => posApi.syncMenu(restaurantId!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pos-status', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
      toast.success(t('pos.syncSuccess', { categories: data.categoriesCreated, dishes: data.dishesCreated }));
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => posApi.disconnect(restaurantId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-status', restaurantId] });
      toast.success(t('common.success') || 'Відключено');
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
    maskedApiKey: status?.maskedApiKey || '',
    importMenu: !!status?.importMenu,
    syncStops: !!status?.syncStops,
    isSyncing: connectMutation.isPending || updateSettingsMutation.isPending || disconnectMutation.isPending,
    isMenuSyncing: syncMenuMutation.isPending,
    isLoading: isStatusLoading,
    isEditingToken,
    setIsEditingToken,
    isDisconnectModalOpen,
    setIsDisconnectModalOpen,
    isTokenPanelOpen,
    setIsTokenPanelOpen,
    isSettingsPanelOpen,
    setIsSettingsPanelOpen,
    handleNavigateToMarketplace,
    handleConnect,
    handleToggleImportMenu,
    handleToggleSyncStops,
    handleSyncMenu,
    handleDisconnect,
  };
};