'use client';

import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
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
      className="cursor-pointer overflow-hidden rounded-2xl border border-brand-gray/20 bg-white shadow-sm transition hover:border-brand-copper/40"
      onClick={() => onOpenDetails(dish)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenDetails(dish);
        }
      }}
    >
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
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveDish(dish.id);
                }}
                className="h-7 w-7 rounded-full border border-brand-gray/30 text-sm disabled:opacity-40"
                disabled={quantity === 0 || isPlacingOrder}
              >
                -
              </button>
              <span className="w-5 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onAddDish(dish.id);
                }}
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
};
