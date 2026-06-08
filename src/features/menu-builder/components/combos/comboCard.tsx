'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/shared/ui';
import type { ComboCardProps } from '@/features/menu-builder/types/combos.types';

export const ComboCard = ({ combo, allDishes, onEdit, onDelete }: ComboCardProps) => {
  const { t } = useTranslation();

  const resolvedDishes = combo.dishes.map((d) => {
    const found = allDishes.find((dish) => dish.id === d.dishId);
    return {
      id: d.dishId,
      name: found?.name || '',
      price: found?.price || 0,
    };
  });

  const calculateComboOriginalPrice = () => resolvedDishes.reduce((sum, dish) => sum + dish.price, 0);
  
  const calculateFinalPrice = () => {
    const original = calculateComboOriginalPrice();
    if (combo.priceType === 'FIXED') return combo.priceValue;
    return original - (original * combo.priceValue) / 100;
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4 shrink-0 relative z-10 group">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-cream dark:bg-brand-mocha/50 rounded-lg text-brand-copper">
            <PackagePlus className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-brand-espresso dark:text-brand-cream text-lg line-clamp-1">{combo.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            type="button"
            onClick={() => onEdit(combo)} 
            className="p-1.5 text-brand-gray dark:text-brand-gray/80 hover:text-brand-copper outline-none bg-white dark:bg-brand-espresso rounded-md shadow-sm border border-transparent dark:border-brand-gray/20 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button 
            type="button"
            onClick={() => onDelete(combo.id)} 
            className="p-1.5 text-brand-gray dark:text-brand-gray/80 hover:text-red-500 outline-none bg-white dark:bg-brand-espresso rounded-md shadow-sm border border-transparent dark:border-brand-gray/20 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4 flex-1 relative z-0">
        {resolvedDishes.map((dish) => (
          <div key={dish.id} className="text-sm text-brand-gray dark:text-brand-gray/80 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand-gray/40 dark:bg-brand-gray/60 shrink-0" />
            <span className="truncate">{dish.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-brand-gray/10 dark:border-brand-gray/20 pt-3 flex items-center justify-between relative z-0">
        <div className="flex flex-col">
          <span className="text-xs text-brand-gray dark:text-brand-gray/60 line-through">
            {calculateComboOriginalPrice()} {t('menu.currency')}
          </span>
          <span className="font-bold text-brand-copper">
            {calculateFinalPrice()} {t('menu.currency')}
          </span>
        </div>
        <span className="text-xs font-medium bg-brand-copper/10 text-brand-copper px-2 py-1 rounded">
          {combo.priceType === 'FIXED' 
            ? t('menu.constructor.combos.modal.typeFixed') 
            : `-${combo.priceValue}%`}
        </span>
      </div>
    </Card>
  );
};