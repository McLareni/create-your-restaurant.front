'use client';

import { Checkbox } from '@/shared/ui';
import { Sparkles } from 'lucide-react';
import { DishFormValues } from '../../../schemas/dishes.schema';
import { useAvailableDishesList } from '../../../hooks/useAvailableDishesList';

interface UpsellTabProps {
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
  currentDishId?: string;
}

export const UpsellTab = ({ dishForm, setDishForm, currentDishId }: UpsellTabProps) => {
  const { dishes, isLoading } = useAvailableDishesList(currentDishId);

  if (isLoading) {
    return <div className="h-20 bg-brand-gray/5 animate-pulse rounded-xl"></div>;
  }

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-100">
      <span className="text-xs font-semibold flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-copper" /> Рекомендації Cross-Sell / Upsell
      </span>
      <div className="grid grid-cols-2 gap-2 p-2 rounded-xl border border-brand-gray/10 bg-brand-cream/10 dark:bg-brand-gray/5 max-h-40 overflow-y-auto custom-scrollbar">
        {dishes.length === 0 ? (
          <div className="col-span-2 text-center p-4 text-xs text-brand-gray italic">Немає інших страв для рекомендацій</div>
        ) : (
          dishes.map(dish => (
            <div key={dish.id} className="bg-white dark:bg-brand-mocha border border-brand-gray/10 p-2 rounded-lg shadow-xs">
              <Checkbox
                id={`upsell-${dish.id}`}
                label={
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-brand-espresso dark:text-brand-cream line-clamp-1">{dish.name}</span>
                    <span className="text-[10px] text-brand-gray">{dish.price} ₴</span>
                  </div>
                }
                checked={dishForm.upsellDishIds?.includes(dish.id)}
                onChange={(e) => {
                  const currentIds = dishForm.upsellDishIds || [];
                  if (e.target.checked) {
                    setDishForm({ ...dishForm, upsellDishIds: [...currentIds, dish.id] });
                  } else {
                    setDishForm({ ...dishForm, upsellDishIds: currentIds.filter(id => id !== dish.id) });
                  }
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};