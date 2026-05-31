'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';
import { publicMenuApi } from '../api/publicMenu.api';
import { PublicMenuDish, UsePublicMenuClientReturn } from '../types/publicMenu.types';

export const usePublicMenuClient = (restaurantSlug: string, tableId?: string): UsePublicMenuClientReturn => {
  const { t } = useTranslation();
  const [cart, setCart] = useState<Record<string, number>>({});
  const hasTableId = Boolean(tableId);

  const { data: menuData, isLoading: isMenuLoading, isError: isMenuError } = useQuery({
    queryKey: ['public-menu', restaurantSlug],
    queryFn: () => publicMenuApi.getMenu(restaurantSlug),
    enabled: Boolean(restaurantSlug),
  });

  const resolvedRestaurantId = menuData?.restaurantId;

  const { data: tableExistsData, isLoading: isTableLoading, isError: isTableError } = useQuery({
    queryKey: ['public-menu-table', resolvedRestaurantId, tableId],
    queryFn: () => publicMenuApi.checkTableExists(resolvedRestaurantId as number, tableId as string),
    enabled: hasTableId && Boolean(resolvedRestaurantId),
  });

  const tableExists = useMemo(() => {
    if (!tableExistsData) return false;
    if (typeof tableExistsData === 'boolean') return tableExistsData;
    return (tableExistsData as any).exists === true;
  }, [tableExistsData]);

  const createOrderMutation = useMutation({
    mutationFn: () => {
      if (!tableId) throw new Error('tableId is required');
      if (!resolvedRestaurantId) throw new Error('Restaurant was not resolved');
      return publicMenuApi.createOrder(resolvedRestaurantId, {
        tableId,
        type: 'DINE_IN',
        items: Object.entries(cart).map(([dishId, quantity]) => ({ dishId, quantity })),
      });
    },
    onSuccess: () => {
      setCart({});
      toast.success(t('menu.public.orderSuccessNotification' as any) || 'Замовлення надіслано!');
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message || error?.message || t('errors.unknown');
      toast.error(apiErrorMessage);
    },
  });

  const canUseCart = hasTableId && tableExists === true;

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, value) => sum + value, 0),
    [cart],
  );

  const dishesById = useMemo(() => {
    const source = menuData?.categories ?? [];
    return source
      .flatMap((category) => category.dishes)
      .reduce<Record<string, PublicMenuDish>>((acc, dish) => {
        acc[dish.id] = dish;
        return acc;
      }, {});
  }, [menuData]);

  const totalAmount = useMemo(() => {
    return Object.entries(cart).reduce((sum, [dishId, quantity]) => {
      const dish = dishesById[dishId];
      if (!dish) return sum;
      return sum + dish.price * quantity;
    }, 0);
  }, [cart, dishesById]);

  const addDish = (dishId: string) => {
    if (createOrderMutation.isPending) return;
    setCart((prev) => ({ ...prev, [dishId]: (prev[dishId] ?? 0) + 1 }));
  };

  const removeDish = (dishId: string) => {
    if (createOrderMutation.isPending) return;
    setCart((prev) => {
      const current = prev[dishId] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[dishId];
        return next;
      }
      return { ...prev, [dishId]: current - 1 };
    });
  };

  return {
    menuData,
    isMenuLoading,
    isMenuError,
    isTableLoading,
    isTableError,
    tableExists,
    hasTableId,
    canUseCart,
    cart,
    totalItems,
    totalAmount,
    dishesById,
    addDish,
    removeDish,
    placeOrder: () => createOrderMutation.mutate(),
    isPlacingOrder: createOrderMutation.isPending,
  };
};