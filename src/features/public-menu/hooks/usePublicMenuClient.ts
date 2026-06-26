'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';
import { publicMenuApi } from '../api/publicMenu.api';
import {
  PublicMenuDish,
  PublicOrderSummary,
  UsePublicMenuClientReturn,
} from '../types/publicMenu.types';

export const usePublicMenuClient = (
  restaurantSlug: string,
  tableId?: string,
  orderId?: string,
): UsePublicMenuClientReturn => {
  const { t } = useTranslation();
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [lastOrderSnapshot, setLastOrderSnapshot] = useState<PublicOrderSummary | null>(null);
  const hasTableId = Boolean(tableId);
  const activeOrderStorageKey = orderId ? `public-active-order:${orderId}` : '';

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
    return tableExistsData?.exists === true;
  }, [tableExistsData]);

  const { data: activeOrderResponse } = useQuery({
    queryKey: ['public-order', resolvedRestaurantId, tableId, orderId],
    queryFn: () =>
      publicMenuApi.getOrderById(
        resolvedRestaurantId as number,
        tableId as string,
        orderId as string,
      ),
    enabled:
      Boolean(orderId) &&
      hasTableId &&
      Boolean(resolvedRestaurantId) &&
      tableExists === true,
  });

  const createOrderMutation = useMutation({
    mutationFn: () => {
      if (!tableId) throw new Error('tableId is required');
      if (!resolvedRestaurantId) throw new Error('Restaurant was not resolved');

      const items = Object.entries(cart).map(([dishId, quantity]) => ({
        dishId,
        quantity,
      }));

      if (orderId) {
        return publicMenuApi.appendItemsToOrder(resolvedRestaurantId, orderId, {
          items,
        });
      }

      return publicMenuApi.createOrder(resolvedRestaurantId, {
        tableId,
        type: 'DINE_IN',
        items,
      });
    },
    onSuccess: (response) => {
      setCart({});
      toast.success(t('menu.public.orderSuccessNotification') || 'Замовлення надіслано!');

      const createdOrder = response?.order;
      const createdOrderId = createdOrder?.id;

      if (!createdOrderId) {
        return;
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          `public-active-order:${createdOrderId}`,
          JSON.stringify(createdOrder),
        );
      }

      setLastOrderSnapshot(createdOrder);

      if (!orderId && tableId) {
        router.push(`/menu/${restaurantSlug}/${tableId}/${createdOrderId}`);
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : t('errors.unknown');
      toast.error(errorMessage);
    },
  });

  const callWaiterMutation = useMutation({
    mutationFn: () => {
      if (!tableId) throw new Error('tableId is required');
      if (!resolvedRestaurantId) throw new Error('Restaurant was not resolved');

      return publicMenuApi.callWaiter(resolvedRestaurantId, tableId);
    },
    onSuccess: () => {
      toast.success(t('menu.public.waiterCallSuccess') || 'Офіціанта викликано');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : t('errors.unknown');
      toast.error(errorMessage);
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

  const activeOrder = useMemo(() => {
    if (activeOrderResponse?.order) {
      return activeOrderResponse.order;
    }

    if (lastOrderSnapshot && lastOrderSnapshot.id === orderId) {
      return lastOrderSnapshot;
    }

    if (!activeOrderStorageKey || typeof window === 'undefined') {
      return null;
    }

    const storedOrderJson = window.sessionStorage.getItem(activeOrderStorageKey);
    if (!storedOrderJson) {
      return null;
    }

    try {
      return JSON.parse(storedOrderJson);
    } catch {
      return null;
    }
  }, [activeOrderResponse, activeOrderStorageKey, lastOrderSnapshot, orderId]);

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
    activeOrder,
    activeOrderId: orderId,
    addDish,
    removeDish,
    placeOrder: () => createOrderMutation.mutate(),
    isPlacingOrder: createOrderMutation.isPending,
    callWaiter: () => callWaiterMutation.mutate(),
    isCallingWaiter: callWaiterMutation.isPending,
  };
};