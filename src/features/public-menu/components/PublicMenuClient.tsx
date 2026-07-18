'use client';

import { useMemo, useState } from 'react';
import { BellRing } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { publicMenuApi } from '@/features/public-menu/api/publicMenu.api';
import { usePublicMenuClient } from '@/features/public-menu/hooks/usePublicMenuClient';
import { PublicMenuClientProps, PublicMenuDish } from '@/features/public-menu/types/publicMenu.types';
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

  const handleGoToOrder = async (rawOrderNumber: string) => {
    if (!resolvedRestaurantId || !tableId) return;
    const normalizedInput = rawOrderNumber.trim().replace(/^#/, '');
    if (!normalizedInput) return;

    setIsOrderLookupLoading(true);
    try {
      const lookupResponse = await publicMenuApi.findOrderByCode(
        resolvedRestaurantId,
        tableId,
        normalizedInput,
      );
      router.push(`/menu/${encodeURIComponent(restaurantSlug)}/${encodeURIComponent(tableId)}/${encodeURIComponent(lookupResponse.orderId)}`);
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
      <div className="min-h-screen bg-brand-cream text-brand-espresso">
        <div className="sticky top-0 z-30 bg-brand-cream/95 backdrop-blur-md">
          <header className="w-full px-4 py-5 md:px-6">
            <div className="h-8 w-48 rounded-full bg-brand-espresso/5 animate-pulse" />
          </header>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="h-96 w-full rounded-2xl bg-brand-espresso/5 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isMenuError || !menuData) {
    return <div className="p-6 text-sm font-semibold text-red-600 text-center">{t('menu.errors.unavailable')}</div>;
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-espresso selection:bg-brand-copper selection:text-white pb-24">
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

      <div className="mx-auto max-w-5xl px-4 py-4 md:px-6">
        {hasTableId && isTableLoading && (
          <p className="mb-4 text-xs font-medium text-brand-gray animate-pulse">{t('menu.public.checkingTable')}</p>
        )}

        {hasTableId && isTableError && (
          <p className="mb-4 rounded-xl bg-red-500/5 border border-solid border-red-500/10 px-4 py-3 text-xs font-semibold text-red-600">
            {t('menu.errors.tableValidationFailed')}
          </p>
        )}

        {hasTableId && !isTableLoading && !isTableError && tableExists === false && (
          <p className="mb-4 rounded-xl bg-red-500/5 border border-solid border-red-500/10 px-4 py-3 text-xs font-semibold text-red-600">
            {t('menu.errors.tableNotFound')}
          </p>
        )}

        <div className={canUseCart ? 'grid gap-8 lg:grid-cols-[1fr_340px]' : 'w-full'}>
          <div className="space-y-8">
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
              onOpenDetails={setSelectedDish}
            />
          </div>

          {canUseCart && (
            <aside className="h-fit rounded-2xl border border-solid border-brand-copper/10 bg-white p-5 shadow-sm lg:sticky lg:top-36">
              {activeOrderId && activeOrder && (
                <div className="mb-5 rounded-xl border border-solid border-brand-copper/20 bg-brand-cream/30 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-espresso">{t('menu.public.activeOrder')}</h4>
                  <p className="mt-1 text-[11px] font-mono text-brand-gray">
                    {t('menu.public.orderNumber')}: #{activeOrderId.slice(0, 8)}
                  </p>

                  {activeOrder.items?.length ? (
                    <div className="mt-3 space-y-1.5">
                      {activeOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs font-medium text-brand-espresso">
                          <span className="truncate pr-4">{item.dishName}</span>
                          <span className="font-mono bg-brand-espresso/5 px-2 py-0.5 rounded text-[11px]">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-brand-gray">{t('menu.public.activeOrderNoItems')}</p>
                  )}

                  <div className="mt-3 border-t border-solid border-brand-gray/10 pt-2.5 flex items-center justify-between text-xs font-bold">
                    <span>{t('menu.public.activeOrderTotal')}</span>
                    <span className="font-mono text-brand-copper">{activeOrder.totalAmount} {t('menu.currency')}</span>
                  </div>
                </div>
              )}

              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-espresso">{t('menu.public.cart')}</h3>

              {totalItems === 0 ? (
                <p className="mt-4 text-xs font-medium text-brand-gray/70 italic text-center py-6">{t('menu.public.cartEmpty')}</p>
              ) : (
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {Object.entries(cart).map(([dishId, quantity]) => {
                    const dish = dishesById[dishId];
                    if (!dish) return null;

                    return (
                      <div key={dishId} className="flex items-center justify-between rounded-xl border border-solid border-brand-gray/10 px-3 py-2 text-xs font-medium">
                        <span className="truncate pr-4 text-brand-espresso">{dish.name}</span>
                        <span className="font-mono bg-brand-copper/10 text-brand-copper px-2 py-0.5 rounded">x{quantity}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 border-t border-solid border-brand-gray/10 pt-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-espresso">
                  <span>{t('menu.public.total')}</span>
                  <span className="text-base font-black font-mono text-brand-copper">{totalAmount} {t('menu.currency')}</span>
                </div>
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={totalItems === 0 || isPlacingOrder}
                  className="mt-4 w-full h-11 rounded-xl bg-brand-copper text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-espresso shadow-md shadow-brand-copper/10 transition-colors disabled:cursor-not-allowed disabled:opacity-40 border-0 outline-none cursor-pointer"
                >
                  {isPlacingOrder ? t('menu.public.placing') : activeOrderId ? t('menu.public.addMore') : t('menu.public.submitOrder')}
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>

      {selectedDish && (
        <PublicMenuDishDetailsModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}

      {canUseCart && (
        <button
          type="button"
          onClick={callWaiter}
          disabled={isCallingWaiter}
          className="fixed bottom-6 right-6 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-brand-espresso px-6 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:bg-brand-copper active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 border-0 outline-none cursor-pointer"
        >
          <BellRing className="h-4 w-4 text-white" />
          <span>{isCallingWaiter ? t('menu.public.waiterCalling') : t('menu.public.callWaiter')}</span>
        </button>
      )}
    </div>
  );
};