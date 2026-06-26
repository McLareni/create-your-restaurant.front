'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { DishLivePreviewProps } from '@/features/menu-builder/types/dishes.types';

export const DishLivePreview = ({ form, imageUrl }: DishLivePreviewProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-64 rounded-2xl border border-solid border-neutral-200 dark:border-neutral-800 bg-bg-surface p-4 shadow-table sticky top-4 select-none text-text-main animate-in fade-in duration-300">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-bg-main border border-solid border-border-main/40 flex items-center justify-center mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={form.name || t('menu.constructor.dishes.modal.tabs.media')}
            fill
            unoptimized
            className="object-cover pointer-events-none select-none"
          />
        ) : (
          <ImageIcon className="h-6 w-6 text-text-muted/30" />
        )}
      </div>

      <div className="space-y-1.5 w-full">
        <h4 className="font-bold text-sm text-text-main truncate">
          {form.name || t('menu.constructor.dishes.modal.namePlaceholder')}
        </h4>
        
        <p className="text-[11px] text-text-muted font-light line-clamp-2 leading-tight min-h-8">
          {form.description || t('menu.constructor.dishes.modal.descPlaceholder')}
        </p>

        <div className="pt-2 border-t border-solid border-border-main/40 flex items-center justify-between w-full">
          <span className="text-[11px] font-medium text-text-muted opacity-80">
            {t('menu.constructor.dishes.modal.tabs.pricing')}
          </span>
          <span className="font-extrabold text-sm text-brand-emerald font-mono">
            {form.price || 0} {t('menu.currency')}
          </span>
        </div>
      </div>
    </div>
  );
};