'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { MouseEvent, DragEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { apiClient } from '@/shared/api/client';
import { getSidebarCookie, setSidebarCookie } from '@/shared/utils/cookies';
import { useSidebarNavigation } from '@/widgets/sidebar/hooks/useSidebarNavigation';
import toast from 'react-hot-toast';
import type { SidebarRestaurant } from '@/widgets/sidebar/types/sidebar.types';
import type { User } from '@/shared/store/useUserStore';

type ExtendedUser = User & {
  restaurants?: SidebarRestaurant[];
};

export const useSidebarLogic = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const user = useUserStore((state) => state.user) as ExtendedUser | null;
  const logout = useUserStore((state) => state.logout);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const setUser = useUserStore((state) => state.setUser);

  const rawActiveRestaurant = useRestaurantStore((state) => state.activeRestaurant) as unknown as SidebarRestaurant | null;
  const setActiveRestaurant = useRestaurantStore((state) => state.setActiveRestaurant) as unknown as (restaurant: SidebarRestaurant | null) => void;
  const activeModules = useAccessStore((state) => state.activeModules);
  const purchasedModules = useAccessStore((state) => state.purchasedModules);
  const permissions = useAccessStore((state) => state.permissions);
  const fetchAccessData = useAccessStore((state) => state.fetchAccessData);
  const isLoadingAccess = useAccessStore((state) => state.isLoadingAccess);

  const hasModule = (moduleKey: string) => activeModules.includes(moduleKey);
  const isPurchased = (moduleKey: string) => purchasedModules.includes(moduleKey);

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockedModule, setLockedModule] = useState<{ name: string; key: string } | null>(null);
  const [restaurantToDelete, setRestaurantToDelete] = useState<SidebarRestaurant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const hasMultiActive = activeModules.includes('multi-restaurant');
  const isAccessUninitialized = purchasedModules.length === 0;
  const maxAllowed = hasMultiActive || isLoadingAccess || isAccessUninitialized ? 3 : 1;

  const restaurants = useMemo<SidebarRestaurant[]>(() => {
    if (!user || !user.restaurants) return [];
    return user.restaurants.map((res: SidebarRestaurant) => ({
      id: res.id,
      name: res.name || ('title' in res ? (res as { title?: string }).title : '') || '',
      slug: res.slug || '',
      imageUrl: res.imageUrl || null,
      currency: res.currency ?? null,
    }));
  }, [user]);

  const activeRestaurant = useMemo<SidebarRestaurant | null>(() => {
    if (!rawActiveRestaurant) return null;
    const freshData = restaurants.find((r) => String(r.id) === String(rawActiveRestaurant.id));
    return freshData ? { ...rawActiveRestaurant, ...freshData } : rawActiveRestaurant;
  }, [rawActiveRestaurant, restaurants]);

  useEffect(() => {
    if (restaurants.length > 0) {
      const savedId = getSidebarCookie('gustio_active_restaurant_id');
      const activeIndex = restaurants.findIndex((r) => String(r.id) === String(savedId));

      if (activeIndex !== -1) {
        if (activeIndex >= maxAllowed && !isLoadingAccess && !isAccessUninitialized) {
          setActiveRestaurant(restaurants[0]);
          setSidebarCookie('gustio_active_restaurant_id', String(restaurants[0].id));
          router.refresh();
          return;
        }

        const matched = restaurants[activeIndex];
        if (!activeRestaurant || String(activeRestaurant.id) !== String(matched.id)) {
          setActiveRestaurant(matched);
        }
        return;
      }

      if (!activeRestaurant) {
        setActiveRestaurant(restaurants[0]);
        setSidebarCookie('gustio_active_restaurant_id', String(restaurants[0].id));
      }
    }
  }, [restaurants, activeRestaurant, setActiveRestaurant, maxAllowed, router, isLoadingAccess, isAccessUninitialized]);

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

  const handleRestaurantSwitch = (e: MouseEvent, res: SidebarRestaurant, isLocked: boolean) => {
    if (isLocked) {
      e.preventDefault();
      setLockedModule({
        name: t('marketplace.modules.multi-restaurant.title'),
        key: 'multi-restaurant',
      });
      setIsLockModalOpen(true);
      setIsOrgDropdownOpen(false);
      return;
    }
    setSidebarCookie('gustio_active_restaurant_id', String(res.id));
    setActiveRestaurant(res);
    setIsOrgDropdownOpen(false);
    router.refresh();
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
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
      await apiClient.patch('/restaurants/reorder', { ids: idsOrder });
      
      const currentActiveStillAllowed = reordered
        .slice(0, maxAllowed)
        .some((r) => String(r.id) === String(activeRestaurant?.id));
        
      if (!currentActiveStillAllowed && reordered.length > 0) {
        setActiveRestaurant(reordered[0]);
        setSidebarCookie('gustio_active_restaurant_id', String(reordered[0].id));
        router.refresh();
      }
    } catch {
      toast.error(t('auth.errors.defaultError'));
      await fetchUser(true);
    }
  };

  const handleDeleteRestaurantClick = (e: MouseEvent, res: SidebarRestaurant) => {
    e.preventDefault();
    e.stopPropagation();
    setRestaurantToDelete(res);
  };

  const handleConfirmDeleteRestaurant = async () => {
    if (!restaurantToDelete) return;
    setIsDeleting(true);

    const idToDelete = restaurantToDelete.id;
    const previousActiveRestaurant = rawActiveRestaurant;
    const updatedRestaurants = restaurants.filter((r) => String(r.id) !== String(idToDelete));

    if (activeRestaurant && String(activeRestaurant.id) === String(idToDelete)) {
      if (updatedRestaurants.length > 0) {
        setActiveRestaurant(updatedRestaurants[0]);
        setSidebarCookie('gustio_active_restaurant_id', String(updatedRestaurants[0].id));
      } else {
        setActiveRestaurant(null);
        document.cookie = 'gustio_active_restaurant_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }

    try {
      await apiClient.delete(`/restaurants/${idToDelete}`);
      await fetchUser(true);
      setIsOrgDropdownOpen(false);
      router.refresh();
    } catch {
      if (previousActiveRestaurant) {
        setActiveRestaurant(previousActiveRestaurant);
        setSidebarCookie('gustio_active_restaurant_id', String(previousActiveRestaurant.id));
      } else {
        setActiveRestaurant(null);
      }
      toast.error(t('auth.errors.defaultError'));
    } finally {
      setIsDeleting(false);
      setRestaurantToDelete(null);
    }
  };

  const triggerLockModal = useCallback((moduleName: string, moduleKey: string) => {
    setLockedModule({ name: moduleName, key: moduleKey });
    setIsLockModalOpen(true);
  }, []);

  const handleLockedClick = (e: MouseEvent, moduleName: string, moduleKey: string) => {
    e.preventDefault();
    triggerLockModal(moduleName, moduleKey);
  };

  const handleActivateLocked = () => {
    setIsLockModalOpen(false);
    router.push('/dashboard/marketplace');
  };

  const toggleSubMenu = (id: string) => {
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { menuGroups } = useSidebarNavigation({
    purchasedModules,
    activeModules,
    permissions,
    pathname,
    onLockClick: triggerLockModal,
  });

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
    isPending: false,
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
    hasModule,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};