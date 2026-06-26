'use client';

import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FloatingPanel, Input, Switch } from '@/shared/ui';
import { CharacteristicsTab } from '@/features/menu-builder/components/board/tabs/CharacteristicsTab';
import { IngredientsTab } from '@/features/menu-builder/components/board/tabs/IngredientsTab';
import { DishLivePreview } from '@/features/menu-builder/components/board/preview/DishLivePreview';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Loader2, ChevronDown, Check } from 'lucide-react';
import type { DishModalProps, ModifierGroupLookup } from '@/features/menu-builder/types/dishes.types';

export const DishModal = ({ isOpen, onClose, dish, state }: DishModalProps) => {
  const { t } = useTranslation();
  const [isBadgeDropdownOpen, setIsBadgeDropdownOpen] = useState(false);
  const badgeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (badgeDropdownRef.current && !badgeDropdownRef.current.contains(target)) {
        setIsBadgeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleFormAction = () => {
    void state.handleSaveDish();
  };

  const currentPreviewUrl = state.dishImageUrls[state.activeDishImageIndex] || null;

  return (
    <FloatingPanel
      panelId="dish-builder-panel"
      isOpen={isOpen}
      onClose={onClose}
      title={dish ? t('menu.constructor.dishes.modal.editTitle') : t('menu.constructor.dishes.modal.createTitle')}
      className="max-w-5xl w-full h-[640px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-[540px] overflow-hidden">
        
        <div className="md:col-span-2 flex flex-col h-full overflow-hidden">
          
          <div className="flex gap-4 border-b border-solid border-neutral-200 dark:border-neutral-800 mb-4 pb-2 select-none shrink-0 overflow-x-auto custom-scrollbar">
            {(['pricing', 'characteristics', 'ingredients', 'modifiers', 'media'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => state.setActiveTab(tab === 'pricing' ? 'general' : tab)}
                className={`pb-2 text-sm font-semibold cursor-pointer transition-colors relative whitespace-nowrap border-0 bg-transparent outline-none ${
                  (state.activeTab === 'general' && tab === 'pricing') ||
                  state.activeTab === tab
                    ? 'border-b-2! border-solid! border-brand-emerald text-brand-emerald font-bold'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {t(`menu.constructor.dishes.modal.tabs.${tab}`)}
              </button>
            ))}
          </div>

          <form action={handleFormAction} className="flex flex-col flex-1 overflow-hidden h-full
            [&_input:not([type=checkbox])]:bg-bg-main/40! [&_input:not([type=checkbox])]:text-text-main! [&_input:not([type=checkbox])]:border-solid! [&_input:not([type=checkbox])]:border-neutral-300! dark:[&_input:not([type=checkbox])]:border-neutral-700! [&_input:not([type=checkbox])]:w-full [&_input:not([type=checkbox])]:rounded-xl! [&_input:not([type=checkbox])]:focus:border-brand-emerald/50! [&_input:not([type=checkbox])]:focus:ring-1! [&_input:not([type=checkbox])]:focus:ring-brand-emerald/20! [&_input:not([type=checkbox])]:outline-none!
            [&_select]:bg-bg-main/40! [&_select]:text-text-main! [&_select]:border-solid! [&_select]:border-neutral-300! dark:[&_select]:border-neutral-700! [&_select]:w-full [&_select]:rounded-xl! [&_select]:focus:border-brand-emerald/50! [&_select]:focus:ring-1! [&_select]:focus:ring-brand-emerald/20! [&_select]:outline-none!"
          >
            <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar pb-4 space-y-4">
              
              {state.activeTab === 'general' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <Input
                    id="dish-name"
                    label={t('menu.constructor.dishes.modal.nameLabel')}
                    placeholder={t('menu.constructor.dishes.modal.namePlaceholder')}
                    value={state.dishForm.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => state.setDishForm((prev) => ({ ...prev, name: e.target.value }))}
                    error={state.formErrors.name ? t(state.formErrors.name) : undefined}
                    disabled={state.isSaving}
                  />
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="dish-desc" className="text-xs font-bold text-text-main/80 uppercase tracking-wider">
                      {t('menu.constructor.dishes.modal.descLabel')}
                    </label>
                    <textarea
                      id="dish-desc"
                      rows={3}
                      placeholder={t('menu.constructor.dishes.modal.descPlaceholder')}
                      value={state.dishForm.description || ''}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => state.setDishForm((prev) => ({ ...prev, description: e.target.value }))}
                      disabled={state.isSaving}
                      className="w-full text-xs font-semibold p-3 border border-solid rounded-xl bg-bg-main/40 border-neutral-300 dark:border-neutral-700 focus:border-brand-emerald/50 outline-none transition-colors text-text-main resize-none placeholder:text-text-muted/40"
                    />
                  </div>

                  <Input
                    id="dish-price"
                    type="number"
                    label={t('menu.constructor.dishes.modal.priceLabel')}
                    placeholder="0"
                    value={state.dishForm.price || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => state.setDishForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    error={state.formErrors.price ? t(state.formErrors.price) : undefined}
                    disabled={state.isSaving}
                  />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      id="dish-weight"
                      type="number"
                      label={t('menu.constructor.dishes.modal.weightLabel')}
                      placeholder="0"
                      value={state.dishForm.weight || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => state.setDishForm((prev) => ({ ...prev, weight: e.target.value ? Number(e.target.value) : null }))}
                      error={state.formErrors.weight ? t(state.formErrors.weight) : undefined}
                      disabled={state.isSaving}
                    />
                    <Input
                      id="dish-cooking-time"
                      type="number"
                      label={t('menu.constructor.dishes.modal.timeLabel')}
                      placeholder="0"
                      value={state.dishForm.cookingTime || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => state.setDishForm((prev) => ({ ...prev, cookingTime: e.target.value ? Number(e.target.value) : null }))}
                      error={state.formErrors.cookingTime ? t(state.formErrors.cookingTime) : undefined}
                      disabled={state.isSaving}
                    />
                    <Input
                      id="dish-calories"
                      type="number"
                      label={t('menu.constructor.dishes.modal.caloriesLabel')}
                      placeholder="0"
                      value={state.dishForm.calories || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => state.setDishForm((prev) => ({ ...prev, calories: e.target.value ? Number(e.target.value) : null }))}
                      error={state.formErrors.calories ? t(state.formErrors.calories) : undefined}
                      disabled={state.isSaving}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 relative z-50" ref={badgeDropdownRef}>
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">
                      {t('menu.constructor.dishes.modal.badgeLabel')}
                    </span>
                    <div 
                      onClick={() => !state.isSaving && setIsBadgeDropdownOpen(!isBadgeDropdownOpen)}
                      className={`h-11 w-full rounded-xl bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 text-xs text-text-main px-4 flex items-center justify-between transition-all select-none ${
                        state.isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600'
                      } ${isBadgeDropdownOpen ? 'border-brand-emerald! ring-1 ring-brand-emerald/20 bg-bg-surface!' : ''}`}
                    >
                      <span className="font-medium">
                        {t(`menu.constructor.badges.${state.dishForm.badge}`)}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isBadgeDropdownOpen ? 'rotate-180 text-brand-emerald' : ''}`} />
                    </div>

                    {isBadgeDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-md flex flex-col overflow-hidden p-1 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="max-h-40 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-0.5">
                          {(['NONE', 'NEW', 'HIT', 'CHEF_CHOICE', 'TOP_RATED'] as const).map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => {
                                state.setDishForm((prev) => ({ ...prev, badge: b }));
                                setIsBadgeDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-3 h-10 rounded-lg hover:bg-bg-hover text-left transition-colors cursor-pointer group/item outline-none border-0 text-xs font-medium text-text-main shrink-0"
                            >
                              <span className="group-hover/item:text-brand-emerald transition-colors">{t(`menu.constructor.badges.${b}`)}</span>
                              {state.dishForm.badge === b && <Check className="h-4 w-4 text-brand-emerald shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-text-main/80 uppercase tracking-wider">
                      {t('menu.constructor.dishes.modal.availabilityLabel')}
                    </span>
                    <Switch
                      id="dish-available"
                      checked={state.dishForm.isAvailable}
                      onChange={(checked: boolean) => state.setDishForm((prev) => ({ ...prev, isAvailable: checked }))}
                      disabled={state.isSaving}
                    />
                  </div>
                </div>
              )}

              {state.activeTab === 'characteristics' && (
                <CharacteristicsTab dishForm={state.dishForm} setDishForm={state.setDishForm} />
              )}

              {state.activeTab === 'ingredients' && (
                <IngredientsTab dishForm={state.dishForm} setDishForm={state.setDishForm} />
              )}

              {state.activeTab === 'modifiers' && (
                <div className="space-y-3 animate-in fade-in duration-100">
                  <span className="text-xs font-bold block text-text-main/80 uppercase tracking-wider">
                    {t('menu.constructor.modifiers.title')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
                    {state.modifierGroups?.length === 0 ? (
                      <span className="text-xs text-text-muted italic p-2 font-light">{t('menu.constructor.dishes.modal.noModifiers')}</span>
                    ) : (
                      state.modifierGroups?.map((group: ModifierGroupLookup) => (
                        <div key={group.id} className="flex items-center gap-2.5 p-3 border border-solid border-neutral-300 dark:border-neutral-700 rounded-xl bg-bg-surface shadow-2xs transition-colors hover:border-brand-emerald/30">
                          <input
                            type="checkbox"
                            id={`mod-group-${group.id}`}
                            checked={state.dishForm.modifierIds?.includes(group.id)}
                            disabled={state.isSaving}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const currentIds = state.dishForm.modifierIds || [];
                              const nextIds = e.target.checked
                                ? [...currentIds, group.id]
                                : currentIds.filter((id: string) => id !== group.id);
                              state.setDishForm((prev) => ({ ...prev, modifierIds: nextIds }));
                            }}
                            className="rounded border-neutral-300 text-brand-emerald focus:ring-brand-emerald cursor-pointer h-4 w-4 shrink-0"
                          />
                          <label htmlFor={`mod-group-${group.id}`} className="text-xs font-semibold text-text-main cursor-pointer select-none truncate">
                            {group.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {state.activeTab === 'media' && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-center bg-bg-main/40 hover:border-brand-emerald/40 transition-colors">
                    <input
                      type="file"
                      id="dish-photo-upload"
                      multiple
                      accept="image/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => { void state.handleLocalImageUploadWrapper(e); }}
                      className="hidden"
                    />
                    <label htmlFor="dish-photo-upload" className="cursor-pointer text-xs text-brand-emerald font-bold uppercase tracking-wider select-none block w-full h-full py-2">
                      {t('menu.constructor.dishes.modal.mediaHint')}
                    </label>
                  </div>
                  {state.dishImageUrls.length > 0 && (
                    <div className="relative aspect-video w-full max-w-md mx-auto rounded-xl overflow-hidden border border-solid border-neutral-200 dark:border-neutral-800 shadow-md bg-bg-surface">
                      <Image
                        src={state.dishImageUrls[state.activeDishImageIndex]}
                        alt={state.dishForm.name || t('menu.constructor.dishes.modal.tabs.media')}
                        fill
                        unoptimized
                        className="object-cover pointer-events-none select-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-solid border-neutral-200 dark:border-neutral-800/60 shrink-0 bg-bg-surface mt-auto">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={state.isSaving} 
                className="h-10 px-4 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-all cursor-pointer border-0 bg-transparent outline-none select-none"
              >
                {t('menu.constructor.dishes.modal.cancel')}
              </button>
              <button 
                type="submit" 
                disabled={state.isSaving} 
                className="h-10 px-5 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10 select-none flex items-center justify-center gap-1.5"
              >
                {state.isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('menu.constructor.dishes.modal.save')}
              </button>
            </div>
          </form>
        </div>

        <div className="hidden md:block border-l border-solid border-neutral-200 dark:border-neutral-800/40 pl-6 h-full overflow-hidden">
          <DishLivePreview form={state.dishForm} imageUrl={currentPreviewUrl} />
        </div>
      </div>
    </FloatingPanel>
  );
};