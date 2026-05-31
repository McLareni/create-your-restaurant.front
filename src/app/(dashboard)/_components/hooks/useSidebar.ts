'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useNavigation } from '@/shared/hooks/useNavigation';
import { apiClient } from '@/shared/api/client';
import toast from 'react-hot-toast';

export const useSidebarLogic = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const fetchUser = useUserStore((state) => state.fetchUser);

  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const setActiveRestaurant = useRestaurantStore((state) => state.setActiveRestaurant);

  // Пряма підписка на масиви для забезпечення реактивності рендерингу
  const activeModules = useAccessStore((state) => state.activeModules);
  const purchasedModules = useAccessStore((state) => state.purchasedModules);
  const toggleModule = useAccessStore((state) => state.toggleModule);
  const fetchAccessData = useAccessStore((state) => state.fetchAccessData);

  const hasModule = (moduleKey: string) => activeModules.includes(moduleKey);
  const isPurchased = (moduleKey: string) => purchasedModules.includes(moduleKey);

  const { menuGroups } = useNavigation();
  
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockedModule, setLockedModule] = useState<{name: string, key: string} | null>(null);
  
  const [restaurantToDelete, setRestaurantToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const restaurants = user?.restaurants || [];

  useEffect(() => {
    if (restaurants.length > 0 && !activeRestaurant) {
      setActiveRestaurant({
        ...restaurants[0],
        id: Number(restaurants[0].id)
      });
    }
  }, [restaurants, activeRestaurant, setActiveRestaurant]);

  useEffect(() => {
    if (activeRestaurant?.id) {
      fetchAccessData(String(activeRestaurant.id));
    }
  }, [activeRestaurant?.id, fetchAccessData]);

  const currentOrgName = useMemo(() => {
    return activeRestaurant?.name || t('sidebar.orgSelector.current');
  }, [activeRestaurant, t]);

  const orgInitial = useMemo(() => {
    return currentOrgName ? currentOrgName[0].toUpperCase() : 'G';
  }, [currentOrgName]);

  const handleRestaurantSwitch = (res: any) => {
    setActiveRestaurant({
      ...res,
      id: Number(res.id)
    });
    setIsOrgDropdownOpen(false);
    router.refresh();
  };

  const handleDeleteRestaurantClick = (e: React.MouseEvent, res: any) => {
    e.preventDefault();
    e.stopPropagation();
    setRestaurantToDelete(res);
  };

  const handleConfirmDeleteRestaurant = async () => {
    if (!restaurantToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/restaurants/${restaurantToDelete.id}`);
      await fetchUser(true);
      
      const updatedRestaurants = useUserStore.getState().user?.restaurants || [];
      
      if (activeRestaurant?.id === restaurantToDelete.id) {
        if (updatedRestaurants.length > 0) {
          setActiveRestaurant({
            ...updatedRestaurants[0],
            id: Number(updatedRestaurants[0].id)
          });
        } else {
          setActiveRestaurant(undefined as any);
        }
      }
      
      setIsOrgDropdownOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t('auth.errors.defaultError'));
    } finally {
      setIsDeleting(false);
      setRestaurantToDelete(null);
    }
  };

  const handleLockedClick = (e: React.MouseEvent, moduleName: string, moduleKey: string) => {
    e.preventDefault();
    setLockedModule({ name: moduleName, key: moduleKey });
    setIsLockModalOpen(true);
  };

  const handleActivateLocked = () => {
    if (lockedModule) {
      toggleModule(lockedModule.key, true);
      setIsLockModalOpen(false);
    }
  };

  const toggleSubMenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    t,
    pathname,
    user,
    logout,
    activeRestaurant,
    restaurants,
    menuGroups,
    isOrgDropdownOpen,
    setIsOrgDropdownOpen,
    expandedMenus,
    isLockModalOpen,
    setIsLockModalOpen,
    lockedModule,
    restaurantToDelete,
    setRestaurantToDelete,
    isDeleting,
    orgInitial,
    currentOrgName,
    handleRestaurantSwitch,
    handleDeleteRestaurantClick,
    handleConfirmDeleteRestaurant,
    handleLockedClick,
    handleActivateLocked,
    toggleSubMenu,
    isPurchased,
    hasModule
  };
};