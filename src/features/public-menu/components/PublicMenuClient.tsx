'use client';

import { useMemo, useState } from 'react';

import { Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { publicMenuApi } from '@/features/public-menu/api/publicMenu.api';
import { usePublicMenuClient } from '@/features/public-menu/hooks/usePublicMenuClient';
import { PublicMenuClientProps, PublicMenuDish } from '@/features/public-menu/types/publicMenu.types';
import { PublicMenuHeader } from './PublicMenuHeader';
import { PublicMenuDishSections } from './PublicMenuDishSections';
import { FloatingActionMenu } from './FloatingActionMenu';
import { PublicMenuDishDetailsModal } from './PublicMenuDishDetailsModal';

const ALL_DISHES_TAB_ID = 'all-dishes';

export const PublicMenuClient = ({ restaurantSlug, tableId, orderId }: PublicMenuClientProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
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

  const visualSettings = menuData?.visualSettings;
  const themeClass = visualSettings?.theme === 'dark' ? 'dark' : '';
  const fontClass = visualSettings?.fontFamily || 'font-sans';
  const buttonStyleClass = `button-style-${visualSettings?.buttonStyle || 'solid'}`;

  const generateCssVars = () => {
    if (!visualSettings) return '';
    let css = `.menu-theme-root {\n`;
    
    if (visualSettings.primaryColor) {
      const pc = visualSettings.primaryColor;
      css += `  --brand-copper: ${pc};\n`;
      css += `  --brand-emerald: ${pc};\n`;
      css += `  --brand-brown: ${pc};\n`;
      css += `  --color-brand-copper: ${pc};\n`;
      css += `  --color-brand-emerald: ${pc};\n`;
      css += `  --color-brand-brown: ${pc};\n`;
    }
    

    
    if (visualSettings.borderRadius) {
      const r = visualSettings.borderRadius;
      if (r === '9999px') {
        css += `  --radius-sm: 8px;\n  --radius-md: 12px;\n  --radius-lg: 16px;\n  --radius-xl: 24px;\n  --radius-2xl: 32px;\n  --radius-3xl: 40px;\n`;
      } else {
        css += `  --radius-sm: calc(${r} * 0.5);\n  --radius-md: calc(${r} * 0.75);\n  --radius-lg: ${r};\n  --radius-xl: calc(${r} * 1.25);\n  --radius-2xl: calc(${r} * 1.5);\n  --radius-3xl: calc(${r} * 2);\n`;
      }
    }
    
    if (visualSettings.shadowIntensity === 'none') {
      css += `  --shadow-sm: none;\n  --shadow-md: none;\n  --shadow-lg: none;\n`;
    } else if (visualSettings.shadowIntensity === 'prominent') {
      css += `  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);\n  --shadow-md: 0 12px 32px rgba(0, 0, 0, 0.2);\n  --shadow-lg: 0 20px 48px rgba(0, 0, 0, 0.25);\n`;
    }
    
    css += `}\n`;
    return css;
  };

  return (
    <div 
      className={`min-h-screen bg-brand-cream dark:bg-brand-mocha text-brand-espresso dark:text-brand-cream selection:bg-brand-copper selection:text-white pb-24 menu-theme-root ${themeClass} ${fontClass} ${buttonStyleClass}`}
    >
      <style dangerouslySetInnerHTML={{ __html: generateCssVars() }} />
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
              currency={currency}
              activeCategory={activeCategory}
              isAllDishesTabActive={isAllDishesTabActive}
              activeTabId={activeTabId}
              canUseCart={canUseCart}
              cart={cart}
              isPlacingOrder={isPlacingOrder}
              onAddDish={addDish}
              onRemoveDish={removeDish}
              onOpenDetails={setSelectedDish}
              buttonStyle={visualSettings?.buttonStyle}
              cardStyle={visualSettings?.cardStyle}
            />
          </div>

          {canUseCart && (
            <aside className="h-fit rounded-3xl border border-solid border-brand-gray/10 bg-white/80 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:sticky lg:top-36 dark:bg-brand-mocha/80 dark:border-brand-gray/20">
              {activeOrderId && activeOrder && (
                <div className="mb-6 rounded-2xl border border-solid border-brand-emerald/20 bg-gradient-to-b from-brand-emerald/10 to-transparent p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-emerald rounded-l-2xl"></div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-brand-emerald">{t('menu.public.activeOrder')}</h4>
                      <p className="mt-1 text-[10px] font-mono font-medium text-brand-gray">
                        {t('menu.public.orderNumber')}: <span className="font-bold">#{activeOrder.orderNumber || activeOrderId.split('-')[0]}</span>
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${activeOrder.status === 'COMPLETED' ? 'bg-brand-emerald/10 border-brand-emerald/20' : activeOrder.status === 'CANCELLED' ? 'bg-red-500/10 border-red-500/20' : 'bg-brand-copper/10 border-brand-copper/20'}`}>
                      {activeOrder.status === 'IN_PROGRESS' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-copper opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-copper"></span>
                        </span>
                      )}
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${activeOrder.status === 'COMPLETED' ? 'text-brand-emerald' : activeOrder.status === 'CANCELLED' ? 'text-red-500' : 'text-brand-copper'}`}>
                        {activeOrder.status === 'COMPLETED' ? t('menu.public.statusCompleted') : activeOrder.status === 'CANCELLED' ? t('menu.public.statusCancelled') : t('menu.public.statusInProgress')}
                      </span>
                    </div>
                  </div>

                  {activeOrder.items?.length ? (
                    <div className="space-y-2.5">
                      {activeOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-[13px] font-medium text-brand-espresso dark:text-brand-cream">
                          <span className="truncate pr-4 flex-1">{item.dishName}</span>
                          <span className="font-mono bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md text-[11px] font-bold text-brand-gray">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-brand-gray italic">{t('menu.public.activeOrderNoItems')}</p>
                  )}

                  <div className="mt-4 pt-3 border-t border-dashed border-brand-emerald/30 flex items-center justify-between text-sm font-black">
                    <span className="text-brand-espresso dark:text-brand-cream">{t('menu.public.activeOrderTotal')}</span>
                    <span className="font-mono text-brand-emerald tracking-tight">{activeOrder.totalAmount} {currency}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-brand-espresso dark:text-brand-cream flex items-center gap-2">
                  {t('menu.public.cart')}
                  {totalItems > 0 && (
                    <span className="bg-brand-copper text-white text-[10px] px-2 py-0.5 rounded-full">{totalItems}</span>
                  )}
                </h3>
              </div>

              {totalItems === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center opacity-60">
                  <Receipt className="h-10 w-10 text-brand-gray/40 mb-3 stroke-1" />
                  <p className="text-sm font-medium text-brand-gray italic">{t('menu.public.cartEmpty')}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(cart).map(([dishId, quantity]) => {
                    const dish = dishesById[dishId];
                    if (!dish) return null;

                    return (
                      <div key={dishId} className="flex items-center justify-between group">
                        <div className="flex flex-col min-w-0 flex-1 pr-4">
                          <span className="truncate text-sm font-semibold text-brand-espresso dark:text-brand-cream transition-colors group-hover:text-brand-copper">{dish.name}</span>
                          <span className="text-[11px] font-medium text-brand-gray">{dish.price} {currency}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3 bg-brand-gray/5 dark:bg-white/5 rounded-full px-1 py-1 border border-solid border-brand-gray/10">
                            <button onClick={() => removeDish(dishId)} className="w-6 h-6 rounded-full bg-white dark:bg-brand-mocha shadow-sm flex items-center justify-center text-brand-espresso dark:text-brand-cream font-bold text-lg hover:text-brand-copper transition-colors">-</button>
                            <span className="font-mono font-bold text-[13px] w-4 text-center text-brand-espresso dark:text-brand-cream">{quantity}</span>
                            <button onClick={() => addDish(dishId)} className="w-6 h-6 rounded-full bg-white dark:bg-brand-mocha shadow-sm flex items-center justify-center text-brand-espresso dark:text-brand-cream font-bold text-lg hover:text-brand-copper transition-colors">+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 border-t-2 border-dashed border-brand-gray/15 pt-5">
                <div className="flex items-end justify-between mb-6">
                  <span className="text-sm font-bold uppercase tracking-wider text-brand-gray">{t('menu.public.total')}</span>
                  <span className="text-2xl font-black font-mono text-brand-copper tracking-tight leading-none">{totalAmount} <span className="text-sm">{currency}</span></span>
                </div>
                <button
                  type="button"
                  onClick={() => placeOrder()}
                  disabled={totalItems === 0 || isPlacingOrder}
                  className="group relative w-full h-14 rounded-2xl bg-brand-copper text-sm font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand-copper/30 transition-all hover:brightness-90 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none overflow-hidden btn-dynamic"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0 duration-300 ease-out rounded-2xl"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPlacingOrder ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                        {t('menu.public.placing')}
                      </span>
                    ) : activeOrderId ? (
                      t('menu.public.addMore')
                    ) : (
                      t('menu.public.submitOrder')
                    )}
                  </span>
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>

      {selectedDish && (
        <PublicMenuDishDetailsModal
          currency={currency}
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}

      {canUseCart && (
        <FloatingActionMenu 
          onCallWaiter={() => callWaiter('WAITER')} 
          onAskBill={() => callWaiter('BILL')}
          isCallingWaiter={isCallingWaiter} 
        />
      )}
    </div>
  );
};