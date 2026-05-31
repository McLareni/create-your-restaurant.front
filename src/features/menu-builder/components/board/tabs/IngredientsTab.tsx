'use client';

import { Input, Button, Select } from '@/shared/ui';
import { Plus, Trash2, Carrot } from 'lucide-react';
import { useIngredientsTabLogic } from '../../../hooks/dishes/useIngredientsTab';
import { InventoryItem } from '../../../types/inventory.types';
import { IngredientsTabProps } from '../../../types/dishes.types';

export const IngredientsTab = ({ dishForm, setDishForm }: IngredientsTabProps) => {
  const state = useIngredientsTabLogic(dishForm, setDishForm);

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-100 h-full overflow-hidden select-none">
      <span className="text-xs font-semibold flex items-center gap-2 shrink-0 text-brand-espresso dark:text-brand-cream">
        <Carrot className="h-4 w-4 text-brand-copper" /> {state.t('menu.constructor.dishes.modal.ingredients.title')}
      </span>
      
      <div className="grid grid-cols-12 gap-2 items-end bg-brand-cream/10 dark:bg-brand-gray/5 p-2.5 rounded-xl border border-brand-gray/10 shrink-0">
        <div className="col-span-6">
          <Select
            id="ing-select"
            label={state.t('menu.constructor.dishes.modal.ingredients.nameLabel')}
            value={state.selectedItemId}
            onChange={(e) => state.setSelectedItemId(e.target.value)}
            className="h-9 text-xs"
            disabled={state.isLoading}
          >
            <option value="" disabled hidden>
              {state.isLoading ? state.t('common.loading') : state.t('menu.constructor.dishes.modal.ingredients.selectPlaceholder')}
            </option>
            {state.inventoryItems.map((item: InventoryItem) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.stock} {state.t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`)})
              </option>
            ))}
          </Select>
        </div>

        <div className="col-span-3">
          <Input
            id="ing-qty"
            type="number"
            step="any"
            label={state.t('menu.constructor.dishes.modal.ingredients.qtyLabel')}
            placeholder="0.1"
            value={state.quantity}
            onChange={(e) => state.setQuantity(e.target.value)}
            className="h-9 text-xs text-center border-brand-gray/30"
          />
        </div>

        <div className="col-span-2">
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-xs font-medium text-brand-espresso dark:text-brand-cream truncate">
              {state.t('menu.constructor.dishes.modal.ingredients.unitLabel')}
            </span>
            <div className="h-9 w-full rounded-md border border-brand-gray/30 dark:border-brand-gray/50 bg-brand-cream/20 flex items-center justify-center text-xs font-bold text-brand-copper">
              {state.currentInventoryItem ? state.t(`menu.constructor.dishes.modal.ingredients.units.${state.currentInventoryItem.unit}`) || state.currentInventoryItem.unit : '—'}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <Button 
            variant="brand" 
            type="button" 
            onClick={state.handleAdd} 
            className="h-9 w-full rounded-md px-0 shadow-sm"
            disabled={!state.selectedItemId || !state.quantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-brand-gray/10 bg-brand-cream/5 flex-1 overflow-y-auto custom-scrollbar">
        {(!dishForm.ingredients || dishForm.ingredients.length === 0) ? (
          <span className="text-xs text-brand-gray italic p-4 text-center block my-auto">
            {state.t('menu.constructor.dishes.modal.ingredients.empty')}
          </span>
        ) : (
          dishForm.ingredients.map((item: any, idx: number) => (
            <div key={item.inventoryItemId || idx} className="flex items-center justify-between bg-white dark:bg-brand-mocha border border-brand-gray/10 px-3 py-2 rounded-xl shadow-xs animate-in slide-in-from-bottom-1 shrink-0">
              <span className="text-xs font-bold text-brand-espresso dark:text-brand-cream">
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-brand-cream/50 dark:bg-brand-gray/20 px-2 py-0.5 rounded text-brand-copper font-bold">
                  {item.quantity} {state.t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`) || item.unit}
                </span>
                <button 
                  type="button" 
                  onClick={() => state.handleRemove(idx)} 
                  className="text-brand-gray hover:text-red-500 transition-colors outline-none"
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