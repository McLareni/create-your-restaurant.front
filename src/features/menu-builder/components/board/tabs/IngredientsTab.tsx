'use client';

import React from 'react';
import { Input, Button, Select } from '@/shared/ui';
import { Plus, Trash2, Carrot } from 'lucide-react';
import { useIngredientsTabLogic } from '@/features/menu-builder/hooks/dishes/useIngredientsTab';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { InventoryItem } from '@/features/menu-builder/types/inventory.types';
import type { IngredientsTabProps } from '@/features/menu-builder/types/dishes.types';

export const IngredientsTab = ({ dishForm, setDishForm }: IngredientsTabProps) => {
  const { t } = useTranslation();
  const state = useIngredientsTabLogic(dishForm, setDishForm);

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-100 h-full overflow-hidden select-none">
      <span className="text-xs font-bold flex items-center gap-2 shrink-0 text-brand-espresso dark:text-brand-cream uppercase tracking-wider">
        <Carrot className="h-4 w-4 text-brand-copper" /> {t('menu.constructor.dishes.modal.ingredients.title')}
      </span>
      
      <div className="grid grid-cols-12 gap-2 items-end bg-brand-cream/10 dark:bg-brand-gray/5 p-2.5 rounded-xl border border-brand-gray/10 shrink-0">
        <div className="col-span-6">
          <Select
            id="ing-select"
            label={t('menu.constructor.dishes.modal.ingredients.nameLabel')}
            value={state.selectedItemId}
            onChange={(e) => state.setSelectedItemId(e.target.value)}
            disabled={state.isLoading}
            className="h-9 text-xs"
          >
            <option value="" disabled hidden>
              {t('menu.constructor.dishes.modal.ingredients.selectPlaceholder')}
            </option>
            {state.inventoryItems?.map((item: InventoryItem) => (
              <option key={item.id} value={item.id}>
                {item.name} ({t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`)})
              </option>
            ))}
          </Select>
        </div>

        <div className="col-span-4">
          <Input
            id="ing-qty"
            type="number"
            step="any"
            label={t('menu.constructor.dishes.modal.ingredients.qtyLabel')}
            placeholder="0"
            value={state.quantity}
            onChange={(e) => state.setQuantity(e.target.value)}
            disabled={state.isLoading}
            className="h-9 text-xs"
          />
        </div>

        <div className="col-span-2">
          <Button
            type="button"
            variant="brand"
            onClick={state.handleAdd}
            disabled={state.isLoading || !state.selectedItemId || !state.quantity}
            className="w-full h-9 rounded-xl flex items-center justify-center cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 border border-brand-gray/10 rounded-xl p-3 bg-brand-cream/5 overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-36 max-h-60">
        {!dishForm.ingredients || dishForm.ingredients.length === 0 ? (
          <span className="text-xs text-brand-gray italic p-4 text-center block my-auto">
            {t('menu.constructor.dishes.modal.ingredients.empty')}
          </span>
        ) : (
          dishForm.ingredients.map((item: { name: string; quantity: number; unit: string; inventoryItemId: string | null }, idx: number) => (
            <div 
              key={item.inventoryItemId || idx} 
              className="flex items-center justify-between bg-white dark:bg-brand-mocha border border-brand-gray/10 px-3 py-2 rounded-xl shadow-xs animate-in slide-in-from-bottom-1 shrink-0"
            >
              <span className="text-xs font-semibold text-brand-espresso dark:text-brand-cream">
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-brand-cream/50 dark:bg-brand-gray/20 px-2 py-0.5 rounded text-brand-copper font-bold">
                  {item.quantity} {t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`) || item.unit}
                </span>
                <button 
                  type="button" 
                  onClick={() => state.handleRemove(idx)} 
                  className="text-brand-gray hover:text-red-500 transition-colors outline-none cursor-pointer p-1 rounded-md hover:bg-zinc-50 dark:hover:bg-brand-gray/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};