'use client';

import { FormEvent, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
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
    if (!normalized) {
      return;
    }

    onGoToOrder(normalized);
  };

  return (
    <div className="sticky top-0 z-30 bg-brand-cream/95 backdrop-blur">
      <header className="w-full bg-white/90 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-black leading-none text-brand-espresso md:text-4xl">
            {restaurantName}
          </h1>

          {showOrderLookup ? (
            <form
              onSubmit={handleSubmit}
              className="flex w-full gap-2 md:w-auto md:min-w-90"
            >
              <input
                type="text"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder={t('menu.public.findOrderPlaceholder')}
                disabled={isOrderLookupLoading}
                className="h-11 w-full rounded-lg border border-brand-gray/30 px-3 text-sm text-brand-espresso outline-none transition focus:border-brand-copper md:min-w-60"
              />
              <button
                type="submit"
                disabled={isOrderLookupLoading}
                className="h-11 shrink-0 rounded-lg bg-brand-copper px-4 text-sm font-semibold text-white transition hover:bg-brand-gold disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isOrderLookupLoading
                  ? t('menu.public.findingOrder')
                  : t('menu.public.goToOrder')}
              </button>
            </form>
          ) : null}
        </div>
      </header>

      {categories.length > 0 ? (
        <div className="w-full border-brand-copper/20 px-4 md:px-6 pb-4">
          <div className="flex gap-0 overflow-x-auto md:justify-center">
            <button
              type="button"
              onClick={() => onSelectTab(allDishesTabId)}
              className={activeTabId === allDishesTabId
                ? 'whitespace-nowrap rounded-none border border-brand-copper bg-brand-copper px-4 py-2 text-sm font-semibold text-white'
                : 'whitespace-nowrap rounded-none border border-brand-gray/30 bg-white px-4 py-2 text-sm font-semibold text-brand-espresso'}
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
                  className={isActive
                    ? 'whitespace-nowrap rounded-none border border-brand-copper bg-brand-copper px-4 py-2 text-sm font-semibold text-white'
                    : 'whitespace-nowrap rounded-none border border-brand-gray/30 bg-white px-4 py-2 text-sm font-semibold text-brand-espresso'}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
