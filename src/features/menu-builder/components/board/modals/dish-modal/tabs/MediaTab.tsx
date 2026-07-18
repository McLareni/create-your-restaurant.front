'use client';

import React from 'react';
import type { ChangeEvent } from 'react';
import Image from 'next/image';
import type { UseDishModalReturn } from '@/features/menu-builder/types/dishes.types';

interface MediaTabProps {
  state: UseDishModalReturn;
  t: (key: string) => string;
}

export const MediaTab = ({ state, t }: MediaTabProps) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-100">
      <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-center bg-bg-main/40 hover:border-brand-emerald/40 transition-colors">
        <input
          type="file"
          id="dish-photo-upload"
          multiple
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            void state.handleLocalImageUploadWrapper(e);
          }}
          className="hidden"
        />
        <label
          htmlFor="dish-photo-upload"
          className="cursor-pointer text-xs text-brand-emerald font-bold uppercase tracking-wider select-none block w-full h-full py-2"
        >
          {t('menu.constructor.dishes.modal.mediaHint')}
        </label>
      </div>

      {state.dishImageUrls.length > 0 && (
        <div className="space-y-4">
          <div className="relative h-64 w-full rounded-xl overflow-hidden border border-solid border-border-main/60 bg-neutral-900/10 shadow-inner flex items-center justify-center">
            <Image
              src={state.dishImageUrls[state.activeDishImageIndex]}
              alt="active dish image preview"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <div className="flex gap-2 justify-end">
            {state.activeDishImageIndex !== 0 && (
              <button
                type="button"
                onClick={() => state.handleSetAsMainImage(state.activeDishImageIndex)}
                className="h-7 px-3 text-[10px] font-bold text-text-main border border-solid border-border-main/80 hover:bg-bg-hover rounded-lg transition-all cursor-pointer bg-transparent"
              >
                {t('menu.constructor.dishes.modal.media.setAsMainBtn')}
              </button>
            )}
            <button
              type="button"
              onClick={() => state.handleRemoveImage(state.activeDishImageIndex)}
              className="h-7 px-3 text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all shadow-sm cursor-pointer border-0"
            >
              {t('menu.constructor.dishes.modal.media.deletePhotoBtn')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center max-h-24 overflow-y-auto p-1 custom-scrollbar">
            {state.dishImageUrls.map((url, idx) => (
              <div
                key={url}
                className="relative h-12 w-12 rounded-lg border-2 border-solid transition-all shrink-0 group"
              >
                <div
                  onClick={() => state.handleSelectDishImage(idx)}
                  className={`absolute inset-0 z-10 cursor-pointer overflow-hidden rounded-md ${
                    state.activeDishImageIndex === idx
                      ? 'border-brand-emerald border-2 ring-1 ring-brand-emerald/20 shadow-xs'
                      : 'border-transparent'
                  }`}
                >
                  <Image src={url} alt="thumbnail" fill unoptimized className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};