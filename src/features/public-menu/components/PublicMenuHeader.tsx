'use client';

import { FormEvent, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Search, Loader2 } from 'lucide-react';
import { PublicMenuCategory } from '../types/publicMenu.types';

interface PublicMenuHeaderProps {
  restaurantName: string;
  categories: PublicMenuCategory[];
  activeTabId: string;
  allDishesTabId: string;
  onSelectTab: (tabId: string) => void;
  showOrderLookup: boolean;
  onGoToOrder: (orderNumber: string) => Promise<void> | void;
  isOrderLookupLoading: boolean;
}

export const PublicMenuHeader = ({
  restaurantName,
  categories,
  activeTabId,
  allDishesTabId,
  onSelectTab,
  showOrderLookup,
  onGoToOrder,
  isOrderLookupLoading,
}: PublicMenuHeaderProps) => {
  const { t } = useTranslation();
  const [orderNumber, setOrderNumber] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = orderNumber.trim();
    if (!normalized) return;
    onGoToOrder(normalized);
  };

  return (
    <div className="sticky top-0 z-30 bg-brand-cream/90 backdrop-blur-xl border-b border-solid border-brand-copper/10 transition-all duration-300">
      <header className="w-full bg-transparent px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-extrabold tracking-tight text-brand-espresso md:text-2xl font-serif">
              {restaurantName}
            </h1>
            <p className="text-xs font-medium text-brand-gray/80">
              {t('menu.public.subtitle')}
            </p>
          </div>

          {showOrderLookup && (
            <form onSubmit={handleSubmit} className="relative w-full max-w-xs shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder={t('menu.public.findOrderPlaceholder')}
                  className="w-full rounded-full border border-solid border-brand-gray/20 bg-white/60 pl-4 pr-24 py-2.5 text-xs font-semibold text-brand-espresso placeholder:text-brand-gray/50 outline-none focus:border-brand-copper/60 focus:bg-white focus:ring-2 focus:ring-brand-copper/10 transition-all"
                />
                <button
                  type="submit"
                  disabled={isOrderLookupLoading}
                  className="absolute right-1.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-espresso px-4 text-[11px] font-bold text-white hover:bg-brand-copper transition-colors disabled:opacity-50 select-none cursor-pointer border-0"
                >
                  {isOrderLookupLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Search className="h-3 w-3" />
                  )}
                  <span>{t('menu.public.goToOrder')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </header>

      {categories.length > 0 && (
        <div className="w-full px-4 pb-4 md:px-6">
          <div className="mx-auto max-w-5xl flex gap-2 overflow-x-auto scrollbar-none py-1 mask-linear-r">
            <button
              type="button"
              onClick={() => onSelectTab(allDishesTabId)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold border border-solid transition-all duration-200 select-none cursor-pointer outline-none active:scale-95 ${
                activeTabId === allDishesTabId
                  ? 'border-brand-copper bg-brand-copper text-white shadow-sm shadow-brand-copper/20'
                  : 'border-brand-gray/15 bg-white text-brand-espresso hover:bg-brand-gray/5 hover:border-brand-gray/30'
              }`}
            >
              {t('menu.public.allDishes')}
            </button>

            {categories.map((category) => {
              const isActive = category.id === activeTabId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectTab(category.id)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold border border-solid transition-all duration-200 select-none cursor-pointer outline-none active:scale-95 ${
                    isActive
                      ? 'border-brand-copper bg-brand-copper text-white shadow-sm shadow-brand-copper/20'
                      : 'border-brand-gray/15 bg-white text-brand-espresso hover:bg-brand-gray/5 hover:border-brand-gray/30'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};