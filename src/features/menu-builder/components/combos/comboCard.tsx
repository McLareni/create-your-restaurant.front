'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import type { ComboCardProps } from '@/features/menu-builder/types/combos.types';

export const ComboCard = ({ combo, allDishes, onEdit, onDelete }: ComboCardProps) => {
  const { t } = useTranslation();
  const { canEditMenu, canDeleteMenu } = usePermissions();

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
    const final = original - (original * combo.priceValue) / 100;
    return Math.round(final * 100) / 100;
  };

  return (
    <Card className="p-5 bg-bg-surface border border-border-main/60 dark:border-border-main rounded-2xl shadow-table hover:shadow-md transition-all duration-300 flex flex-col h-full group select-none overflow-hidden relative z-0">
      <div className="flex items-start justify-between gap-4 mb-3 relative z-10 h-8">
        <h3 className="font-bold text-text-main text-base line-clamp-1 flex-1 self-center">
          {combo.name}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 shrink-0 bg-bg-surface/90 backdrop-blur-xs p-0.5 rounded-lg border border-border-main/40">
          {canEditMenu && (
            <button
              type="button"
              onClick={() => onEdit(combo)}
              className="p-1.5 rounded-md text-text-muted hover:text-brand-emerald hover:bg-bg-element transition-colors duration-200 cursor-pointer outline-none border-0 bg-transparent"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {canDeleteMenu && (
            <button
              type="button"
              onClick={() => onDelete(combo.id)}
              className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-md shadow-2xs border border-transparent transition-colors duration-200 cursor-pointer outline-none"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
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
        <span className="text-[10px] font-bold bg-brand-emerald/10 text-brand-emerald px-2 py-0.5 rounded-md shrink-0">
          {combo.priceType === 'FIXED' ? t('menu.constructor.combos.modal.typeFixed') : `-${combo.priceValue}%`}
        </span>
      </div>
    </Card>
  );
};