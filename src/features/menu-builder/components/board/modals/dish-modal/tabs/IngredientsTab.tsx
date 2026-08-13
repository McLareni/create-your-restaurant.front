'use client';

import React, { useState, useRef } from 'react';
import { Plus, Trash2, Carrot, ChevronDown, Check } from 'lucide-react';
import { useIngredientsTabLogic } from '@/features/menu-builder/hooks/dishes/useIngredientsTab';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { InventoryItem } from '@/features/menu-builder/types/inventory.types';
import type { IngredientsTabProps } from '@/features/menu-builder/types/dishes.types';
import { useClickOutside } from '@/shared/hooks/useClickOutside';

export const IngredientsTab = ({ dishForm, setDishForm }: IngredientsTabProps) => {
  const { t } = useTranslation();
  const state = useIngredientsTabLogic(dishForm, setDishForm);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const currentSelected = state.inventoryItems?.find((item: InventoryItem) => item.id === state.selectedItemId);

  const handleSelectToggle = () => {
    if (state.isLoading) return;
    setIsDropdownOpen((prev) => !prev);
  };

  const handleItemSelect = (id: string) => {
    state.setSelectedItemId(id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-100 select-none text-text-main">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-bg-main/20 p-4 border border-solid border-border-main/40 rounded-2xl relative z-40">
        <div className="sm:col-span-2 flex flex-col gap-1.5 relative" ref={dropdownRef}>
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">
            {t('menu.constructor.dishes.modal.ingredients.selectLabel')}
          </span>
          <div
            onClick={handleSelectToggle}
            className={`h-11 w-full bg-bg-surface border border-solid border-border-main/60 text-xs text-text-main px-4 flex items-center justify-between transition-all rounded-xl ${
              state.isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600'
            } ${isDropdownOpen ? 'border-brand-emerald! ring-1 ring-brand-emerald/20' : ''}`}
          >
            <span className="font-semibold truncate">
              {currentSelected ? currentSelected.name : t('menu.constructor.dishes.modal.ingredients.selectPlaceholder')}
            </span>
            <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-brand-emerald' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-bg-surface border border-solid border-border-main/60 shadow-lg flex flex-col max-h-48 overflow-y-auto p-1 rounded-xl custom-scrollbar">
              {state.inventoryItems?.length === 0 ? (
                <span className="text-xs text-text-muted italic p-3 text-center font-light">{t('menu.constructor.dishes.modal.notFound')}</span>
              ) : (
                state.inventoryItems?.map((item: InventoryItem) => {
                  const isCurrent = state.selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemSelect(item.id)}
                      className="w-full flex items-center justify-between px-3 h-10 hover:bg-bg-hover text-left text-xs font-semibold text-text-main rounded-lg transition-colors"
                    >
                      <span className="truncate pr-4">{item.name}</span>
                      {isCurrent && <Check className="h-4 w-4 text-brand-emerald shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2.5 items-end w-full">
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">
              {t('menu.constructor.dishes.modal.ingredients.quantityLabel')}
            </span>
            <div className="relative flex items-center w-full">
              <input
                type="number"
                placeholder="0"
                value={state.quantity}
                onChange={(e) => state.setQuantity(e.target.value)}
                disabled={state.isLoading || !state.selectedItemId}
                className="h-11 w-full bg-bg-surface border border-solid border-border-main/60 rounded-xl px-4 text-xs font-semibold text-text-main outline-none transition-all focus:border-brand-emerald/50 disabled:opacity-50 disabled:cursor-not-allowed pr-14"
              />
              <span className="absolute right-4 text-xs font-bold text-text-muted/70 select-none bg-bg-main/40 px-2 py-0.5 rounded border border-solid border-border-main/20">
                {currentSelected ? t(`menu.constructor.dishes.modal.ingredients.units.${currentSelected.unit}`) || currentSelected.unit : '—'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={state.handleAdd}
            disabled={state.isLoading || !state.selectedItemId || !state.quantity || parseFloat(state.quantity) <= 0}
            className="h-11 w-11 bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl shadow-md flex items-center justify-center shrink-0 border-0 outline-none cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5 pl-1">
          <Carrot className="h-4 w-4 text-brand-emerald" />
          {t('menu.constructor.dishes.modal.ingredients.listTitle')}
        </span>
        <div className="border border-solid border-border-main/40 p-2 bg-bg-main/5 h-44 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar rounded-xl">
          {!dishForm.ingredients || dishForm.ingredients.length === 0 ? (
            <span className="text-xs text-text-muted/50 italic text-center py-12 m-auto font-light">
              {t('menu.constructor.dishes.modal.ingredients.empty')}
            </span>
          ) : (
            dishForm.ingredients.map((item, idx: number) => (
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