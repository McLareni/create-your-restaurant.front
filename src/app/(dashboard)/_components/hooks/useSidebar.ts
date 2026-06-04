'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
// 🔄 ВИПРАВЛЕНО: Імпортуємо інтерфейс RestaurantSummary для ліквідації всіх "any"
import { useUserStore, RestaurantSummary } from '@/shared/store/useUserStore';
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
  // 💡 ВИПРАВЛЕНО: Дістаємо метод очищення ресторану, щоб замінити брудний "undefined as any"
  const clearActiveRestaurant = useRestaurantStore((state) => state.clearActiveRestaurant);
  
  const activeModules = useAccessStore((state) => state.activeModules);
  const purchasedModules = useAccessStore((state) => state.purchasedModules);
  const toggleModule = useAccessStore((state) => state.toggleModule);
  const fetchAccessData = useAccessStore((state) => state.fetchAccessData);
  const clearAccessData = useAccessStore((state) => state.clearAccessData);

  const hasModule = (moduleKey: string) => activeModules.includes(moduleKey);
  const isPurchased = (moduleKey: string) => purchasedModules.includes(moduleKey);
  const { menuGroups } = useNavigation();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockedModule, setLockedModule] = useState<{ name: string; key: string; } | null>(null);
  
  // 🔄 ВИПРАВЛЕНО: Замінено any на строгий тип RestaurantSummary
  const [restaurantToDelete, setRestaurantToDelete] = useState<RestaurantSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔄 ВИПРАВЛЕНО: Загортаємо масив у useMemo, щоб посилання не змінювалось при кожному рендері.
  // Це повністю вирішує проблему з попередженням лінтера react-hooks/exhaustive-deps.
  const restaurants = useMemo(() => user?.restaurants || [], [user?.restaurants]);

  useEffect(() => {
    if (restaurants.length > 0 && !activeRestaurant) {
      setActiveRestaurant({
        ...restaurants[0],
        id: Number(restaurants[0].id),
      });
    }
  }, [restaurants, activeRestaurant, setActiveRestaurant]);

  useEffect(() => {
    if (!activeRestaurant?.id) {
      clearAccessData();
      return;
    }
    fetchAccessData(String(activeRestaurant.id)).catch(() => {});
  }, [activeRestaurant?.id, fetchAccessData, clearAccessData]);

  const currentOrgName = useMemo(() => {
    return activeRestaurant?.name || t('sidebar.orgSelector.current');
  }, [activeRestaurant, t]);

  const orgInitial = useMemo(() => {
    return currentOrgName ? currentOrgName[0].toUpperCase() : 'G';
  }, [currentOrgName]);

  // 🔄 ВИПРАВЛЕНО: Замінено type any на RestaurantSummary
  const handleRestaurantSwitch = (res: RestaurantSummary) => {
    clearAccessData();
    setActiveRestaurant({
      ...res,
      id: Number(res.id),
    });
    setIsOrgDropdownOpen(false);
  };

  // 🔄 ВИПРАВЛЕНО: Замінено type any на RestaurantSummary
  const handleDeleteRestaurantClick = (e: React.MouseEvent, res: RestaurantSummary) => {
    e.preventDefault();
    e.stopPropagation();
    setRestaurantToDelete(res);
  };

  const handleConfirmDeleteRestaurant = async () => {
    if (!restaurantToDelete) return;
    setIsDeleting(true);
    try {
      const idToDelete = Number(restaurantToDelete.id);
      const updatedRestaurants = restaurants.filter((r) => Number(r.id) !== idToDelete);
      
      await apiClient.delete(`/restaurants/${idToDelete}`);
      
      if (Number(activeRestaurant?.id) === idToDelete) {
        clearAccessData();
        if (updatedRestaurants.length > 0) {
          setActiveRestaurant({
            ...updatedRestaurants[0],
            id: Number(updatedRestaurants[0].id),
          });
        } else {
          // 🔄 ВИПРАВЛЕНО: Замість брудного та небезпечного "undefined as any" викликаємо штатний метод очищення
          clearActiveRestaurant();
        }
      }

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

  const handleActivateLocked = async () => {
    if (!lockedModule) return;
    try {
      await toggleModule(lockedModule.key, true);
      setIsLockModalOpen(false);
    } catch {
      toast.error(t('auth.errors.defaultError'));
    }
  };

  const toggleSubMenu = (id: string) => {
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }));
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
    hasModule,
  };
};