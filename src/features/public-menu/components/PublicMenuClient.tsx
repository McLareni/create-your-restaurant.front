'use client';

import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { usePublicMenuClient } from '../hooks/usePublicMenuClient';
import { PublicMenuDish } from '../api/publicMenu.api';

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

export const PublicMenuClient = ({ restaurantSlug, tableId }: PublicMenuClientProps) => {
  const { t } = useTranslation();
  const {
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
    placeOrder,
    isPlacingOrder,
  } = usePublicMenuClient(restaurantSlug, tableId);

  if (isMenuLoading) {
    return (
      <div className="mx-auto max-w-6xl bg-brand-cream px-4 py-6 md:px-6 md:py-8 space-y-6 animate-pulse">
        <div className="h-32 bg-white rounded-2xl border border-brand-gray/10" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="h-6 w-48 bg-brand-gray/20 rounded" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-white rounded-2xl border border-brand-gray/10" />
              ))}
            </div>
          </div>
          <div className="h-64 bg-white rounded-2xl border border-brand-gray/10" />
        </div>
      </div>
    );
  }

  if (isMenuError || !menuData) {
    return <div className="p-6 text-sm text-red-600">{t('menu.errors.unavailable')}</div>;
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-espresso">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 rounded-2xl border border-brand-copper/20 bg-white/80 p-4 shadow-sm backdrop-blur md:p-5">
          <h1 className="text-xl font-bold md:text-2xl">{t('menu.public.title')}</h1>
          <p className="mt-1 text-sm text-brand-gray">{t('menu.public.subtitle')}</p>

          {hasTableId && isTableLoading && (
            <p className="mt-3 text-xs text-brand-gray">{t('menu.public.checkingTable')}</p>
          )}

          {hasTableId && isTableError && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {t('menu.errors.tableValidationFailed')}
            </p>
          )}

          {hasTableId && tableExists === false && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {t('menu.errors.tableNotFound')}
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
                              {t('menu.public.noPhoto')}
                            </div>
                          )}
                        </div>

                        <div className="flex h-40 flex-col p-3">
                          <h3 className="line-clamp-1 text-sm font-bold">{dish.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-brand-gray">
                            {dish.description || t('menu.public.noDescription')}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="text-base font-bold text-brand-copper">
                              {dish.price} {t('menu.currency')}
                            </span>
                            {canUseCart ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => removeDish(dish.id)}
                                  className="h-7 w-7 rounded-full border border-brand-gray/30 text-sm disabled:opacity-40"
                                  disabled={dishQty === 0 || isPlacingOrder}
                                >
                                  -
                                </button>
                                <span className="w-5 text-center text-sm font-semibold">{dishQty}</span>
                                <button
                                  type="button"
                                  onClick={() => addDish(dish.id)}
                                  className="h-7 w-7 rounded-full bg-brand-copper text-sm font-bold text-white disabled:opacity-40"
                                  disabled={isPlacingOrder}
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
              <h3 className="text-base font-bold">{t('menu.public.cart')}</h3>

              {totalItems === 0 ? (
                <p className="mt-4 text-sm text-brand-gray">{t('menu.public.cartEmpty')}</p>
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
                  <span>{t('menu.public.total')}</span>
                  <span className="font-bold">{totalAmount} {t('menu.currency')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => placeOrder()}
                  disabled={totalItems === 0 || isPlacingOrder}
                  className="mt-3 w-full rounded-xl bg-brand-copper px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlacingOrder ? t('menu.public.placing') : t('menu.public.submitOrder')}
                </button>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
};