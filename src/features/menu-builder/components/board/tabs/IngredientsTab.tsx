'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Carrot, ChevronDown, Check } from 'lucide-react';
import { useIngredientsTabLogic } from '@/features/menu-builder/hooks/dishes/useIngredientsTab';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { InventoryItem } from '@/features/menu-builder/types/inventory.types';
import type { IngredientsTabProps } from '@/features/menu-builder/types/dishes.types';

export const IngredientsTab = ({ dishForm, setDishForm }: IngredientsTabProps) => {
  const { t } = useTranslation();
  const state = useIngredientsTabLogic(dishForm, setDishForm);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSelected = state.inventoryItems?.find((item: InventoryItem) => item.id === state.selectedItemId);

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden select-none text-text-main">
      <span className="text-xs font-bold flex items-center gap-2 shrink-0 text-text-main/80 uppercase tracking-wider">
        <Carrot className="h-4 w-4 text-brand-emerald" />
        {t('menu.constructor.dishes.modal.ingredients.title')}
      </span>
      
      <div className="grid grid-cols-12 gap-2.5 items-end bg-bg-main/50 p-3 rounded-xl border border-solid border-neutral-300 dark:border-neutral-700 shrink-0 overflow-visible">
        <div className="col-span-6 flex flex-col gap-1 relative overflow-visible" ref={dropdownRef}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">
            {t('menu.constructor.dishes.modal.ingredients.nameLabel')}
          </span>
          <button
            type="button"
            onClick={() => !state.isLoading && setIsDropdownOpen(!isDropdownOpen)}
            className={`h-9 w-full rounded-xl bg-bg-surface border border-solid border-neutral-300 dark:border-neutral-700 text-xs text-text-main px-3 flex items-center justify-between transition-all select-none outline-none ${
              state.isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600'
            } ${isDropdownOpen ? 'border-brand-emerald! ring-1 ring-brand-emerald/20' : ''}`}
          >
            <span className="truncate font-medium">
              {currentSelected 
                ? `${currentSelected.name} (${t(`menu.constructor.dishes.modal.ingredients.units.${currentSelected.unit}`)})`
                : t('menu.constructor.dishes.modal.ingredients.selectPlaceholder')
              }
            </span>
            <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-brand-emerald' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-hidden bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-md flex flex-col p-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-0.5 max-h-46">
                {state.inventoryItems?.map((item: InventoryItem) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      state.setSelectedItemId(item.id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 h-9 rounded-lg hover:bg-bg-hover text-left transition-colors cursor-pointer group/item outline-none border-0 text-xs font-medium text-text-main shrink-0"
                  >
                    <span className="group-hover/item:text-brand-emerald transition-colors truncate">
                      {item.name} ({t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`)})
                    </span>
                    {state.selectedItemId === item.id && <Check className="h-3.5 w-3.5 text-brand-emerald shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4 flex flex-col gap-1">
          <label htmlFor="ing-qty" className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">
            {t('menu.constructor.dishes.modal.ingredients.qtyLabel')}
          </label>
          <input
            id="ing-qty"
            type="number"
            step="any"
            placeholder="0"
            value={state.quantity}
            onChange={(e) => state.setQuantity(e.target.value)}
            disabled={state.isLoading}
            className="h-9 w-full rounded-xl bg-bg-surface border border-solid border-neutral-300 dark:border-neutral-700 text-xs text-text-main px-3.5 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-all outline-none placeholder:text-text-muted/40"
          />
        </div>

        <div className="col-span-2">
          <button
            type="button"
            onClick={state.handleAdd}
            disabled={state.isLoading || !state.selectedItemId || !state.quantity}
            className="w-full h-9 rounded-xl flex items-center justify-center bg-brand-emerald hover:bg-brand-emerald-hover text-white shadow-md border border-brand-emerald/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-solid border-neutral-300 dark:border-neutral-700 bg-bg-main/30 overflow-hidden flex-1 min-h-36">
        <div className="flex flex-col gap-2 p-2 pr-3 h-full overflow-y-auto custom-scrollbar">
          {!dishForm.ingredients || dishForm.ingredients.length === 0 ? (
            <span className="text-xs text-text-muted/50 italic p-4 text-center block my-auto font-light">
              {t('menu.constructor.dishes.modal.ingredients.empty')}
            </span>
          ) : (
            dishForm.ingredients.map((item: { name: string; quantity: number; unit: string; inventoryItemId: string | null }, idx: number) => (
              <div 
                key={item.inventoryItemId || idx} 
                className="flex items-center justify-between bg-bg-surface border border-solid border-border-main/50 px-3 py-2.5 rounded-xl shadow-2xs shrink-0 transition-colors hover:border-brand-emerald/20"
              >
                <span className="text-xs font-semibold text-text-main">
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-bg-element/60 dark:bg-neutral-800/40 px-2 py-0.5 rounded text-brand-emerald font-bold">
                    {item.quantity} {t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`) || item.unit}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => state.handleRemove(idx)} 
                    className="text-text-muted/40 hover:text-red-500 transition-colors outline-none cursor-pointer p-1 rounded-lg hover:bg-red-500/5 border-0 bg-transparent"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};