'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';
import { publicMenuApi } from '../api/publicMenu.api';
import { PublicMenuDish, PublicOrderSummary, UsePublicMenuClientReturn } from '../types/publicMenu.types';

export const usePublicMenuClient = (
  restaurantSlug: string,
  tableId?: string,
  orderId?: string,
): UsePublicMenuClientReturn => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const currency = menuData?.currency ?? null;

  const { data: tableExistsData, isLoading: isTableLoading, isError: isTableError } = useQuery({
    queryKey: ['public-menu-table', resolvedRestaurantId, tableId],
    queryFn: () => publicMenuApi.checkTableExists(resolvedRestaurantId as number, tableId as string),
    enabled: hasTableId && Boolean(resolvedRestaurantId),
  });

  const tableExists = useMemo(() => tableExistsData?.exists === true, [tableExistsData]);

  const { data: activeOrderResponse, isError: isActiveOrderError } = useQuery({
    queryKey: ['public-order', resolvedRestaurantId, tableId, orderId],
    queryFn: () => publicMenuApi.getOrderById(resolvedRestaurantId as number, tableId as string, orderId as string),
    enabled: Boolean(orderId) && hasTableId && Boolean(resolvedRestaurantId) && tableExists,
    refetchInterval: (query) => {
      const status = (query.state.data as any)?.order?.status;
      if (status === 'COMPLETED' || status === 'PAID' || status === 'CANCELED' || status === 'REJECTED') {
        return false;
      }
      return 5000;
    },
  });

  useEffect(() => {
    if (!orderId || !isActiveOrderError) return;
    if (typeof window !== 'undefined' && activeOrderStorageKey) {
      window.sessionStorage.removeItem(activeOrderStorageKey);
    }
    router.replace(`/menu/${encodeURIComponent(restaurantSlug)}/${encodeURIComponent(tableId || '')}`);
  }, [activeOrderStorageKey, isActiveOrderError, orderId, restaurantSlug, router, tableId]);

  const createOrderMutation = useMutation({
    mutationFn: () => {
      if (!tableId) throw new Error('tableId is required');
      if (!resolvedRestaurantId) throw new Error('Restaurant was not resolved');
      const items = Object.entries(cart).map(([dishId, quantity]) => ({ dishId, quantity }));
      if (orderId) {
        return publicMenuApi.appendItemsToOrder(resolvedRestaurantId, orderId, { items });
      }
      return publicMenuApi.createOrder(resolvedRestaurantId, { tableId, type: 'DINE_IN', items });
    },
    onSuccess: (response) => {
      setCart({});
      toast.success(t('menu.public.orderSuccessNotification'));
      const createdOrder = response?.order;
      if (!createdOrder?.id) return;
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(`public-active-order:${createdOrder.id}`, JSON.stringify(createdOrder));
      }
      setLastOrderSnapshot(createdOrder);
      if (!orderId && tableId) {
        router.push(`/menu/${restaurantSlug}/${tableId}/${createdOrder.id}`);
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string }, status?: number }, message?: string };
      const errorMessage = err?.response?.data?.message || err?.message || t('errors.unknown');
      if (
        errorMessage === 'errors.order_closed' || 
        err?.response?.status === 400 || 
        err?.response?.status === 404
      ) {
        if (typeof window !== 'undefined' && activeOrderStorageKey) {
          window.sessionStorage.removeItem(activeOrderStorageKey);
        }
        setLastOrderSnapshot(null);
        toast.error(t('menu.errors.orderClosedAction'));
        // Reload page to clear URL orderId and start fresh
        if (hasTableId) {
          router.replace(`/menu/${restaurantSlug}/${tableId}`);
        }
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const callWaiterMutation = useMutation({
    mutationFn: ({ type, paymentMethod }: { type: string; paymentMethod?: 'CASH' | 'CARD' }) => {
      if (!tableId) throw new Error('tableId is required');
      if (!resolvedRestaurantId) throw new Error('Restaurant was not resolved');
      return publicMenuApi.callWaiter(resolvedRestaurantId, tableId, type, paymentMethod);
    },
    onSuccess: (_, variables) => {
      if (variables.type === 'BILL') {
        toast.success(t('menu.public.billRequested'));
      } else {
        toast.success(t('menu.public.waiterCallSuccess'));
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : t('errors.unknown');
      toast.error(errorMessage);
    },
  });

  const payOrderMutation = useMutation({
    mutationFn: () => {
      if (!tableId || !orderId) throw new Error('orderId and tableId are required');
      if (!resolvedRestaurantId) throw new Error('Restaurant was not resolved');
      return publicMenuApi.payOrder(resolvedRestaurantId, tableId, orderId);
    },
    onSuccess: (response) => {
      setLastOrderSnapshot(response.order);
      if (activeOrderStorageKey && typeof window !== 'undefined') {
        window.sessionStorage.setItem(activeOrderStorageKey, JSON.stringify(response.order));
      }
      void queryClient.invalidateQueries({
        queryKey: ['public-order', resolvedRestaurantId, tableId, orderId],
      });
      toast.success(t('menu.public.paymentSuccess'));
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : t('errors.unknown'));
    },
  });

  const canUseCart = hasTableId && tableExists;
  const totalItems = useMemo(() => Object.values(cart).reduce((sum, value) => sum + value, 0), [cart]);

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
    if (activeOrderResponse?.order) return activeOrderResponse.order;
    if (lastOrderSnapshot && lastOrderSnapshot.id === orderId) return lastOrderSnapshot;
    if (!activeOrderStorageKey || typeof window === 'undefined') return null;
    const storedOrderJson = window.sessionStorage.getItem(activeOrderStorageKey);
    if (!storedOrderJson) return null;
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
    currency,
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
    callWaiter: (type?: string, paymentMethod?: 'CASH' | 'CARD') => callWaiterMutation.mutate({ type: type || 'WAITER', paymentMethod }),
    isCallingWaiter: callWaiterMutation.isPending,
    payOrder: () => payOrderMutation.mutate(),
    isPayingOrder: payOrderMutation.isPending,
  };
};