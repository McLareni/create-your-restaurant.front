'use client';

import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { X, ChevronLeft, ChevronRight, ImageOff, Leaf, Flame, ShieldAlert } from 'lucide-react';
import { PublicMenuDish } from '../types/publicMenu.types';

interface PublicMenuDishDetailsModalProps {
  dish: PublicMenuDish;
  currency: string | null;
  onClose: () => void;
}

const getDishImages = (dish: PublicMenuDish): string[] => {
  const gallery = dish.images?.map((image) => image.url).filter(Boolean) ?? [];
  if (gallery.length > 0) return gallery;
  if (dish.imageUrl) return [dish.imageUrl];
  return [];
};

export const PublicMenuDishDetailsModal = ({ dish, onClose, currency }: PublicMenuDishDetailsModalProps) => {
  const { t } = useTranslation();
  const dishImages = useMemo(() => getDishImages(dish), [dish]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentImage = dishImages[selectedImageIndex] ?? dishImages[0] ?? '';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-espresso/40 backdrop-blur-md p-0 sm:items-center sm:p-4 animate-fade-in"
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto scrollbar-none rounded-t-3xl bg-brand-cream dark:bg-bg-surface border-t border-solid border-white/20 dark:border-white/10 shadow-2xl transition-all sm:rounded-2xl sm:border flex flex-col animate-slide-up"
      >
        <div className="relative aspect-16/10 w-full bg-brand-espresso/5 shrink-0">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={dish.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-brand-gray/30">
              <ImageOff className="h-8 w-8 stroke-[1.2]" />
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-espresso/60 backdrop-blur-md text-white hover:bg-brand-espresso border-0 transition-colors cursor-pointer outline-none shadow-md"
          >
            <X className="h-4 w-4" />
          </button>

          {dishImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? dishImages.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-xs text-brand-espresso hover:bg-white border-0 transition-all shadow-md active:scale-90 cursor-pointer outline-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedImageIndex((prev) => (prev === dishImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-xs text-brand-espresso hover:bg-white border-0 transition-all shadow-md active:scale-90 cursor-pointer outline-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              <div className="absolute bottom-3 left-1/2 -translate-y-1/2 flex gap-1.5 rounded-full bg-brand-espresso/40 backdrop-blur-md px-2.5 py-1">
                {dishImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === selectedImageIndex ? 'w-3.5 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex-1 p-5 md:p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-brand-espresso dark:text-text-main font-serif tracking-tight">
                {dish.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-brand-gray/70 font-mono">
                {dish.weight && <span>{dish.weight} {t('menu.constructor.dishes.modal.weightUnit')}</span>}
                {dish.cookingTime && <span>• {dish.cookingTime} {t('menu.constructor.dishes.modal.timeUnit')}</span>}
                {dish.calories && <span>• {dish.calories} {t('menu.constructor.dishes.modal.caloriesUnit')}</span>}
              </div>
            </div>
            <span className="text-xl font-black text-brand-copper font-mono whitespace-nowrap bg-brand-copper/10 rounded-xl px-3 py-1.5">
              {dish.price} {currency}
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold text-brand-espresso/40 dark:text-text-muted tracking-wider uppercase">{t('menu.public.descriptionAndIngredients')}</p>
            <p className="text-sm font-light leading-relaxed text-brand-espresso/90 dark:text-text-main">
              {dish.description || t('menu.public.noDescription')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border border-solid transition-colors text-center ${
              dish.isVegan ? 'bg-emerald-50/40 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-bg-main border-brand-gray/10 dark:border-white/5 text-brand-gray/40 dark:text-text-muted'
            }`}>
              <Leaf className={`h-4 w-4 mb-1 ${dish.isVegan ? 'text-emerald-500' : ''}`} />
              <span className="text-[10px] font-bold">{dish.isVegan ? t('menu.public.vegan') : t('menu.public.notVegan')}</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border border-solid transition-colors text-center ${
              dish.isSpicy ? 'bg-red-50/40 dark:bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400' : 'bg-white dark:bg-bg-main border-brand-gray/10 dark:border-white/5 text-brand-gray/40 dark:text-text-muted'
            }`}>
              <Flame className={`h-4 w-4 mb-1 ${dish.isSpicy ? 'text-red-500' : ''}`} />
              <span className="text-[10px] font-bold">{dish.isSpicy ? t('menu.public.spicy') : t('menu.public.notSpicy')}</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border border-solid transition-colors text-center ${
              dish.isLactoseFree ? 'bg-blue-50/40 dark:bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400' : 'bg-white dark:bg-bg-main border-brand-gray/10 dark:border-white/5 text-brand-gray/40 dark:text-text-muted'
            }`}>
              <ShieldAlert className={`h-4 w-4 mb-1 ${dish.isLactoseFree ? 'text-blue-500' : ''}`} />
              <span className="text-[10px] font-bold">{dish.isLactoseFree ? t('menu.public.lactoseFree') : t('menu.public.hasLactose')}</span>
            </div>
          </div>

          {dish.allergens.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-brand-espresso/40 dark:text-text-muted tracking-wider uppercase">{t('menu.constructor.dishes.properties.allergensTitle')}</p>
              <div className="flex flex-wrap gap-1.5">
                {dish.allergens.map((allergen, idx) => (
                  <span key={idx} className="rounded-md bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-solid border-red-200/40 dark:border-red-500/20 px-2.5 py-1 text-xs font-medium">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dish.tags.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-brand-espresso/40 dark:text-text-muted tracking-wider uppercase">{t('menu.public.tags')}</p>
              <div className="flex flex-wrap gap-1.5">
                {dish.tags.map((tag, idx) => (
                  <span key={idx} className="rounded-full bg-brand-espresso/5 dark:bg-white/5 border border-solid border-brand-espresso/10 dark:border-white/10 px-3 py-1 text-xs font-semibold text-brand-espresso/80 dark:text-text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};