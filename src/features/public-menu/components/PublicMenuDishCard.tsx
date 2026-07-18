'use client';

import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Plus, Minus, ImageOff } from 'lucide-react';
import { PublicMenuDish } from '../types/publicMenu.types';

interface PublicMenuDishCardProps {
  dish: PublicMenuDish;
  quantity: number;
  canUseCart: boolean;
  isPlacingOrder: boolean;
  onAddDish: (dishId: string) => void;
  onRemoveDish: (dishId: string) => void;
  onOpenDetails: (dish: PublicMenuDish) => void;
}

const getDishPreview = (dish: PublicMenuDish) => {
  if (dish.images && dish.images.length > 0) {
    return dish.images[0]?.url;
  }
  return dish.imageUrl ?? null;
};

export const PublicMenuDishCard = ({
  dish,
  quantity,
  canUseCart,
  isPlacingOrder,
  onAddDish,
  onRemoveDish,
  onOpenDetails,
}: PublicMenuDishCardProps) => {
  const { t } = useTranslation();
  const dishImage = getDishPreview(dish);

  return (
    <article
      onClick={() => onOpenDetails(dish)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-solid border-brand-gray/10 bg-white p-3 shadow-xs transition-all duration-300 hover:border-brand-copper/30 hover:shadow-md hover:shadow-brand-espresso/5 cursor-pointer"
      role="button"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-brand-cream/40">
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
        <h3 className="text-sm font-bold text-brand-espresso group-hover:text-brand-copper transition-colors line-clamp-1">
          {dish.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs font-light leading-relaxed text-brand-gray/80 min-h-8">
          {dish.description || t('menu.public.noDescription')}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-solid border-brand-gray/5">
          <span className="text-base font-extrabold text-brand-copper font-mono">
            {dish.price} {t('menu.currency')}
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
                    className="flex h-7 w-7 items-center justify-center rounded-full border-0 bg-white text-brand-espresso hover:bg-brand-copper hover:text-white shadow-xs transition-all active:scale-90 disabled:opacity-40 cursor-pointer outline-none"
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
                className={`flex h-7 w-7 items-center justify-center rounded-full border-0 shadow-xs transition-all active:scale-90 disabled:opacity-40 cursor-pointer outline-none ${
                  quantity > 0 
                    ? 'bg-white text-brand-espresso hover:bg-brand-copper hover:text-white' 
                    : 'bg-brand-copper text-white hover:bg-brand-espresso'
                }`}
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