import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { organizationApi } from '@/features/organizations/api/organizations.api';
import type { SidebarRestaurant } from '@/widgets/sidebar/types/sidebar.types';
import type { User } from '@/shared/store/useUserStore';

type ExtendedUser = User & {
  restaurants?: SidebarRestaurant[];
};

export const useOrganizationSelector = () => {
  const { t } = useTranslation();
  const router = useRouter();
  
  const user = useUserStore((state) => state.user) as ExtendedUser | null;
  const setUser = useUserStore((state) => state.setUser);
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const setActiveRestaurant = useRestaurantStore((state) => state.setActiveRestaurant);
  const purchasedModules = useAccessStore((state) => state.purchasedModules);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const restaurants = user?.restaurants || [];
  const hasMultiModule = purchasedModules.includes('multi-restaurant');
  const maxAllowed = hasMultiModule ? 3 : 1;
  const isLimitReached = restaurants.length >= maxAllowed;

  const handleSelect = (restaurant: SidebarRestaurant, isLocked: boolean) => {
    if (isLocked) {
      toast.error(t('sidebar.locked.title'));
      router.push('/dashboard/marketplace');
      return;
    }
    setActiveRestaurant(restaurant);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    
    const reordered = [...restaurants];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);
    
    if (user) {
      setUser({ ...user, restaurants: reordered });
    }
    setDraggedIndex(null);
    
    try {
      const idsOrder = reordered.map((r) => Number(r.id));
      await organizationApi.reorder(idsOrder);
      
      const currentActiveStillAllowed = reordered
        .slice(0, maxAllowed)
        .some((r) => String(r.id) === String(activeRestaurant?.id));
        
      if (!currentActiveStillAllowed && reordered.length > 0) {
        setActiveRestaurant(reordered[0]);
      }
      
    } catch {
      toast.error(t('auth.errors.defaultError'));
      await useUserStore.getState().fetchUser(true);
    }
  };

  return {
    t,
    router,
    restaurants,
    activeRestaurant,
    maxAllowed,
    isLimitReached,
    handleSelect,
    handleDragStart,
    handleDrop,
  };
};