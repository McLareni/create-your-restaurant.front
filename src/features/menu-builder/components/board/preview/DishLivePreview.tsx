'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { DishLivePreviewProps } from '@/features/menu-builder/types/dishes.types';

export const DishLivePreview = ({ form, imageUrl }: DishLivePreviewProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-64 rounded-2xl border border-brand-gray/10 bg-white dark:bg-brand-mocha p-4 shadow-md sticky top-4 select-none">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-brand-cream/30 dark:bg-brand-gray/5 flex items-center justify-center mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={form.name || t('menu.constructor.dishes.modal.tabs.media')}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <ImageIcon className="h-6 w-6 text-brand-gray/30" />
        )}
      </div>

      <div className="space-y-1.5">
        <h4 className="font-bold text-sm text-brand-espresso dark:text-brand-cream truncate">
          {form.name || t('menu.constructor.dishes.modal.namePlaceholder')}
        </h4>
        
        <p className="text-[11px] text-brand-gray dark:text-brand-cream/60 line-clamp-2 leading-tight min-h-8">
          {form.description || t('menu.constructor.dishes.modal.descPlaceholder')}
        </p>

        <div className="pt-2 border-t border-brand-gray/5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-brand-gray">
            {t('menu.constructor.dishes.modal.tabs.pricing')}
          </span>
          <span className="font-extrabold text-sm text-brand-copper">
            {form.price || 0} {t('menu.currency')}
          </span>
        </div>
      </div>
    </div>
  );
};