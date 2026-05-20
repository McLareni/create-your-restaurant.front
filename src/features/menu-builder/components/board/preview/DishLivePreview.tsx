'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { ImageIcon } from 'lucide-react';
import { DishFormValues } from '../../../schemas/dishes.schema';

interface DishLivePreviewProps {
  form: DishFormValues;
}

export const DishLivePreview = ({ form }: DishLivePreviewProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-44 shrink-0 border border-brand-gray/20 rounded-xl bg-white dark:bg-brand-mocha shadow-xs overflow-hidden flex flex-col h-full self-start">
      <div className="relative aspect-video w-full bg-brand-cream/40 flex items-center justify-center border-b border-brand-gray/5">
        <ImageIcon className="h-4 w-4 text-brand-gray/20" />
        {form.badge && form.badge !== 'NONE' && (
          <div className="absolute top-1 right-1 bg-brand-copper/10 text-brand-copper border border-brand-copper/20 rounded px-1 text-[8px] font-bold uppercase tracking-wide">
            {t(`menu.constructor.badges.${form.badge}`)}
          </div>
        )}
      </div>
      <div className="p-2 flex flex-col flex-1">
        <h4 className="font-bold text-[11px] text-brand-espresso dark:text-brand-cream truncate mb-0.5">
          {form.name || t('menu.constructor.dishes.modal.namePlaceholder')}
        </h4>
        <div className="flex flex-wrap gap-0.5 mb-1 h-3.5 overflow-hidden">
          {form.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[7px] font-bold bg-brand-cream text-brand-copper px-1 rounded border border-brand-gray/10">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-brand-gray line-clamp-2 leading-tight min-h-6 mb-1.5">
          {form.description || t('menu.constructor.dishes.modal.descPlaceholder')}
        </p>
        <div className="mt-auto pt-1 border-t border-brand-gray/5 flex justify-between items-center">
          <span className="font-bold text-xs text-brand-copper">
            {form.variants && form.variants.length > 0 
              ? `${t('menu.constructor.dishes.moreBtn' as any) || 'від'} ${form.variants[0].price}` 
              : form.price || 0} {t('menu.currency')}
          </span>
          {!form.isAvailable && (
            <span className="text-[8px] font-bold text-red-500 bg-red-50 px-1 rounded border border-red-100">STOP</span>
          )}
        </div>
      </div>
    </div>
  );
};