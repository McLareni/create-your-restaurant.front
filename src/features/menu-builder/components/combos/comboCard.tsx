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
    <Card className="p-5 bg-bg-surface border border-border-main/60 dark:border-border-main rounded-2xl shadow-table hover:shadow-md transition-all duration-300 flex flex-col h-full group select-none relative">
      <div className="flex items-start justify-between mb-4 shrink-0 relative z-10">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg shrink-0">
            <PackagePlus className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-text-main text-base truncate flex-1">{combo.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            type="button"
            onClick={() => onEdit(combo)} 
            className="p-1.5 text-text-muted hover:text-brand-emerald bg-bg-element rounded-md shadow-2xs border border-transparent transition-colors duration-200 cursor-pointer outline-none"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button 
            type="button"
            onClick={() => onDelete(combo.id)} 
            className="p-1.5 text-text-muted hover:text-red-500 bg-bg-element rounded-md shadow-2xs border border-transparent transition-colors duration-200 cursor-pointer outline-none"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-4 flex-1 relative z-0">
        {resolvedDishes.map((dish) => (
          <div key={dish.id} className="text-sm text-text-muted flex items-center gap-2 font-light">
            <span className="w-1 h-1 rounded-full bg-text-muted/40 shrink-0" />
            <span className="truncate">{dish.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-border-main/60 pt-3 flex items-center justify-between relative z-0 h-10">
        <div className="flex flex-col justify-center">
          <span className="text-[11px] text-text-muted/60 line-through leading-none">
            {calculateComboOriginalPrice()} {t('menu.currency')}
          </span>
          <span className="font-bold text-text-main text-sm mt-0.5 leading-none">
            {calculateFinalPrice()} {t('menu.currency')}
          </span>
        </div>
        <span className="text-[10px] font-bold bg-brand-emerald/10 text-brand-emerald px-2 py-0.5 rounded border border-brand-emerald/5 uppercase tracking-wide">
          {combo.priceType === 'FIXED' 
            ? t('menu.constructor.combos.modal.typeFixed') 
            : `-${combo.priceValue}%`}
        </span>
      </div>
    </Card>
  );
};