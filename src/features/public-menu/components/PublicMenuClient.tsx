'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  PublicMenuDish,
  publicMenuApi,
} from '../api/publicMenu.api';

type PublicMenuClientProps = {
  restaurantSlug: string;
  tableId?: string;
};

const getDishPreview = (dish: PublicMenuDish) => {
  if (dish.images && dish.images.length > 0) {
    return dish.images[0]?.url;
  }

  return dish.imageUrl ?? null;
};

export const PublicMenuClient = ({
  restaurantSlug,
  tableId,
}: PublicMenuClientProps) => {
  const [cart, setCart] = useState<Record<string, number>>({});

  const hasTableId = Boolean(tableId);

  const { data: menuData, isLoading: isMenuLoading, isError: isMenuError } = useQuery({
    queryKey: ['public-menu', restaurantSlug],
    queryFn: () => publicMenuApi.getMenu(restaurantSlug),
    enabled: Boolean(restaurantSlug),
  });

  const resolvedRestaurantId = menuData?.restaurantId;

  const {
    data: tableExists,
    isLoading: isTableLoading,
    isError: isTableError,
  } = useQuery({
    queryKey: ['public-menu-table', resolvedRestaurantId, tableId],
    queryFn: () =>
      publicMenuApi.checkTableExists(resolvedRestaurantId as number, tableId as string),
    enabled: hasTableId && Boolean(resolvedRestaurantId),
  });

  const createOrderMutation = useMutation({
    mutationFn: () => {
      if (!tableId) {
        throw new Error('tableId is required');
      }

      if (!resolvedRestaurantId) {
        throw new Error('Restaurant was not resolved by slug');
      }

      return publicMenuApi.createOrder(resolvedRestaurantId, {
        tableId,
        type: 'DINE_IN',
        items: Object.entries(cart).map(([dishId, quantity]) => ({ dishId, quantity })),
      });
    },
    onSuccess: () => {
      setCart({});
      toast.success('Order placed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to place order');
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
    setCart((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] ?? 0) + 1,
    }));
  };

  const removeDish = (dishId: string) => {
    setCart((prev) => {
      const current = prev[dishId] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[dishId];
        return next;
      }

      return {
        ...prev,
        [dishId]: current - 1,
      };
    });
  };

  if (isMenuLoading) {
    return <div className="p-6 text-sm text-brand-gray">Loading menu...</div>;
  }

  if (isMenuError || !menuData) {
    return <div className="p-6 text-sm text-red-600">Menu is unavailable</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f9f4ed] to-[#f2ece3] text-brand-espresso">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 rounded-2xl border border-brand-copper/20 bg-white/80 p-4 shadow-sm backdrop-blur md:p-5">
          <h1 className="text-xl font-bold md:text-2xl">Restaurant Menu</h1>
          <p className="mt-1 text-sm text-brand-gray">Choose dishes and place an order from your table.</p>

          {hasTableId && isTableLoading && (
            <p className="mt-3 text-xs text-brand-gray">Checking table...</p>
          )}

          {hasTableId && isTableError && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              Table validation failed. Ordering is unavailable right now.
            </p>
          )}

          {hasTableId && tableExists === false && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              Table was not found. Ordering is disabled.
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {menuData.categories.map((category) => (
              <section key={category.id} className="space-y-3">
                <h2 className="text-lg font-bold md:text-xl">{category.name}</h2>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {category.dishes.map((dish) => {
                    const dishImage = getDishPreview(dish);
                    const dishQty = cart[dish.id] ?? 0;

                    return (
                      <article key={dish.id} className="overflow-hidden rounded-2xl border border-brand-gray/20 bg-white shadow-sm">
                        <div className="relative h-36 w-full bg-brand-cream/40">
                          {dishImage ? (
                            <Image
                              src={dishImage}
                              alt={dish.name}
                              fill
                              unoptimized
                              sizes="(max-width: 768px) 100vw, 320px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-brand-gray">
                              No photo
                            </div>
                          )}
                        </div>

                        <div className="flex h-40 flex-col p-3">
                          <h3 className="line-clamp-1 text-sm font-bold">{dish.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-brand-gray">
                            {dish.description || 'No description'}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="text-base font-bold text-brand-copper">{dish.price} UAH</span>
                            {canUseCart ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => removeDish(dish.id)}
                                  className="h-7 w-7 rounded-full border border-brand-gray/30 text-sm"
                                  disabled={dishQty === 0}
                                >
                                  -
                                </button>
                                <span className="w-5 text-center text-sm font-semibold">{dishQty}</span>
                                <button
                                  type="button"
                                  onClick={() => addDish(dish.id)}
                                  className="h-7 w-7 rounded-full bg-brand-copper text-sm font-bold text-white"
                                >
                                  +
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {canUseCart ? (
            <aside className="h-fit rounded-2xl border border-brand-copper/20 bg-white p-4 shadow-sm lg:sticky lg:top-4">
              <h3 className="text-base font-bold">Cart</h3>

              {totalItems === 0 ? (
                <p className="mt-4 text-sm text-brand-gray">Cart is empty</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {Object.entries(cart).map(([dishId, quantity]) => {
                    const dish = dishesById[dishId];
                    if (!dish) return null;

                    return (
                      <div key={dishId} className="flex items-center justify-between rounded-lg border border-brand-gray/10 px-2 py-2 text-sm">
                        <span className="line-clamp-1 pr-2">{dish.name}</span>
                        <span className="font-semibold">x{quantity}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 border-t border-brand-gray/10 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Total</span>
                  <span className="font-bold">{totalAmount} UAH</span>
                </div>
                <button
                  type="button"
                  onClick={() => createOrderMutation.mutate()}
                  disabled={totalItems === 0 || createOrderMutation.isPending}
                  className="mt-3 w-full rounded-xl bg-brand-copper px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createOrderMutation.isPending ? 'Placing order...' : 'Place order'}
                </button>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
};
