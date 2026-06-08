'use client';

import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { FloatingPanel, Input, Button, Select, Switch } from '@/shared/ui';
import { CharacteristicsTab } from '@/features/menu-builder/components/board/tabs/CharacteristicsTab';
import { IngredientsTab } from '@/features/menu-builder/components/board/tabs/IngredientsTab';
import { DishLivePreview } from '@/features/menu-builder/components/board/preview/DishLivePreview';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { DishModalProps, ModifierGroupLookup } from '@/features/menu-builder/types/dishes.types';

export const DishModal = ({ isOpen, onClose, dish, state }: DishModalProps) => {
  const { t } = useTranslation();

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
      className="w-full max-w-5xl border-brand-copper/20"
    >
      {/* Фіксована висота внутрішньої сітки (h-150) запобігає стрибкам модалки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-150 overflow-hidden">
        
        {/* ЛІВА ЧАСТИНА: Форма та робочі вкладки */}
        <div className="md:col-span-2 flex flex-col h-full overflow-hidden">
          
          {/* Навігація по табах згідно з menu.constructor.dishes.modal.tabs */}
          <div className="flex gap-4 border-b border-zinc-200 mb-4 pb-2 select-none shrink-0 overflow-x-auto custom-scrollbar">
            {(['pricing', 'characteristics', 'ingredients', 'modifiers', 'media'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => state.setActiveTab(tab === 'pricing' ? 'general' : tab)}
                className={`pb-2 text-sm font-semibold cursor-pointer transition-colors relative whitespace-nowrap ${
                  (state.activeTab === 'general' && tab === 'pricing') || state.activeTab === tab
                    ? 'border-b-2 border-brand-copper text-brand-copper font-bold'
                    : 'text-zinc-500 hover:text-brand-espresso dark:hover:text-brand-cream'
                }`}
              >
                {t(`menu.constructor.dishes.modal.tabs.${tab}`)}
              </button>
            ))}
          </div>

          <form action={handleFormAction} className="flex flex-col flex-1 overflow-hidden">
            {/* Область контенту з індивідуальним вертикальним скролом */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4 space-y-4">
              
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
                    <label htmlFor="dish-desc" className="text-xs font-bold text-brand-espresso dark:text-brand-cream uppercase tracking-wider">
                      {t('menu.constructor.dishes.modal.descLabel')}
                    </label>
                    <textarea
                      id="dish-desc"
                      rows={3}
                      placeholder={t('menu.constructor.dishes.modal.descPlaceholder')}
                      value={state.dishForm.description || ''}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => state.setDishForm((prev) => ({ ...prev, description: e.target.value }))}
                      disabled={state.isSaving}
                      className="w-full text-xs font-semibold p-3 border rounded-xl bg-white dark:bg-brand-espresso border-brand-gray/30 focus:border-brand-copper outline-none transition-colors dark:text-brand-cream resize-none"
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
                  
                  {/* Стабільна триколонкова числова сітка параметрів */}
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

                  <Select
                    id="dish-badge"
                    label={t('menu.constructor.dishes.modal.badgeLabel')}
                    value={state.dishForm.badge}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => state.setDishForm((prev) => ({ ...prev, badge: e.target.value }))}
                    disabled={state.isSaving}
                  >
                    <option value="NONE">{t('menu.constructor.badges.NONE')}</option>
                    <option value="NEW">{t('menu.constructor.badges.NEW')}</option>
                    <option value="HIT">{t('menu.constructor.badges.HIT')}</option>
                    <option value="CHEF_CHOICE">{t('menu.constructor.badges.CHEF_CHOICE')}</option>
                    <option value="TOP_RATED">{t('menu.constructor.badges.TOP_RATED')}</option>
                  </Select>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-brand-espresso dark:text-brand-cream uppercase tracking-wider">
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
                  <span className="text-xs font-bold block text-brand-espresso dark:text-brand-cream uppercase tracking-wider">
                    {t('menu.constructor.modifiers.title')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                    {state.modifierGroups?.length === 0 ? (
                      <span className="text-xs text-brand-gray italic p-2">{t('menu.constructor.dishes.modal.noModifiers')}</span>
                    ) : (
                      state.modifierGroups?.map((group: ModifierGroupLookup) => (
                        <div key={group.id} className="flex items-center gap-2.5 p-3 border border-zinc-200 dark:border-brand-gray/30 rounded-xl bg-white dark:bg-brand-mocha shadow-xs transition-colors hover:border-brand-copper/30">
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
                            className="rounded border-zinc-300 text-brand-copper focus:ring-brand-copper cursor-pointer h-4 w-4 shrink-0"
                          />
                          <label htmlFor={`mod-group-${group.id}`} className="text-xs font-semibold text-brand-espresso dark:text-brand-cream cursor-pointer select-none truncate">
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
                  <div className="border-2 border-dashed border-zinc-300 dark:border-brand-gray/40 rounded-xl p-6 text-center bg-zinc-50 dark:bg-brand-mocha/20 hover:border-brand-copper/40 transition-colors">
                    <input
                      type="file"
                      id="dish-photo-upload"
                      multiple
                      accept="image/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => { void state.handleLocalImageUploadWrapper(e); }}
                      className="hidden"
                    />
                    <label htmlFor="dish-photo-upload" className="cursor-pointer text-xs text-brand-copper font-bold uppercase tracking-wider select-none block w-full h-full py-2">
                      {t('menu.constructor.dishes.modal.mediaHint')}
                    </label>
                  </div>
                  {state.dishImageUrls.length > 0 && (
                    <div className="relative aspect-video w-full max-w-md mx-auto rounded-xl overflow-hidden border border-zinc-200 dark:border-brand-gray/30 shadow-md bg-white dark:bg-brand-mocha">
                      <Image
                        src={state.dishImageUrls[state.activeDishImageIndex]}
                        alt={state.dishForm.name || t('menu.constructor.dishes.modal.tabs.media')}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* СПІЛЬНИЙ ПІДВАЛ: Кнопки надійно зафіксовані тут */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-brand-gray/20 shrink-0 bg-white dark:bg-brand-mocha mt-auto">
              <Button type="button" variant="ghost" onClick={onClose} disabled={state.isSaving} className="h-10 text-xs font-semibold">
                {t('menu.constructor.dishes.modal.cancel')}
              </Button>
              <Button type="submit" variant="brand" isLoading={state.isSaving} className="h-10 text-xs font-bold px-6">
                {t('menu.constructor.dishes.modal.save')}
              </Button>
            </div>
          </form>
        </div>

        {/* ПРАВА ЧАСТИНА: Live Preview */}
        <div className="hidden md:block border-l border-zinc-100 dark:border-brand-gray/10 pl-6 h-full overflow-hidden">
          <DishLivePreview form={state.dishForm} imageUrl={currentPreviewUrl} />
        </div>
      </div>
    </FloatingPanel>
  );
};