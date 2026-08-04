import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '@/features/marketplace/api/marketplace.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useUserStore } from '@/shared/store/useUserStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { connectModuleSchema } from '@/features/marketplace/schemas/marketplace.schema';
import type { ConnectModuleArgs } from '@/features/marketplace/types/marketplace.types';
import toast from 'react-hot-toast';

export const useMarketplace = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;
  const activeModules = useAccessStore((state) => state.activeModules);
  const purchasedModules = useAccessStore((state) => state.purchasedModules);
  const isLoadingAccess = useAccessStore((state) => state.isLoadingAccess);
  const toggleModuleState = useAccessStore((state) => state.toggleModule);
  const fetchAccessData = useAccessStore((state) => state.fetchAccessData);
  const isMainForMultiRestaurant = useAccessStore((state) => state.isMainForMultiRestaurant);
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState('');
  const [isPending, startTransition] = useTransition();

  const modules = useMemo(() => {
    return marketplaceApi.getModules(purchasedModules, activeModules);
  }, [purchasedModules, activeModules]);

  const connectMutation = useMutation({
    mutationFn: ({ moduleKey, activationCode }: ConnectModuleArgs) => 
      marketplaceApi.connectModule(restaurantId!, moduleKey, activationCode),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-modules', restaurantId] });
      
      if (restaurantId) {
        await fetchAccessData(String(restaurantId), true).catch(() => {});
      }
      
      if (variables.moduleKey === 'multi-restaurant') {
        useUserStore.getState().fetchUser(true);
      }
      
      toast.success(t('marketplace.status.active'));
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : 'auth.errors.defaultError';
      toast.error(t(msg));
    },
  });

  const handleOpenConnectModal = (moduleKey: string) => {
    setSelectedModule(moduleKey);
    setActivationCode('');
  };

  const handleCloseConnectModal = () => {
    if (connectMutation.isPending) return;
    setSelectedModule(null);
    setActivationCode('');
  };

  const handleConfirmConnectionAction = async () => {
    if (!selectedModule || connectMutation.isPending) return;
    const result = connectModuleSchema.safeParse({ activationCode });
    if (!result.success) {
      const issue = result.error.issues[0];
      toast.error(issue ? t(issue.message) : t('errors.formValidation'));
      return;
    }

    try {
      await connectMutation.mutateAsync({
        moduleKey: selectedModule,
        activationCode: activationCode.trim() || undefined,
      });
      setSelectedModule(null);
      setActivationCode('');
    } catch {
    }
  };

  const handleToggleModule = (moduleKey: string, isActive: boolean) => {
    startTransition(async () => {
      try {
        await toggleModuleState(moduleKey, isActive);
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'auth.errors.defaultError';
        toast.error(t(msg));
      }
    });
  };

  const handleSettingsClick = (moduleKey: string) => {
    const routeMap: Record<string, string> = {
      'menu-engine': '/dashboard/menu-builder',
      'qr-tables': '/dashboard/qr',
      'staff': '/dashboard/staff',
      'pos-sync': '/dashboard/pos',
    };
    router.push(routeMap[moduleKey] || `/dashboard/${moduleKey}`);
  };

  const currentMod = modules.find(m => m.key === selectedModule);
  const priceText = currentMod ? 
    (currentMod.price === 0 ? t('marketplace.price.free') : t('marketplace.price.monthly', { price: currentMod.price.toString() })) : '';
  
  const modalDescription = selectedModule ? 
    t('marketplace.connectModal.description', {
      module: t(`marketplace.modules.${selectedModule}.title`),
      price: priceText
    }) : '';
  
  return {
    t,
    modules,
    isLoading: isLoadingAccess || restaurantId === null,
    selectedModule,
    activationCode,
    setActivationCode,
    isPending: isPending || connectMutation.isPending,
    modalDescription,
    isMainForMultiRestaurant,
    handleOpenConnectModal,
    handleCloseConnectModal,
    handleConfirmConnectionAction,
    handleToggleModule,
    handleSettingsClick,
    isModulePurchased: (key: string) => purchasedModules.includes(key),
    isModuleActive: (key: string) => activeModules.includes(key),
  };
};