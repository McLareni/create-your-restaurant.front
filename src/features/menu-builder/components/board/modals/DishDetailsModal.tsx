'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/modal';
import { useTranslation } from '@/shared/hooks/useTranslation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { CharacteristicObject } from '@/features/menu-builder/types/dishes.types';

interface DishDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: {
    name: string;
    description?: string | null;
    price: number;
    weight?: number | null;
    calories?: number | null;
    tags?: string[] | CharacteristicObject[];
    allergens?: string[] | CharacteristicObject[];
    images?: { id: string; url: string }[];
    imageUrl?: string | null;
  };
}

export const DishDetailsModal = ({ isOpen, onClose, dish }: DishDetailsModalProps) => {
  const { t } = useTranslation();
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  if (!isOpen) return null;

  const flatAllergens = Array.isArray(dish.allergens) ? dish.allergens : [];
  const flatTags = Array.isArray(dish.tags) ? dish.tags : [];

  const getCharName = (item: string | CharacteristicObject): string => {
    return typeof item === 'object' && item !== null ? item.name : String(item);
  };

  const allImages = dish.images && dish.images.length > 0 
    ? dish.images.map((img) => img.url) 
    : (dish.imageUrl ? [dish.imageUrl] : []);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dish.name}>
      <div className="space-y-4">
        {allImages.length > 0 ? (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-bg-main/30 border border-solid border-border-main/40 group/gallery mb-3">
            <Image
              src={allImages[activeImgIdx]}
              alt={dish.name}
              fill
              className="object-cover pointer-events-none select-none"
              unoptimized
            />
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-bg-surface/80 backdrop-blur-xs flex items-center justify-center text-text-main shadow-md hover:bg-bg-surface border-0 transition-colors cursor-pointer outline-none z-10"
                >
                  <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-bg-surface/80 backdrop-blur-xs flex items-center justify-center text-text-main shadow-md hover:bg-bg-surface border-0 transition-colors cursor-pointer outline-none z-10"
                >
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-white backdrop-blur-xs z-10">
                  {activeImgIdx + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative aspect-video w-full rounded-xl border border-solid border-border-main/40 bg-bg-element/20 flex flex-col items-center justify-center text-text-muted/40 gap-1.5 mb-3">
            <ImageIcon className="h-8 w-8 font-light" />
          </div>
        )}

        <div className="flex items-center justify-between border-b border-solid border-border-main/30 pb-2 mb-2 px-0">
          <span className="text-sm font-medium text-text-muted">
            {t('menu.constructor.dishes.modal.properties.priceLabel')}
          </span>
          <span className="text-base font-extrabold text-brand-emerald font-mono bg-brand-emerald/5 px-2.5 py-1 rounded-md">
            {dish.price} ₴
          </span>
        </div>

        {dish.description && (
          <div className="space-y-1 px-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {t('menu.constructor.dishes.modal.properties.descriptionLabel')}
            </span>
            <p className="text-xs text-text-main leading-relaxed font-medium">{dish.description}</p>
          </div>
        )}

        <div className="flex gap-6 text-[11px] text-text-muted font-bold uppercase tracking-wider px-0">
          {dish.weight && (
            <div>
              {t('menu.constructor.dishes.modal.properties.weightLabel')}{' '}
              <span className="text-text-main font-extrabold">{dish.weight} {t('dishes.modal.ingredients.units.g')}</span>
            </div>
          )}
          {dish.calories && (
            <div>
              {t('menu.constructor.dishes.modal.properties.caloriesLabel')}{' '}
              <span className="text-text-main font-extrabold">{dish.calories} {t('dishes.modal.units.caloriesShort')}</span>
            </div>
          )}
        </div>

        {flatTags.length > 0 && (
          <div className="space-y-1.5 px-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block text-left">
              {t('menu.constructor.dishes.modal.properties.tagsTitle')}
            </span>
            <div className="flex flex-wrap gap-1.5 justify-start">
              {flatTags.map((tag, idx) => {
                const name = getCharName(tag);
                return (
                  <span
                    key={`${name}-${idx}`}
                    className="text-[11px] font-semibold text-text-main bg-bg-main/20 px-2.5 py-1 rounded-md border border-solid border-border-main/30"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {flatAllergens.length > 0 && (
          <div className="space-y-1.5 px-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block text-left">
              {t('menu.constructor.dishes.modal.properties.allergensTitle')}
            </span>
            <div className="flex flex-wrap gap-1.5 justify-start">
              {flatAllergens.map((allergen, idx) => {
                const name = getCharName(allergen);
                return (
                  <span
                    key={`${name}-${idx}`}
                    className="text-[11px] font-semibold text-red-600 bg-red-500/5 px-2.5 py-1 rounded-md border border-solid border-red-500/10"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};