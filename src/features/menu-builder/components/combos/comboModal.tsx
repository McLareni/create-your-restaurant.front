'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FloatingPanel, Checkbox } from '@/shared/ui';
import { ChevronDown, Search, Check, X, ArrowLeft } from 'lucide-react';
import type { ComboModalProps, ComboDishSelect } from '@/features/menu-builder/types/combos.types';
import type { Dish } from '@/features/menu-builder/types/dishes.types';

export const ComboModal = ({ state }: ComboModalProps) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isDishDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dishSearchQuery, setDishSearchQuery] = useState('');
  
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(target)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!state.isModalOpen) return null;

  const handleFormAction = () => {
    void state.handleSave();
  };

  const filteredAvailableDishes = state.allDishes.filter((d: Dish) => 
    d.name.toLowerCase().includes(dishSearchQuery.toLowerCase())
  );

  return (
    <FloatingPanel 
      panelId="combo-pack-panel" 
      isOpen={state.isModalOpen} 
      onClose={() => !state.isSubmitting && state.setIsModalOpen(false)} 
      title={state.editingCombo ? state.t('menu.constructor.combos.modal.editTitle') : state.t('menu.constructor.combos.modal.createTitle')} 
      className="max-w-2xl h-[620px]" 
    >
      <form action={handleFormAction} className="flex flex-col text-text-main w-full h-full justify-between overflow-visible pb-2">
        <div className="space-y-4 flex-1 overflow-visible pr-0.5">
          
          <div className="flex flex-col gap-1">
            <label htmlFor="combo-name-input" className="text-xs font-bold uppercase tracking-wider text-text-main/80 mb-1">
              {state.t('menu.constructor.combos.modal.nameLabel')}
            </label>
            <input 
              id="combo-name-input"
              type="text"
              placeholder={state.t('menu.constructor.combos.modal.namePlaceholder')} 
              value={state.name} 
              onChange={(e) => state.setName(e.target.value)} 
              disabled={state.isSubmitting}
              className="h-11 w-full rounded-xl bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 text-sm text-text-main px-3.5 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-all outline-none placeholder:text-text-muted/40"
            />
            {state.errors.name && <span className="text-xs text-red-500 font-semibold mt-0.5">{state.errors.name}</span>}
          </div>
          
          <div className="grid grid-cols-2 gap-4 shrink-0 overflow-visible">
            <div className="flex flex-col gap-1.5 relative" ref={typeDropdownRef}>
              <span className="text-xs font-bold uppercase tracking-wider text-text-main/80 mb-1">
                {state.t('menu.constructor.combos.modal.priceTypeLabel')}
              </span>
              
              <div 
                onClick={() => !state.isSubmitting && setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className={`h-11 w-full rounded-xl bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 text-xs text-text-main px-4 flex items-center justify-between transition-all select-none ${
                  state.isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600'
                } ${isTypeDropdownOpen ? 'border-brand-emerald! ring-1 ring-brand-emerald/20 bg-bg-surface!' : ''}`}
              >
                <span className="font-medium">
                  {state.priceType === 'FIXED' 
                    ? state.t('menu.constructor.combos.modal.typeFixed') 
                    : state.t('menu.constructor.combos.modal.typeDiscount')}
                </span>
                <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180 text-brand-emerald' : ''}`} />
              </div>

              {isTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-bg-surface border border-solid border-border-main rounded-xl shadow-xl flex flex-col overflow-hidden p-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      state.setPriceType('FIXED');
                      setIsTypeDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 h-10 rounded-lg hover:bg-bg-hover text-left transition-colors cursor-pointer group/item outline-none border-0 text-xs font-medium text-text-main"
                  >
                    <span className="group-hover/item:text-brand-emerald transition-colors">{state.t('menu.constructor.combos.modal.typeFixed')}</span>
                    {state.priceType === 'FIXED' && <Check className="h-4 w-4 text-brand-emerald shrink-0" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      state.setPriceType('DISCOUNT');
                      setIsTypeDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 h-10 rounded-lg hover:bg-bg-hover text-left transition-colors cursor-pointer group/item outline-none border-0 text-xs font-medium text-text-main"
                  >
                    <span className="group-hover/item:text-brand-emerald transition-colors">{state.t('menu.constructor.combos.modal.typeDiscount')}</span>
                    {state.priceType === 'DISCOUNT' && <Check className="h-4 w-4 text-brand-emerald shrink-0" />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="combo-value-input" className="text-xs font-bold uppercase tracking-wider text-text-main/80 mb-1">
                {state.t('menu.constructor.combos.modal.priceValueLabel')}
              </label>
              <div className="relative flex items-center w-full">
                <input 
                  id="combo-value-input"
                  type="number" 
                  value={state.priceValue === 0 ? '' : state.priceValue} 
                  onChange={(e) => state.setPriceValue(Math.max(0, parseFloat(e.target.value) || 0))} 
                  disabled={state.isSubmitting} 
                  className="h-11 w-full rounded-xl bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 text-sm text-text-main px-3.5 pr-10 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-all outline-none placeholder:text-text-muted/40"
                />
                <span className="absolute right-4 text-xs font-bold text-text-muted select-none pointer-events-none">
                  {state.priceType === 'FIXED' ? state.t('menu.currency') : '%'}
                </span>
              </div>
              {state.errors.priceValue && <span className="text-xs text-red-500 font-semibold mt-0.5">{state.errors.priceValue}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-text-main/80 mb-1">
              {state.t('menu.constructor.combos.modal.searchLabel')}
            </span>
            
            <div 
              onClick={() => !state.isSubmitting && !state.isDishesLoading && setIsDropdownOpen(true)}
              className={`h-11 w-full rounded-xl bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 text-xs text-text-muted px-4 flex items-center justify-between transition-all select-none ${
                state.isSubmitting || state.isDishesLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <span className="text-text-muted/50">
                {state.t('menu.constructor.combos.modal.searchPlaceholder')}
              </span>
              <ChevronDown className="h-4 w-4 text-text-muted" />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1 relative z-10">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {state.t('menu.constructor.combos.modal.includedDishes')}
            </label>
            {state.errors.dishIds && <span className="text-xs text-red-600 font-bold">{state.errors.dishIds}</span>}

            <div className="rounded-xl border border-solid border-neutral-300 dark:border-neutral-700 bg-bg-main/30 overflow-hidden">
              <div className="flex flex-col gap-2 p-2 h-44 overflow-y-auto custom-scrollbar">
                {state.isDishesLoading ? (
                  <span className="text-xs text-text-muted animate-pulse p-2 block text-center font-medium">{state.t('actions.loading')}</span>
                ) : state.selectedDishes.length === 0 ? (
                  <span className="text-xs text-text-muted/50 italic p-3 block text-center font-light">
                    {state.t('menu.constructor.combos.modal.emptyIncluded')}
                  </span>
                ) : (
                  state.selectedDishes.map((dish: ComboDishSelect) => (
                    <div key={dish.id} className="bg-bg-surface p-2 rounded-xl border border-solid border-border-main/60 flex items-center justify-between shadow-2xs transition-colors hover:border-brand-emerald/20">
                      <span className="text-xs font-medium text-text-main">
                        {dish.name}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-brand-emerald font-mono">{dish.price} {state.t('menu.currency')}</span>
                        <div className="flex items-center justify-center shrink-0 scale-90">
                          <Checkbox 
                            id={`combo-dish-${dish.id}`} 
                            checked={true} 
                            onChange={(e) => state.handleToggleDish(dish, e.target.checked)} 
                            disabled={state.isSubmitting} 
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-solid border-border-main/60 shrink-0 bg-bg-surface relative z-20">
          <button 
            type="button" 
            onClick={() => state.setIsModalOpen(false)} 
            disabled={state.isSubmitting} 
            className="h-10 px-4 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-all cursor-pointer border-0 bg-transparent outline-none select-none"
          >
            {state.t('menu.constructor.combos.modal.cancel')}
          </button>
          <button 
            type="submit" 
            disabled={state.isSubmitting || !state.name.trim() || state.selectedDishes.length === 0} 
            className="h-10 px-5 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10 select-none" 
          >
            {state.t('menu.constructor.combos.modal.save')}
          </button>
        </div>

        {isDishDropdownOpen && (
          <div className="absolute top-[53px] inset-x-0 bottom-0 bg-bg-surface z-50 flex flex-col p-6 rounded-b-3xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-solid border-border-main/60 mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1.5 rounded-xl text-text-muted hover:bg-bg-element hover:text-text-main transition-colors border-0 bg-transparent outline-none cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h3 className="text-base font-bold text-text-main">
                  {state.t('menu.constructor.combos.modal.searchLabel')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="p-1.5 rounded-xl text-text-muted hover:bg-bg-element hover:text-text-main transition-colors border-0 bg-transparent outline-none cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex items-center mb-4 shrink-0">
              <span className="absolute left-3.5 text-text-muted/40">
                <Search className="h-4 w-4" />
              </span>
              <input 
                type="text"
                autoFocus
                placeholder={state.t('menu.constructor.combos.modal.searchPlaceholder')}
                value={dishSearchQuery}
                onChange={(e) => setDishSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 rounded-xl text-sm text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-all outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar pb-14">
              {state.isDishesLoading ? (
                <span className="text-xs text-text-muted animate-pulse p-4 block text-center font-medium">{state.t('actions.loading')}</span>
              ) : filteredAvailableDishes.length === 0 ? (
                <span className="text-xs text-text-muted/50 italic p-6 block text-center font-light">{state.t('menu.constructor.combos.modal.notFound')}</span>
              ) : (
                filteredAvailableDishes.map((d: Dish) => {
                  const currentSelection = (state.selectedDishes || []).find((fd) => fd.id === d.id);
                  const isSelected = !!currentSelection;

                  return (
                    <div
                      key={d.id}
                      onClick={() => {
                        if (isSelected && currentSelection) {
                          state.handleToggleDish(currentSelection, false);
                        } else {
                          state.handleAddDish(d.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 h-12 rounded-xl border border-solid transition-all cursor-pointer group/item select-none ${
                        isSelected 
                          ? 'bg-brand-emerald/5 border-brand-emerald' 
                          : 'bg-bg-main/20 border-border-main/40 hover:bg-bg-hover'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="scale-90 pointer-events-none">
                          <Checkbox 
                            id={`search-dish-check-${d.id}`} 
                            checked={isSelected} 
                            onChange={() => {}} 
                          />
                        </div>
                        <span className={`text-xs font-semibold transition-colors ${isSelected ? 'text-brand-emerald font-bold' : 'text-text-main'}`}>
                          {d.name}
                        </span>
                      </div>
                      <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md transition-all border border-solid ${
                        isSelected 
                          ? 'bg-brand-emerald/10 text-brand-emerald border-transparent' 
                          : 'bg-bg-surface text-text-muted border-border-main/40'
                      }`}>
                        {d.price} {state.t('menu.currency')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg-surface border-t border-solid border-border-main/60 flex justify-end rounded-b-3xl">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="h-10 px-6 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10"
              >
                {state.t('staff.ops.doneBtn')}
              </button>
            </div>
          </div>
        )}
      </form>
    </FloatingPanel>
  );
};