'use client';

import React from 'react';
import type { ReactNode, HTMLAttributes, Ref } from 'react';
import Image from 'next/image';
import { Clock, EyeOff } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Badge } from '@/shared/ui/badge';
import { useRestaurantCurrency, useRestaurantStore } from '../store/useRestaurantStore';

interface DishCardVisualProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: string | null;
  price: number;
  weight?: number | null;
  calories?: number | null;
  cookingTime?: number | null;
  imageUrl?: string | null;
  badge?: string;
  isAvailable?: boolean;
  topLeftAction?: ReactNode;
  topRightActions?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export const DishCardVisual = ({
  name,
  description,
  price,
  weight,
  calories,
  cookingTime,
  imageUrl,
  badge,
  isAvailable = true,
  topLeftAction,
  topRightActions,
  className = '',
  ref,
  ...props
}: DishCardVisualProps) => {
  const { t } = useTranslation();
  const activeRestaurantId = useRestaurantStore((state) => state.activeRestaurant?.id ?? null);
  const currency = useRestaurantCurrency(activeRestaurantId ?? undefined) ?? null;

  return (
    <div
      ref={ref}
      {...props}
      className={`group relative flex flex-col w-60 h-64 bg-bg-surface border rounded-md transition-all duration-200 overflow-hidden shrink-0 cursor-pointer shadow-table ${
        !isAvailable ? 'opacity-70 bg-bg-main/40' : 'border-border-main/60 dark:border-border-main hover:border-brand-emerald/40 hover:shadow-md'
      } ${className}`}
    >
      <div className="relative w-full h-36 bg-bg-main/60 shrink-0 border-b border-solid border-border-main/40 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="240px"
            className="object-cover pointer-events-none select-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted/60 text-center font-medium p-2 leading-tight bg-bg-element/30">
            {t('menu.public.noPhoto')}
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="bg-neutral-900/90 text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium shadow-sm">
              <EyeOff className="h-3 w-3" /> {t('menu.constructor.inventory.statusStopped')}
            </div>
          </div>
        )}

        {topLeftAction}
        {topRightActions}

        {badge && badge !== 'NONE' && (
          <div className="absolute bottom-2 right-2 z-10 scale-90 origin-bottom-right">
            <Badge type={badge} />
          </div>
        )}
      </div>

      <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0 bg-bg-surface">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h4 className="text-xs font-bold text-text-main truncate flex-1">
              {name || t('menu.constructor.dishes.modal.namePlaceholder')}
            </h4>
            {cookingTime && (
              <div className="flex items-center gap-0.5 text-[10px] font-medium text-text-muted shrink-0">
                <Clock className="h-2.5 w-2.5 text-text-muted/60" />
                <span>{cookingTime} {t('menu.constructor.dishes.modal.units.minutesShort')}</span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-text-muted font-light line-clamp-2 leading-tight">
            {description || t('menu.public.noDescription')}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-solid border-border-main/50 shrink-0">
          <span className="text-brand-emerald text-xs font-extrabold font-mono">
            {price} {currency}
          </span>
          <div className="flex items-center gap-1.5 text-[9px] font-medium text-text-muted/60 font-mono">
            {weight && (
              <span>
                {weight} {t('menu.constructor.dishes.modal.ingredients.units.g')}
              </span>
            )}
            {weight && calories && <span className="opacity-40">•</span>}
            {calories && (
              <span>
                {calories} {t('menu.constructor.dishes.modal.units.caloriesShort')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};