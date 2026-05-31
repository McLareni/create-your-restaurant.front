'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { PublicMenuCategory } from '../types/publicMenu.types';

interface PublicMenuHeaderProps {
  restaurantName: string;
  categories: PublicMenuCategory[];
  activeTabId: string;
  allDishesTabId: string;
  onSelectTab: (tabId: string) => void;
}

export const PublicMenuHeader = ({
  restaurantName,
  categories,
  activeTabId,
  allDishesTabId,
  onSelectTab,
}: PublicMenuHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-30 bg-brand-cream/95 backdrop-blur">
      <header className="w-full bg-white/90 px-4 py-4 md:px-6 md:py-5">
        <h1 className="text-3xl font-black leading-none text-brand-espresso md:text-4xl">
          {restaurantName}
        </h1>
      </header>

      {categories.length > 0 ? (
        <div className="w-full border-brand-copper/20 px-4 md:px-6">
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
