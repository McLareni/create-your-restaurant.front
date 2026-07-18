'use client';

import React, { useState, useRef, useMemo } from 'react';
import { FloatingPanel, Checkbox, Input, FloatingSidePanel, SearchInput } from '@/shared/ui';
import { PriceInput } from '@/shared/ui/forms/PriceInput';
import { FormActionsFooter } from '@/shared/ui/formActionsFooter';
import { ChevronDown, Check, X, Plus } from 'lucide-react';
import type { ComboModalProps } from '@/features/menu-builder/types/combos.types';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import { useClickOutside } from '@/shared/hooks/useClickOutside';

export const ComboModal = ({ state }: ComboModalProps) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [dishSearchQuery, setDishSearchQuery] = useState('');
  const [priceValue, setPriceValue] = useState<number>(state.editingCombo?.priceValue ?? 0);
  
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(typeDropdownRef, () => setIsTypeDropdownOpen(false));

  const filteredAvailableDishes = useMemo(() => {
    return state.allDishes.filter((d: Dish) =>
      d.name.toLowerCase().includes(dishSearchQuery.toLowerCase())
    );
  }, [state.allDishes, dishSearchQuery]);

  if (!state.isModalOpen) return null;

  return (
    <>
      <FloatingPanel
        panelId="combo-editor-panel"
        isOpen={state.isModalOpen}
        onClose={() => state.setIsModalOpen(false)}
        title={state.editingCombo ? state.t('menu.constructor.combos.modal.editTitle') : state.t('menu.constructor.combos.modal.createTitle')}
        className="main-combo-panel max-w-xl animate-in fade-in duration-200"
      >
        <form 
          key={state.modalSessionKey}
          action={state.formAction} 
          className="flex flex-col gap-4 text-text-main w-full pb-16 [&_input:not([type=checkbox])]:bg-bg-main/60! [&_input:not([type=checkbox])]:text-text-main! [&_input:not([type=checkbox])]:border-border-main/60! [&_input:not([type=checkbox])]:w-full [&_input:not([type=checkbox])]:focus:border-brand-emerald/50!"
        >
          <input type="hidden" name="priceType" value={state.priceType} />
          <input type="hidden" name="selectedDishesData" value={JSON.stringify(state.selectedDishes)} />

          <Input
            id="combo-name-field"
            name="name"
            label={state.t('menu.constructor.combos.modal.nameLabel')}
            placeholder={state.t('menu.constructor.combos.modal.namePlaceholder')}
            defaultValue={state.editingCombo?.name || ''}
            error={state.errors.name}
            disabled={state.isSubmitting}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 relative" ref={typeDropdownRef}>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">
                {state.t('menu.constructor.combos.modal.priceTypeLabel')}
              </span>
              <div
                onClick={() => !state.isSubmitting && setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className={`h-11 w-full bg-bg-main/40 border border-solid border-border-main/60 text-xs text-text-main px-4 flex items-center justify-between transition-all select-none rounded-lg ${
                  state.isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600'
                } ${isTypeDropdownOpen ? 'border-brand-emerald! ring-1 ring-brand-emerald/20 bg-bg-surface!' : ''}`}
              >
                <span className="font-semibold">
                  {state.priceType === 'FIXED' ? state.t('menu.constructor.combos.modal.typeFixed') : state.t('menu.constructor.combos.modal.typeDiscount')}
                </span>
                <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180 text-brand-emerald' : ''}`} />
              </div>

              {isTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-bg-surface border border-solid border-border-main/60 shadow-md flex flex-col overflow-hidden p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { state.setPriceType('FIXED'); setIsTypeDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-3 h-10 hover:bg-bg-hover text-left text-xs font-semibold text-text-main rounded-md"
                  >
                    <span>{state.t('menu.constructor.combos.modal.typeFixed')}</span>
                    {state.priceType === 'FIXED' && <Check className="h-4 w-4 text-brand-emerald" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { state.setPriceType('DISCOUNT'); setIsTypeDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-3 h-10 hover:bg-bg-hover text-left text-xs font-semibold text-text-main rounded-md"
                  >
                    <span>{state.t('menu.constructor.combos.modal.typeDiscount')}</span>
                    {state.priceType === 'DISCOUNT' && <Check className="h-4 w-4 text-brand-emerald" />}
                  </button>
                </div>
              )}
            </div>

            <PriceInput
              id="combo-price-value-field"
              name="priceValue"
              label={state.t('menu.constructor.combos.modal.priceValueLabel')}
              placeholder="0"
              value={priceValue}
              onChange={setPriceValue}
              error={state.errors.priceValue}
              disabled={state.isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">
              {state.t('menu.constructor.combos.modal.searchLabel')}
            </span>
            <button
              type="button"
              onClick={() => !state.isSubmitting && setIsDishModalOpen(!isDishModalOpen)}
              className={`h-11 w-full bg-bg-main/20 border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer outline-none rounded-lg ${
                isDishModalOpen ? 'border-brand-emerald text-brand-emerald bg-brand-emerald/5 shadow-2xs' : 'border-border-main/60 text-brand-emerald hover:text-brand-emerald-hover hover:bg-brand-emerald/5'
              }`}
            >
              <Plus className={`h-4 w-4 transition-transform duration-200 ${isDishModalOpen ? 'rotate-45' : ''}`} />
              <span>{isDishModalOpen ? state.t('menu.constructor.combos.modal.cancel') : state.t('menu.constructor.combos.modal.searchPlaceholder')}</span>
              {state.selectedDishes.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] font-bold bg-brand-emerald text-white rounded-full transition-all">
                  {state.selectedDishes.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-1 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {state.t('menu.constructor.combos.modal.includedDishes')}
            </span>
            <div className="border border-solid border-border-main/40 p-2 bg-bg-main/10 h-36 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar rounded-lg">
              {state.selectedDishes.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-text-muted/60 italic font-light py-6">{state.t('menu.constructor.combos.modal.emptyIncluded')}</div>
              ) : (
                state.selectedDishes.map((d) => (
                  <div key={d.id} className="flex items-center justify-between bg-bg-surface border border-solid border-border-main/40 px-3 h-9 shadow-2xs shrink-0 rounded-md">
                    <span className="text-xs font-semibold text-text-main truncate pr-4">{d.name}</span>
                    <button type="button" onClick={() => state.removeDishFromCombo(d.id)} className="text-text-muted hover:text-red-500 p-1 transition-colors rounded">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {state.errors.dishes && <span className="text-[11px] font-medium text-red-500">{state.t(state.errors.dishes)}</span>}
          </div>

          <FormActionsFooter 
            onCancel={() => state.setIsModalOpen(false)} 
            submitLabel={state.t('menu.constructor.combos.modal.save')}
            cancelLabel={state.t('menu.constructor.combos.modal.cancel')}
            className="absolute bottom-0 left-0 right-0 p-4 rounded-b-3xl border-t"
          />
        </form>
      </FloatingPanel>

      <FloatingSidePanel
        id="combo-side-dish-panel"
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        title={state.t('menu.constructor.combos.modal.searchLabel')}
        targetSelector=".main-combo-panel"
        targetPanelId="combo-editor-panel"
        side="right"
        width={320}
        className="transition-none! animate-in slide-in-from-right duration-200"
      >
        <div className="h-12 px-4 border-b border-solid border-border-main/60 flex items-center justify-between bg-bg-main/30 shrink-0">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">
            {state.t('menu.constructor.combos.modal.searchLabel')}
          </h3>
          <button type="button" onClick={() => setIsDishModalOpen(false)} className="text-text-muted hover:text-text-main p-1 rounded-md hover:bg-bg-hover transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 pb-1 shrink-0">
          <SearchInput 
            id="combo-dish-search-field"
            placeholder={state.t('menu.constructor.combos.modal.searchPlaceholder')} 
            value={dishSearchQuery} 
            onChange={(e) => setDishSearchQuery(e.target.value)} 
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar">
          {filteredAvailableDishes.length === 0 ? (
            <span className="text-xs text-text-muted text-center py-6 font-light">{state.t('menu.constructor.combos.modal.notFound')}</span>
          ) : (
            filteredAvailableDishes.map((d: Dish) => {
              const isSelected = state.selectedDishes.some((sd) => sd.id === d.id);
              return (
                <div
                  key={d.id}
                  onClick={() => state.toggleDishSelection(d)}
                  className={`w-full flex items-center justify-between px-2.5 h-9 rounded-md cursor-pointer transition-all select-none border border-solid ${
                    isSelected ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-3xs' : 'border-transparent hover:bg-bg-hover'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Checkbox id={`search-dish-check-${d.id}`} checked={isSelected} onChange={() => {}} />
                    <span className={`text-xs font-semibold truncate transition-colors ${isSelected ? 'text-brand-emerald font-bold' : 'text-text-main'}`}>{d.name}</span>
                  </div>
                  <span className="text-[11px] font-bold font-mono text-text-muted shrink-0">{d.price} {state.t('menu.currency')}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-bg-main/10 border-t border-solid border-border-main/60 flex justify-end shrink-0 mt-auto">
          <button type="button" onClick={() => setIsDishModalOpen(false)} className="h-8 px-4 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover rounded-md shadow-md transition-colors">
            {state.t('menu.constructor.combos.modal.save')}
          </button>
        </div>
      </FloatingSidePanel>
    </>
  );
};