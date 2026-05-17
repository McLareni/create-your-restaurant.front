'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { Combo } from '../types/combos.types';

interface ComboCardProps {
  combo: Combo;
  onEdit: (combo: Combo) => void;
  onDelete: (id: string) => void;
}

export const ComboCard = ({ combo, onEdit, onDelete }: ComboCardProps) => {
  const { t } = useTranslation();

  const calculateComboOriginalPrice = (c: Combo) => c.dishes.reduce((sum, dish) => sum + dish.price, 0);
  const calculateFinalPrice = (c: Combo) => {
    const original = calculateComboOriginalPrice(c);
    if (c.priceType === 'FIXED') return c.priceValue;
    return original - (original * c.priceValue) / 100;
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-brand-gray/20 bg-white p-5 hover:border-brand-copper/50 transition-colors shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-cream rounded-lg text-brand-copper"><PackagePlus className="h-5 w-5" /></div>
          <h3 className="font-semibold text-brand-espresso text-lg">{combo.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(combo)} className="p-1.5 text-brand-gray hover:text-brand-copper outline-none"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(combo.id)} className="p-1.5 text-brand-gray hover:text-red-500 outline-none"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4 flex-1">
        {combo.dishes.map(dish => (
          <div key={dish.id} className="text-sm text-brand-gray flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand-gray/40 shrink-0"></span><span className="truncate">{dish.name}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-gray/10 pt-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-brand-gray line-through">{calculateComboOriginalPrice(combo)} ₴</span>
          <span className="font-bold text-brand-copper">{calculateFinalPrice(combo)} ₴</span>
        </div>
        <span className="text-xs font-medium bg-brand-copper/10 text-brand-copper px-2 py-1 rounded">
          {combo.priceType === 'FIXED' ? t('menu.constructor.combos.modal.typeFixed') : `-${combo.priceValue}%`}
        </span>
      </div>
    </div>
  );
};