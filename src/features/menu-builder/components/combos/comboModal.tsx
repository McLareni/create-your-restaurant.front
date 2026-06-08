'use client';

import React from 'react';
import { Button, FloatingPanel, Input, Select, Checkbox } from '@/shared/ui';
import type { ComboModalProps, ComboDishSelect } from '@/features/menu-builder/types/combos.types';
import type { Dish } from '@/features/menu-builder/types/dishes.types';

export const ComboModal = ({ state }: ComboModalProps) => {
  if (!state.isModalOpen) return null;

  const handleFormAction = () => {
    void state.handleSave();
  };

  return (
    <FloatingPanel 
      panelId="combo-pack-panel" 
      isOpen={state.isModalOpen} 
      onClose={() => !state.isSubmitting && state.setIsModalOpen(false)} 
      title={state.editingCombo ? state.t('menu.constructor.combos.modal.editTitle') : state.t('menu.constructor.combos.modal.createTitle')} 
      className="w-160 border-brand-copper/20 max-h-[calc(100vh-40px)] flex flex-col" 
    >
      <form action={handleFormAction} className="flex flex-col text-brand-espresso dark:text-brand-cream w-full max-h-[calc(100vh-140px)] justify-start gap-4 overflow-hidden">
        <Input 
          id="combo-name" 
          label={state.t('menu.constructor.combos.modal.nameLabel')} 
          placeholder={state.t('menu.constructor.combos.modal.namePlaceholder')} 
          value={state.name} 
          onChange={(e) => state.setName(e.target.value)} 
          disabled={state.isSubmitting} 
          error={state.errors.name} 
        />
        
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <Select 
            id="combo-type" 
            label={state.t('menu.constructor.combos.modal.priceTypeLabel')} 
            value={state.priceType} 
            onChange={(e) => state.setPriceType(e.target.value as 'FIXED' | 'DISCOUNT')} 
            disabled={state.isSubmitting} 
            className="h-11 text-xs" 
          >
            <option value="FIXED">{state.t('menu.constructor.combos.modal.typeFixed')}</option>
            <option value="DISCOUNT">{state.t('menu.constructor.combos.modal.typeDiscount')}</option>
          </Select>
          <Input 
            id="combo-value" 
            type="number" 
            label={state.t('menu.constructor.combos.modal.priceValueLabel')} 
            value={state.priceValue === 0 ? '' : state.priceValue} 
            onChange={(e) => state.setPriceValue(Math.max(0, parseFloat(e.target.value) || 0))} 
            disabled={state.isSubmitting} 
            className="h-11 text-xs" 
            error={state.errors.priceValue} 
          />
        </div>

        <div className="flex flex-col gap-2 mt-1 overflow-hidden flex-1 min-h-0">
          <div className="flex flex-col gap-1.5 shrink-0">
            <Select 
              id="dishSelector" 
              label={state.t('menu.constructor.combos.modal.searchLabel')} 
              value="" 
              onChange={(e) => { 
                state.handleAddDish(e.target.value);
                e.target.value = ''; 
              }} 
              disabled={state.isSubmitting || state.isDishesLoading} 
              className="h-11 text-xs" 
            >
              <option value="" disabled hidden>{state.t('menu.constructor.combos.modal.searchPlaceholder')}</option>
              {state.allDishes
                .filter((d: Dish) => !(state.selectedDishes || []).some((fd) => fd.id === d.id))
                .map((d: Dish) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.price} {state.t('menu.constructor.dishes.modal.priceLabel')})
                  </option>
                ))
              }
            </Select>
          </div>

          <label className="text-sm font-semibold text-brand-espresso dark:text-brand-cream mt-2 shrink-0">
            {state.t('menu.constructor.combos.modal.includedDishes')}
          </label>
          {state.errors.dishIds && <span className="text-xs text-red-500 font-medium shrink-0">{state.errors.dishIds}</span>}

          <div className="grid grid-cols-1 gap-2 p-3 rounded-xl border border-brand-gray/10 bg-brand-cream/5 overflow-y-auto custom-scrollbar flex-1">
            {state.isDishesLoading ? (
              <span className="text-xs text-brand-gray animate-pulse p-2 block text-center my-auto">{state.t('common.loading')}</span>
            ) : state.selectedDishes.length === 0 ? (
              <span className="text-xs text-brand-gray italic p-4 text-center block my-auto">
                {state.t('menu.constructor.combos.modal.emptyIncluded')}
              </span>
            ) : (
              state.selectedDishes.map((dish: ComboDishSelect) => (
                <div key={dish.id} className="bg-white dark:bg-brand-mocha p-2.5 rounded-lg border border-brand-gray/10 flex items-center justify-between shadow-xs shrink-0 animate-in fade-in duration-100">
                  <span className="text-xs font-semibold text-brand-espresso dark:text-brand-cream">{dish.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-copper">{dish.price} {state.t('menu.currency')}</span>
                    <Checkbox 
                      id={`combo-dish-${dish.id}`} 
                      checked={true} 
                      onChange={(e) => state.handleToggleDish(dish, e.target.checked)} 
                      disabled={state.isSubmitting} 
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 mt-auto border-t border-brand-gray/10 shrink-0">
          <Button type="button" variant="ghost" onClick={() => state.setIsModalOpen(false)} disabled={state.isSubmitting} className="h-9 text-xs font-semibold">
            {state.t('menu.constructor.combos.modal.cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="brand" 
            disabled={state.isSubmitting || !state.name.trim() || state.selectedDishes.length === 0} 
            className="px-5 h-9 text-xs font-bold shadow-md" 
          >
            {state.t('menu.constructor.combos.modal.save')}
          </Button>
        </div>
      </form>
    </FloatingPanel>
  );
};