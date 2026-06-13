'use client';

import { useMemo, useState } from 'react';
import { BellRing } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { publicMenuApi } from '../api/publicMenu.api';
import { usePublicMenuClient } from '../hooks/usePublicMenuClient';
import { PublicMenuClientProps, PublicMenuDish } from '../types/publicMenu.types';
import { PublicMenuHeader } from './PublicMenuHeader';
import { PublicMenuDishSections } from './PublicMenuDishSections';
import { PublicMenuDishDetailsModal } from './PublicMenuDishDetailsModal';

const ALL_DISHES_TAB_ID = 'all-dishes';

export const PublicMenuClient = ({ restaurantSlug, tableId, orderId }: PublicMenuClientProps) => {
  const { t } = useTranslation();
  const router = useRouter();
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
    activeOrder,
    activeOrderId,
    addDish,
    removeDish,
    placeOrder,
    isPlacingOrder,
    callWaiter,
    isCallingWaiter,
  } = usePublicMenuClient(restaurantSlug, tableId, orderId);

  const categories = useMemo(
    () => (menuData?.categories ?? []).filter((category) => category.dishes.length > 0),
    [menuData?.categories],
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<PublicMenuDish | null>(null);
  const [isOrderLookupLoading, setIsOrderLookupLoading] = useState(false);

  const activeCategory = useMemo(() => {
    if (!categories.length) return null;
    if (activeCategoryId === ALL_DISHES_TAB_ID) return null;
    if (activeCategoryId) {
      const selectedCategory = categories.find((category) => category.id === activeCategoryId);
      if (selectedCategory) return selectedCategory;
    }
    return null;
  }, [categories, activeCategoryId]);

  const isAllDishesTabActive = activeCategory === null;
  const activeTabId = activeCategory?.id ?? ALL_DISHES_TAB_ID;
  const resolvedRestaurantId = menuData?.restaurantId;
  const restaurantName = (menuData?.restaurantName?.trim() || restaurantSlug)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const openDishDetails = (dish: PublicMenuDish) => {
    setSelectedDish(dish);
  };

  const closeDishDetails = () => {
    setSelectedDish(null);
  };

  const handleGoToOrder = async (rawOrderNumber: string) => {
    if (!resolvedRestaurantId || !tableId) {
      return;
    }

    const normalizedInput = rawOrderNumber.trim().replace(/^#/, '');
    if (!normalizedInput) {
      return;
    }

    setIsOrderLookupLoading(true);

    try {
      const lookupResponse = await publicMenuApi.findOrderByCode(
        resolvedRestaurantId,
        tableId,
        normalizedInput,
      );

      router.push(
        `/menu/${encodeURIComponent(restaurantSlug)}/${encodeURIComponent(tableId)}/${encodeURIComponent(lookupResponse.orderId)}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      if (message === 'Order not found') {
        toast.error(t('menu.public.orderNotFound'));
      } else if (message === 'Order code is ambiguous') {
        toast.error(t('menu.public.orderCodeAmbiguous'));
      } else {
        toast.error(t('menu.public.orderLookupFailed'));
      }
    } finally {
      setIsOrderLookupLoading(false);
    }
  };

  if (isMenuLoading) {
    return (
      <div className="min-h-screen animate-pulse bg-brand-cream text-brand-espresso">
        <div className="sticky top-0 z-30 bg-brand-cream/95 backdrop-blur">
          <header className="w-full bg-white/90 px-4 py-4 md:px-6 md:py-5">
            <div className="h-10 w-64 rounded bg-brand-gray/20" />
          </header>

          <div className="w-full px-4 md:px-6">
            <div className="flex gap-0 overflow-x-auto md:justify-center">
              {[1, 2, 3, 4].map((tab) => (
                <div
                  key={tab}
                  className="h-10 w-28 shrink-0 border border-brand-gray/20 bg-white"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
          <div className={hasTableId ? 'grid gap-6 lg:grid-cols-[1fr_320px]' : 'grid gap-6'}>
            <div className="space-y-6">
              <div className="h-7 w-40 rounded bg-brand-gray/20" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((card) => (
                  <div
                    key={card}
                    className="h-72 rounded-2xl border border-brand-gray/10 bg-white"
                  />
                ))}
              </div>
            </div>

            {hasTableId ? (
              <aside className="h-64 rounded-2xl border border-brand-gray/10 bg-white" />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (isMenuError || !menuData) {
    return <div className="p-6 text-sm text-red-600">{t('menu.errors.unavailable')}</div>;
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-espresso">
      <PublicMenuHeader
        restaurantName={restaurantName}
        categories={categories}
        activeTabId={activeTabId}
        allDishesTabId={ALL_DISHES_TAB_ID}
        onSelectTab={setActiveCategoryId}
        showOrderLookup={hasTableId}
        onGoToOrder={handleGoToOrder}
        isOrderLookupLoading={isOrderLookupLoading}
      />

      <div className="mx-auto max-w-6xl px-4 py-2 md:px-6 md:py-4">
        {hasTableId && isTableLoading && (
          <p className="mb-4 text-xs text-brand-gray">{t('menu.public.checkingTable')}</p>
        )}

        {hasTableId && isTableError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {t('menu.errors.tableValidationFailed')}
          </p>
        )}

        {hasTableId && !isTableLoading && !isTableError && tableExists === false && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {t('menu.errors.tableNotFound')}
          </p>
        )}

        <div className={canUseCart ? 'grid gap-6 lg:grid-cols-[1fr_320px]' : 'grid gap-6'}>
          <div className={canUseCart ? 'space-y-8' : 'mx-auto w-full max-w-5xl space-y-8'}>
            <PublicMenuDishSections
              categories={categories}
              activeCategory={activeCategory}
              isAllDishesTabActive={isAllDishesTabActive}
              activeTabId={activeTabId}
              canUseCart={canUseCart}
              cart={cart}
              isPlacingOrder={isPlacingOrder}
              onAddDish={addDish}
              onRemoveDish={removeDish}
              onOpenDetails={openDishDetails}
            />
          </div>

          {canUseCart ? (
            <aside className="h-fit rounded-2xl border border-brand-copper/20 bg-white p-4 shadow-sm lg:sticky lg:top-4">
              {activeOrderId ? (
                <div className="mb-4 rounded-xl border border-brand-copper/20 bg-brand-cream/40 p-3">
                  <h4 className="text-sm font-bold">{t('menu.public.activeOrder')}</h4>
                  <p className="mt-1 text-xs text-brand-gray">
                    {t('menu.public.orderNumber')}: #{activeOrderId.slice(0, 8)}
                  </p>

                  {activeOrder?.items?.length ? (
                    <div className="mt-3 space-y-2">
                      {activeOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-brand-gray/10 bg-white px-2 py-2 text-sm">
                          <span className="line-clamp-1 pr-2">{item.dishName}</span>
                          <span className="font-semibold">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-brand-gray">
                      {t('menu.public.activeOrderNoItems')}
                    </p>
                  )}

                  <div className="mt-3 border-t border-brand-gray/10 pt-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>{t('menu.public.activeOrderTotal')}</span>
                      <span className="font-bold">
                        {activeOrder?.totalAmount ?? 0} {t('menu.currency')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

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
                  onClick={placeOrder}
                  disabled={totalItems === 0 || isPlacingOrder}
                  className="mt-3 w-full rounded-xl bg-brand-copper px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlacingOrder
                    ? t('menu.public.placing')
                    : activeOrderId
                      ? t('menu.public.addMore')
                      : t('menu.public.submitOrder')}
                </button>
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {selectedDish ? (
        <PublicMenuDishDetailsModal
          key={selectedDish.id}
          dish={selectedDish}
          onClose={closeDishDetails}
        />
      ) : null}

      {canUseCart ? (
        <button
          type="button"
          onClick={callWaiter}
          disabled={isCallingWaiter}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-brand-copper px-5 py-3 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <BellRing className="h-4 w-4" />
          {isCallingWaiter
            ? t('menu.public.waiterCalling')
            : t('menu.public.callWaiter')}
        </button>
      ) : null}
    </div>
  );
};