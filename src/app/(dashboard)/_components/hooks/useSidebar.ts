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
import type { SidebarRestaurant, SidebarUserProfile, RestaurantStoreState } from '../types/sidebar.types';

export const useSidebarLogic = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const user = useUserStore((state) => state.user) as SidebarUserProfile | null;
  const logout = useUserStore((state) => state.logout);
  const fetchUser = useUserStore((state) => state.fetchUser);

  const rawActiveRestaurant = useRestaurantStore((state) => state.activeRestaurant) as unknown as SidebarRestaurant | null;
  const setActiveRestaurant = useRestaurantStore((state) => state.setActiveRestaurant) as unknown as (restaurant: SidebarRestaurant | null) => void;

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
  const [lockedModule, setLockedModule] = useState<{ name: string; key: string } | null>(null);
  
  const [restaurantToDelete, setRestaurantToDelete] = useState<SidebarRestaurant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasMultiModule = activeModules.includes('multi-restaurant');
  const maxAllowed = hasMultiModule ? 3 : 1;

  const restaurants = useMemo<SidebarRestaurant[]>(() => {
    if (!user || !user.restaurants) return [];
    return user.restaurants.map((res: SidebarRestaurant) => ({
      id: res.id,
      name: res.name || res.title || '',
      slug: res.slug,
      imageUrl: res.imageUrl
    }));
  }, [user]);

  const activeRestaurant = useMemo<SidebarRestaurant | null>(() => {
    if (!rawActiveRestaurant) return null;
    const freshData = restaurants.find((r) => String(r.id) === String(rawActiveRestaurant.id));
    return freshData ? { ...rawActiveRestaurant, ...freshData } : rawActiveRestaurant;
  }, [rawActiveRestaurant, restaurants]);

  useEffect(() => {
    if (restaurants.length > 0 && !activeRestaurant) {
      setActiveRestaurant(restaurants[0]);
    }
  }, [restaurants, activeRestaurant, setActiveRestaurant]);

  useEffect(() => {
    if (activeRestaurant?.id) {
      fetchAccessData(String(activeRestaurant.id)).catch(() => {});
    }
  }, [activeRestaurant?.id, fetchAccessData]);

  const currentOrgName = useMemo(() => {
    return activeRestaurant?.name || t('sidebar.orgSelector.current');
  }, [activeRestaurant, t]);

  const orgInitial = useMemo(() => {
    return currentOrgName ? currentOrgName[0].toUpperCase() : 'G';
  }, [currentOrgName]);

  const handleRestaurantSwitch = (res: SidebarRestaurant, isLocked: boolean) => {
    if (isLocked) {
      toast.error(t('sidebar.locked.title'));
      setIsOrgDropdownOpen(false);
      router.push('/dashboard/marketplace');
      return;
    }
    setActiveRestaurant(res);
    setIsOrgDropdownOpen(false);
    router.refresh();
  };

  const handleDeleteRestaurantClick = (e: React.MouseEvent, res: SidebarRestaurant) => {
    e.preventDefault();
    e.stopPropagation();
    setRestaurantToDelete(res);
  };

  const handleConfirmDeleteRestaurant = async () => {
    if (!restaurantToDelete) return;
    setIsDeleting(true);
    
    const idToDelete = restaurantToDelete.id;
    const updatedRestaurants = restaurants.filter(r => String(r.id) !== String(idToDelete));
    
    if (activeRestaurant && String(activeRestaurant.id) === String(idToDelete)) {
      if (updatedRestaurants.length > 0) {
        setActiveRestaurant(updatedRestaurants[0]);
      } else {
        const store = useRestaurantStore.getState() as unknown as RestaurantStoreState;
        if (store.clearActiveRestaurant) {
          store.clearActiveRestaurant();
        } else {
          setActiveRestaurant(null);
        }
      }
    }

    try {
      await apiClient.delete(`/restaurants/${idToDelete}`);
      await fetchUser(true);
      setIsOrgDropdownOpen(false);
      router.refresh();
    } catch {
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
    maxAllowed,
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