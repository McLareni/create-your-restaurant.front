'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { Combo } from '../types/combos.types';
import { Card } from '@/shared/ui';

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
    <Card className="!p-5">
      <div className="flex items-start justify-between mb-4 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-cream rounded-lg text-brand-copper"><PackagePlus className="h-5 w-5" /></div>
          <h3 className="font-semibold text-brand-espresso text-lg line-clamp-1">{combo.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(combo)} className="p-1.5 text-brand-gray hover:text-brand-copper outline-none bg-white rounded-md shadow-sm"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(combo.id)} className="p-1.5 text-brand-gray hover:text-red-500 outline-none bg-white rounded-md shadow-sm"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4 flex-1 relative z-0">
        {combo.dishes.map(dish => (
          <div key={dish.id} className="text-sm text-brand-gray flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand-gray/40 shrink-0"></span><span className="truncate">{dish.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-brand-gray/10 pt-3 flex items-center justify-between relative z-0">
        <div className="flex flex-col">
          <span className="text-xs text-brand-gray line-through">{calculateComboOriginalPrice(combo)} {t('menu.currency')}</span>
          <span className="font-bold text-brand-copper">{calculateFinalPrice(combo)} {t('menu.currency')}</span>
        </div>
        <span className="text-xs font-medium bg-brand-copper/10 text-brand-copper px-2 py-1 rounded">
          {combo.priceType === 'FIXED' ? t('menu.constructor.combos.modal.typeFixed') : `-${combo.priceValue}%`}
        </span>
      </div>
    </Card>
  );
};