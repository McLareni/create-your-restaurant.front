import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '@/features/marketplace/api/marketplace.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { ConnectModuleArgs } from '../types/marketplace.types';
import toast from 'react-hot-toast';

export const useMarketplace = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const activeModules = useAccessStore((state) => state.activeModules);
  const purchasedModules = useAccessStore((state) => state.purchasedModules);
  const toggleModuleState = useAccessStore((state) => state.toggleModule);
  const purchaseModuleState = useAccessStore((state) => state.purchaseModule);
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState('');
  const [isPending, startTransition] = useTransition();

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['marketplace-modules', restaurantId],
    queryFn: () => marketplaceApi.getModules(restaurantId!),
    enabled: !!restaurantId,
  });

  const connectMutation = useMutation({
    mutationFn: ({ moduleKey, activationCode }: ConnectModuleArgs) => 
      marketplaceApi.connectModule(restaurantId!, moduleKey, activationCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-modules', restaurantId] });
      if (variables.moduleKey === 'multi-restaurant') {
        queryClient.invalidateQueries({ queryKey: ['/users/me'] });
      }
      purchaseModuleState(variables.moduleKey);
      toast.success(t('marketplace.status.active'));
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    },
  });

  const handleOpenConnectModal = (moduleKey: string) => {
    setSelectedModule(moduleKey);
    setActivationCode('');
  };

  const handleCloseConnectModal = () => {
    if (isPending) return;
    setSelectedModule(null);
    setActivationCode('');
  };

  const handleConfirmConnectionAction = () => {
    if (!selectedModule || isPending) return;

    startTransition(async () => {
      try {
        await connectMutation.mutateAsync({
          moduleKey: selectedModule,
          activationCode: activationCode.trim() || undefined,
        });
        setSelectedModule(null);
        setActivationCode('');
      } catch {
        // Error handling inside useMutation onError
      }
    });
  };

  const handleToggleModule = async (moduleKey: string, isActive: boolean) => {
    try {
      await toggleModuleState(moduleKey, isActive);
    } catch {
      toast.error(t('auth.errors.defaultError'));
    }
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
    (currentMod.price === 0 ? t('marketplace.price.free') : t('marketplace.price.monthly').replace('{{price}}', currentMod.price.toString())) : '';
  
  const modalDescription = selectedModule ? 
    t('marketplace.connectModal.description')
      .replace('{{module}}', t(`marketplace.modules.${selectedModule}.title`))
      .replace('{{price}}', priceText) : '';

  return {
    t,
    modules,
    isLoading: isLoading || restaurantId === null,
    selectedModule,
    activationCode,
    setActivationCode,
    isPending,
    modalDescription,
    handleOpenConnectModal,
    handleCloseConnectModal,
    handleConfirmConnectionAction,
    handleToggleModule,
    handleSettingsClick,
    isModulePurchased: (key: string) => purchasedModules.includes(key),
    isModuleActive: (key: string) => activeModules.includes(key),
  };
};