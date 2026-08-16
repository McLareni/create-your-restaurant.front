'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Plus, Minus, ImageOff } from 'lucide-react';
import { PublicMenuDish } from '../types/publicMenu.types';

interface PublicMenuDishCardProps {
  dish: PublicMenuDish;
  currency: string | null;
  quantity: number;
  canUseCart: boolean;
  isPlacingOrder: boolean;
  onAddDish: (dishId: string) => void;
  onRemoveDish: (dishId: string) => void;
  onOpenDetails: (dish: PublicMenuDish) => void;
  buttonStyle?: string;
  cardStyle?: string;
}

const getDishPreview = (dish: PublicMenuDish) => {
  if (dish.images && dish.images.length > 0) {
    return dish.images[0]?.url;
  }
  return dish.imageUrl ?? null;
};

export const PublicMenuDishCard = ({
  dish,
  currency,
  quantity,
  canUseCart,
  isPlacingOrder,
  onAddDish,
  onRemoveDish,
  onOpenDetails,
  buttonStyle,
  cardStyle,
}: PublicMenuDishCardProps) => {
  const { t } = useTranslation();
  const dishImage = getDishPreview(dish);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDetails(dish);
    }
  };

  const getAddButtonClass = () => {
    if (quantity > 0) return 'bg-white text-brand-espresso hover:brightness-95 shadow-xs';
    if (buttonStyle === 'outline') return 'bg-transparent border border-solid border-brand-copper text-brand-copper hover:bg-brand-copper hover:text-white';
    if (buttonStyle === 'soft') return 'bg-brand-copper/15 text-brand-copper hover:brightness-95';
    return 'bg-brand-copper text-white hover:brightness-90 shadow-xs';
  };

  const getCardClasses = () => {
    let base = "group relative flex flex-col overflow-hidden p-3 transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-copper/50 ";
    if (cardStyle === 'standard' || !cardStyle) {
      base += "rounded-2xl border border-solid border-brand-gray/10 bg-white dark:bg-brand-mocha shadow-xs hover:border-brand-copper/30 hover:shadow-md hover:shadow-brand-espresso/5";
    } else if (cardStyle === 'outline') {
      base += "rounded-2xl border border-solid border-brand-espresso/15 bg-transparent hover:border-brand-copper";
    } else if (cardStyle === 'flat') {
      base += "rounded-2xl bg-transparent border-transparent hover:bg-brand-espresso/5 dark:hover:bg-brand-cream/5";
    }
    return base;
  };

  return (
    <article
      onClick={() => onOpenDetails(dish)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={getCardClasses()}
      role="button"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-solid border-brand-espresso/5">
        {dishImage ? (
          <Image
            src={dishImage}
            alt={dish.name}
            fill
            sizes="(max-w-7xl) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-brand-gray/30">
            <ImageOff className="h-6 w-6 stroke-[1.5]" />
            <span className="mt-1 text-[10px] font-medium">{t('menu.public.noPhoto')}</span>
          </div>
        )}

        {dish.badge && dish.badge !== 'NONE' && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-espresso/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-extrabold tracking-wider text-white uppercase">
            {t(`menu.constructor.badges.${dish.badge}`) || dish.badge}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-sm font-bold text-brand-espresso dark:text-brand-cream group-hover:text-brand-copper transition-colors line-clamp-1">
          {dish.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs font-light leading-relaxed text-brand-gray/80 dark:text-brand-gray/90 min-h-8">
          {dish.description || t('menu.public.noDescription')}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-solid border-brand-gray/5">
          <span className="text-base font-extrabold text-brand-copper font-mono">
            {dish.price} {currency}
          </span>

          {canUseCart && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className={`flex items-center gap-1 rounded-full p-0.5 transition-all duration-200 ${
                quantity > 0 ? 'bg-brand-cream border border-solid border-brand-copper/20' : 'bg-transparent'
              }`}
            >
              {quantity > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => onRemoveDish(dish.id)}
                    disabled={isPlacingOrder}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-0 bg-white text-brand-espresso hover:brightness-95 shadow-xs transition-all active:scale-90 disabled:opacity-40 cursor-pointer outline-none"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-brand-espresso font-mono">
                    {quantity}
                  </span>
                </>
              )}
              <button
                type="button"
                onClick={() => onAddDish(dish.id)}
                disabled={isPlacingOrder}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all active:scale-90 disabled:opacity-40 cursor-pointer outline-none ${getAddButtonClass()}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};