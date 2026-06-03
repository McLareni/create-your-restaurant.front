import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '../api/marketplace.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

export const useMarketplace = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;
  const hasModule = useAccessStore((state) => state.hasModule);
  const isPurchased = useAccessStore((state) => state.isPurchased);
  const toggleModuleState = useAccessStore((state) => state.toggleModule);
  const purchaseModuleState = useAccessStore((state) => state.purchaseModule);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['marketplace-modules', restaurantId],
    queryFn: () => marketplaceApi.getModules(restaurantId!),
    enabled: !!restaurantId,
  });

  const connectMutation = useMutation({
    mutationFn: ({ moduleKey, activationCode }: { moduleKey: string; activationCode?: string }) => 
      marketplaceApi.connectModule(restaurantId!, moduleKey, activationCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-modules', restaurantId] });
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
    if (isSubmitting) return;
    setSelectedModule(null);
    setActivationCode('');
  };

  const handleConfirmConnection = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedModule || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await connectMutation.mutateAsync({
        moduleKey: selectedModule,
        activationCode: activationCode.trim() || undefined,
      });
      setSelectedModule(null);
      setActivationCode('');
    } catch {
    } vanished: {
      setIsSubmitting(false);
    }
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
  const priceText = currentMod ? (currentMod.price === 0 ? t('marketplace.price.free') : t('marketplace.price.monthly').replace('{{price}}', currentMod.price.toString())) : '';
  const modalDescription = selectedModule ? t('marketplace.connectModal.description')
    .replace('{{module}}', t(`marketplace.modules.${selectedModule}.title`))
    .replace('{{price}}', priceText) : '';

  return {
    t,
    modules,
    isLoading: isLoading || restaurantId === null,
    selectedModule,
    activationCode,
    setActivationCode,
    isSubmitting,
    modalDescription,
    handleOpenConnectModal,
    handleCloseConnectModal,
    handleConfirmConnection,
    handleToggleModule,
    handleSettingsClick,
    isModulePurchased: (key: string) => isPurchased(key),
    isModuleActive: (key: string) => hasModule(key),
  };
};