'use client';

import React, { ChangeEvent } from 'react';
import { Plus, X, Leaf, Flame, ShieldAlert } from 'lucide-react';
import { useCharacteristicsTab } from '@/features/menu-builder/hooks/useCharacteristicsTab';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { CharacteristicsTabProps } from '@/features/menu-builder/types/dishes.types';

export const CharacteristicsTab = ({ dishForm, setDishForm }: CharacteristicsTabProps) => {
  const { t } = useTranslation();
  
  const {
    allergens,
    tags,
    newAllergen,
    setNewAllergen,
    newTag,
    setNewTag,
    handleAddAllergen,
    handleAddTag,
    handleToggleAllergen,
    handleToggleTag,
    handleRemoveAllergenFromDb,
    handleRemoveTagFromDb,
  } = useCharacteristicsTab(dishForm, setDishForm);

  return (
    <div className="space-y-6 animate-in fade-in duration-150 select-none w-full text-text-main">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        
        <button
          type="button"
          onClick={() => setDishForm((prev) => ({ ...prev, isVegan: !prev.isVegan }))}
          className={`flex items-center gap-3 p-3.5 rounded-xl border border-solid text-left cursor-pointer transition-all duration-200 group ${
            dishForm.isVegan
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : 'bg-bg-surface border-neutral-300 dark:border-neutral-700 text-text-muted hover:border-neutral-400 dark:hover:border-neutral-500'
          }`}
        >
          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
            dishForm.isVegan ? 'bg-emerald-500/20' : 'bg-bg-main dark:bg-bg-element'
          }`}>
            <Leaf className={`h-4 w-4 ${dishForm.isVegan ? 'text-emerald-500' : 'text-text-muted/60 group-hover:text-text-main'}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase tracking-wider font-bold block opacity-60">
              {t('menu.constructor.dishes.modal.properties.vegan')}
            </span>
            <span className="text-[11px] font-medium leading-tight truncate opacity-80 mt-0.5">
              {dishForm.isVegan ? t('qr.statusActive') : t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setDishForm((prev) => ({ ...prev, isSpicy: !prev.isSpicy }))}
          className={`flex items-center gap-3 p-3.5 rounded-xl border border-solid text-left cursor-pointer transition-all duration-200 group ${
            dishForm.isSpicy
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
              : 'bg-bg-surface border-neutral-300 dark:border-neutral-700 text-text-muted hover:border-neutral-400 dark:hover:border-neutral-500'
          }`}
        >
          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
            dishForm.isSpicy ? 'bg-rose-500/20' : 'bg-bg-main dark:bg-bg-element'
          }`}>
            <Flame className={`h-4 w-4 ${dishForm.isSpicy ? 'text-rose-500' : 'text-text-muted/60 group-hover:text-text-main'}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase tracking-wider font-bold block opacity-60">
              {t('menu.constructor.dishes.modal.properties.spicy')}
            </span>
            <span className="text-[11px] font-medium leading-tight truncate opacity-80 mt-0.5">
              {dishForm.isSpicy ? t('menu.constructor.dishes.modal.properties.spicy') : t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setDishForm((prev) => ({ ...prev, isLactoseFree: !prev.isLactoseFree }))}
          className={`flex items-center gap-3 p-3.5 rounded-xl border border-solid text-left cursor-pointer transition-all duration-200 group ${
            dishForm.isLactoseFree
              ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 font-bold shadow-xs'
              : 'bg-bg-surface border-neutral-300 dark:border-neutral-700 text-text-muted hover:border-neutral-400 dark:hover:border-neutral-500'
          }`}
        >
          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
            dishForm.isLactoseFree ? 'bg-sky-500/20' : 'bg-bg-main dark:bg-bg-element'
          }`}>
            <ShieldAlert className={`h-4 w-4 ${dishForm.isLactoseFree ? 'text-sky-500' : 'text-text-muted/60 group-hover:text-text-main'}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase tracking-wider font-bold block opacity-60 truncate">
              {t('menu.constructor.dishes.modal.properties.lactoseFree')}
            </span>
            <span className="text-[11px] font-medium leading-tight truncate opacity-80 mt-0.5">
              {dishForm.isLactoseFree ? t('qr.statusActive') : t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}
            </span>
          </div>
        </button>

      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-text-main/80 uppercase tracking-wider block">
          {t('menu.constructor.dishes.modal.properties.allergensTitle')}
        </label>
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {allergens.length === 0 ? (
            <span className="text-xs text-text-muted/50 italic font-light p-1">{t('menu.constructor.modifiers.emptyOptions')}</span>
          ) : (
            allergens.map((allergen: string) => {
              const isSelected = dishForm.allergens?.includes(allergen);
              return (
                <div
                  key={allergen}
                  onClick={() => handleToggleAllergen(allergen, !isSelected)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-solid text-xs font-semibold transition-colors cursor-pointer select-none ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400 shadow-3xs'
                      : 'bg-bg-surface border-neutral-300 dark:border-neutral-700 text-text-main hover:border-neutral-400'
                  }`}
                >
                  <span className="truncate">{allergen}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAllergenFromDb(allergen);
                    }}
                    className="ml-1 text-text-muted/40 hover:text-red-500 transition-colors cursor-pointer shrink-0 border-0 bg-transparent p-0 outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-2 max-w-md pt-1">
          <input
            id="new-allergen-input"
            type="text"
            placeholder={t('menu.constructor.dishes.modal.properties.addAllergenPlaceholder')}
            value={newAllergen}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAllergen(e.target.value)}
            className="h-10 flex-1 rounded-xl bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 text-xs text-text-main px-3.5 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-all outline-none placeholder:text-text-muted/40"
          />
          <button
            type="button"
            onClick={handleAddAllergen}
            disabled={!newAllergen.trim()}
            className="h-10 px-4 rounded-xl text-xs font-bold border border-solid border-neutral-300 dark:border-neutral-700 bg-bg-surface text-text-main hover:border-brand-emerald hover:text-brand-emerald disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer outline-none"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{t('menu.constructor.dishes.modal.properties.addAllergenPlaceholder')}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-text-main/80 uppercase tracking-wider block">
          {t('menu.constructor.dishes.modal.properties.tagsTitle')}
        </label>
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {tags.length === 0 ? (
            <span className="text-xs text-text-muted/50 italic font-light p-1">{t('menu.constructor.modifiers.emptyOptions')}</span>
          ) : (
            tags.map((tag: string) => {
              const isSelected = dishForm.tags?.includes(tag);
              return (
                <div
                  key={tag}
                  onClick={() => handleToggleTag(tag, !isSelected)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-solid text-xs font-semibold transition-colors cursor-pointer select-none ${
                    isSelected
                      ? 'bg-brand-emerald/10 border-brand-emerald/40 text-brand-emerald shadow-3xs'
                      : 'bg-bg-surface border-neutral-300 dark:border-neutral-700 text-text-main hover:border-neutral-400'
                  }`}
                >
                  <span className="truncate">{tag}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTagFromDb(tag);
                    }}
                    className="ml-1 text-text-muted/40 hover:text-red-500 transition-colors cursor-pointer shrink-0 border-0 bg-transparent p-0 outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-2 max-w-md pt-1">
          <input
            id="new-tag-input"
            type="text"
            placeholder={t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}
            value={newTag}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
            className="h-10 flex-1 rounded-xl bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 text-xs text-text-main px-3.5 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-all outline-none placeholder:text-text-muted/40"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            className="h-10 px-4 rounded-xl text-xs font-bold border border-solid border-neutral-300 dark:border-neutral-700 bg-bg-surface text-text-main hover:border-brand-emerald hover:text-brand-emerald disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer outline-none"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};