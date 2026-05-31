'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { PublicMenuDish } from '../types/publicMenu.types';

interface PublicMenuDishDetailsModalProps {
  dish: PublicMenuDish;
  onClose: () => void;
}

const getDishImages = (dish: PublicMenuDish): string[] => {
  const gallery = dish.images?.map((image) => image.url).filter(Boolean) ?? [];
  if (gallery.length > 0) return gallery;
  if (dish.imageUrl) return [dish.imageUrl];
  return [];
};

export const PublicMenuDishDetailsModal = ({ dish, onClose }: PublicMenuDishDetailsModalProps) => {
  const { t } = useTranslation();
  const dishImages = useMemo(() => getDishImages(dish), [dish]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentImage = dishImages[selectedImageIndex] ?? dishImages[0] ?? '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 md:items-center md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto scrollbar-none rounded-2xl bg-white p-5 shadow-xl [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="public-menu-dish-title"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="public-menu-dish-title" className="text-xl font-bold text-brand-espresso">
            {dish.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-brand-gray/30 px-2 py-1 text-xs font-semibold text-brand-gray"
          >
            X
          </button>
        </div>

        {dishImages.length > 0 ? (
          <div className="mt-4 space-y-3">
            <div className="relative h-56 w-full overflow-hidden rounded-xl bg-brand-cream/40 md:h-72">
              <Image
                src={currentImage}
                alt={dish.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>

            {dishImages.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dishImages.map((imageUrl, index) => {
                  const isActive = selectedImageIndex === index;

                  return (
                    <button
                      key={imageUrl}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={isActive
                        ? 'relative h-16 w-20 shrink-0 overflow-hidden rounded-lg ring-2 ring-brand-copper'
                        : 'relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-brand-gray/30'}
                    >
                      <Image
                        src={imageUrl}
                        alt={dish.name}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 flex h-44 items-center justify-center rounded-xl bg-brand-cream/40 text-sm text-brand-gray">
            {t('menu.public.noPhoto')}
          </div>
        )}

        <p className="mt-4 text-sm leading-6 text-brand-gray">
          {dish.description || t('menu.public.noDescription')}
        </p>

        <div className="mt-5 grid gap-2 rounded-xl border border-brand-gray/15 bg-brand-cream/20 p-3 text-sm text-brand-gray md:grid-cols-2">
          <div className="flex items-center justify-between md:col-span-2">
            <span className="font-medium text-brand-espresso">Ціна</span>
            <span className="text-lg font-bold text-brand-copper">
              {dish.price} {t('menu.currency')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Вага</span>
            <span className="font-semibold text-brand-espresso">{dish.weight ?? '-'} </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Час приготування</span>
            <span className="font-semibold text-brand-espresso">{dish.cookingTime ?? '-'} хв</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Калорійність</span>
            <span className="font-semibold text-brand-espresso">{dish.calories ?? '-'} ккал</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Бейдж</span>
            <span className="font-semibold text-brand-espresso">{dish.badge || '-'}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-brand-gray md:grid-cols-3">
          <div className="rounded-lg border border-brand-gray/15 px-3 py-2">
            Веганська: <span className="font-semibold text-brand-espresso">{dish.isVegan ? 'Так' : 'Ні'}</span>
          </div>
          <div className="rounded-lg border border-brand-gray/15 px-3 py-2">
            Гостра: <span className="font-semibold text-brand-espresso">{dish.isSpicy ? 'Так' : 'Ні'}</span>
          </div>
          <div className="rounded-lg border border-brand-gray/15 px-3 py-2">
            Без лактози: <span className="font-semibold text-brand-espresso">{dish.isLactoseFree ? 'Так' : 'Ні'}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm text-brand-gray">
          <div>
            <p className="font-semibold text-brand-espresso">Алергени</p>
            <p className="mt-1">{dish.allergens.length > 0 ? dish.allergens.join(', ') : '-'}</p>
          </div>

          <div>
            <p className="font-semibold text-brand-espresso">Теги</p>
            <p className="mt-1">{dish.tags.length > 0 ? dish.tags.join(', ') : '-'}</p>
          </div>
        </div>

        {dish.variants.length > 0 ? (
          <div className="mt-4 rounded-xl border border-brand-gray/15">
            <div className="border-b border-brand-gray/15 px-3 py-2 text-sm font-semibold text-brand-espresso">
              Варіанти страви
            </div>
            <div className="divide-y divide-brand-gray/10">
              {dish.variants.map((variant) => (
                <div key={variant.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium text-brand-espresso">{variant.name}</p>
                    <p className="text-xs text-brand-gray">SKU: {variant.sku || '-'}</p>
                  </div>
                  <p className="font-semibold text-brand-copper">{variant.price} {t('menu.currency')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between border-t border-brand-gray/15 pt-4">
          <span className="text-sm text-brand-gray">Базова ціна</span>
          <span className="text-lg font-bold text-brand-copper">
            {dish.price} {t('menu.currency')}
          </span>
        </div>
      </div>
    </div>
  );
};
