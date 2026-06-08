'use client';

import React, { ChangeEvent } from 'react';
import { Plus, X, Leaf, Flame, ShieldAlert } from 'lucide-react';
import { useCharacteristicsTab } from '@/features/menu-builder/hooks/useCharacteristicsTab';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Input, Button } from '@/shared/ui';
import type { CharacteristicsTabProps } from '@/features/menu-builder/types/dishes.types';

export const CharacteristicsTab = ({ dishForm, setDishForm }: CharacteristicsTabProps) => {
  // ВИПРАВЛЕНО: Чистий та правильний виклик хука в тілі компонента за правилами React
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
    <div className="space-y-6 animate-in fade-in duration-150 select-none w-full">
      
      {/* ПРЕМІУМ ДИЗАЙН: Інтерактивні картки-баджери із повним узгодженням ключів перекладу */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        
        {/* КАРТКА 1: ВЕГАНСЬКЕ */}
        <button
          type="button"
          onClick={() => setDishForm((prev) => ({ ...prev, isVegan: !prev.isVegan }))}
          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 group ${
            dishForm.isVegan
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
              : 'bg-white border-zinc-200 hover:border-zinc-300 dark:bg-brand-mocha dark:border-brand-gray/30 text-zinc-600 dark:text-brand-cream/80'
          }`}
        >
          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
            dishForm.isVegan ? 'bg-emerald-500/20' : 'bg-zinc-100 dark:bg-brand-gray/20'
          }`}>
            <Leaf className={`h-4 w-4 ${dishForm.isVegan ? 'text-emerald-500' : 'text-zinc-400 group-hover:text-zinc-500'}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase tracking-wider font-bold block opacity-60">
              {t('menu.constructor.dishes.modal.properties.vegan')}
            </span>
            <span className="text-[11px] font-medium leading-tight truncate opacity-80 mt-0.5">
              {dishForm.isVegan ? 'Активовано для гостей' : 'Натисніть щоб додати'}
            </span>
          </div>
        </button>

        {/* КАРТКА 2: ГОСТРЕ */}
        <button
          type="button"
          onClick={() => setDishForm((prev) => ({ ...prev, isSpicy: !prev.isSpicy }))}
          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 group ${
            dishForm.isSpicy
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400 font-bold shadow-xs'
              : 'bg-white border-zinc-200 hover:border-zinc-300 dark:bg-brand-mocha dark:border-brand-gray/30 text-zinc-600 dark:text-brand-cream/80'
          }`}
        >
          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
            dishForm.isSpicy ? 'bg-amber-500/20' : 'bg-zinc-100 dark:bg-brand-gray/20'
          }`}>
            <Flame className={`h-4 w-4 ${dishForm.isSpicy ? 'text-amber-500' : 'text-zinc-400 group-hover:text-zinc-500'}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase tracking-wider font-bold block opacity-60">
              {t('menu.constructor.dishes.modal.properties.spicy')}
            </span>
            <span className="text-[11px] font-medium leading-tight truncate opacity-80 mt-0.5">
              {dishForm.isSpicy ? 'Гостра позиція' : 'Натисніть щоб додати'}
            </span>
          </div>
        </button>

        {/* КАРТКА 3: БЕЗ ЛАКТОЗИ */}
        <button
          type="button"
          onClick={() => setDishForm((prev) => ({ ...prev, isLactoseFree: !prev.isLactoseFree }))}
          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 group ${
            dishForm.isLactoseFree
              ? 'bg-brand-copper/10 border-brand-copper/40 text-brand-copper dark:text-brand-cream font-bold shadow-xs'
              : 'bg-white border-zinc-200 hover:border-zinc-300 dark:bg-brand-mocha dark:border-brand-gray/30 text-zinc-600 dark:text-brand-cream/80'
          }`}
        >
          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
            dishForm.isLactoseFree ? 'bg-brand-copper/20' : 'bg-zinc-100 dark:bg-brand-gray/20'
          }`}>
            <ShieldAlert className={`h-4 w-4 ${dishForm.isLactoseFree ? 'text-brand-copper' : 'text-zinc-400 group-hover:text-zinc-500'}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase tracking-wider font-bold block opacity-60 truncate">
              {t('menu.constructor.dishes.modal.properties.lactoseFree')}
            </span>
            <span className="text-[11px] font-medium leading-tight truncate opacity-80 mt-0.5">
              {dishForm.isLactoseFree ? 'Безпечно гостям' : 'Натисніть щоб додати'}
            </span>
          </div>
        </button>

      </div>

      {/* Блок харчових алергенів */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-brand-espresso dark:text-brand-cream uppercase tracking-wider block">
          {t('menu.constructor.dishes.modal.properties.allergensTitle')}
        </label>
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {allergens.length === 0 ? (
            <span className="text-xs text-zinc-400 italic">Алергенів не створено</span>
          ) : (
            allergens.map((allergen: string) => {
              const isSelected = dishForm.allergens?.includes(allergen);
              return (
                <div
                  key={allergen}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-brand-copper/10 border-brand-copper/40 text-brand-copper'
                      : 'bg-white border-zinc-200 text-zinc-600 dark:bg-brand-mocha dark:border-brand-gray/30 dark:text-brand-cream/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`allergen-${allergen}`}
                    checked={!!isSelected}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleToggleAllergen(allergen, e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-brand-gray/30 text-brand-copper focus:ring-brand-copper/30 cursor-pointer shrink-0"
                  />
                  <label htmlFor={`allergen-${allergen}`} className="cursor-pointer select-none truncate">
                    {allergen}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergenFromDb(allergen)}
                    className="ml-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-2 max-w-md pt-1">
          <Input
            id="new-allergen-input"
            placeholder={t('menu.constructor.dishes.modal.properties.addAllergenPlaceholder')}
            value={newAllergen}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAllergen(e.target.value)}
            className="h-10 text-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddAllergen}
            disabled={!newAllergen.trim()}
            className="h-10 rounded-xl text-xs shrink-0 px-4"
            icon={<Plus className="h-3.5 w-3.5" />}
          >
            {t('menu.constructor.dishes.modal.properties.addAllergenPlaceholder')}
          </Button>
        </div>
      </div>

      {/* Блок особливостей та тегів */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-brand-espresso dark:text-brand-cream uppercase tracking-wider block">
          {t('menu.constructor.dishes.modal.properties.tagsTitle')}
        </label>
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {tags.length === 0 ? (
            <span className="text-xs text-zinc-400 italic">Особливостей не створено</span>
          ) : (
            tags.map((tag: string) => {
              const isSelected = dishForm.tags?.includes(tag);
              return (
                <div
                  key={tag}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-brand-copper/10 border-brand-copper/40 text-brand-copper'
                      : 'bg-white border-zinc-200 text-zinc-600 dark:bg-brand-mocha dark:border-brand-gray/30 dark:text-brand-cream/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`tag-${tag}`}
                    checked={!!isSelected}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleToggleTag(tag, e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-brand-gray/30 text-brand-copper focus:ring-brand-copper/30 cursor-pointer shrink-0"
                  />
                  <label htmlFor={`tag-${tag}`} className="cursor-pointer select-none truncate">
                    {tag}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveTagFromDb(tag)}
                    className="ml-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-2 max-w-md pt-1">
          <Input
            id="new-tag-input"
            placeholder={t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}
            value={newTag}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
            className="h-10 text-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            className="h-10 rounded-xl text-xs shrink-0 px-4"
            icon={<Plus className="h-3.5 w-3.5" />}
          >
            {t('menu.constructor.dishes.modal.properties.addTagPlaceholder')}
          </Button>
        </div>
      </div>
    </div>
  );
};