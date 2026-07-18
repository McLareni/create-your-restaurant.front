'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';

interface CleanCharacteristicsTabProps {
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<DishFormValues>>;
  onOpenSidePanel: (type: 'allergens' | 'tags') => void;
  isSidePanelOpen: boolean;
  activeType: 'allergens' | 'tags';
}

export const CharacteristicsTab = ({
  dishForm,
  setDishForm,
  onOpenSidePanel,
  isSidePanelOpen,
  activeType,
}: CleanCharacteristicsTabProps) => {
  const { t } = useTranslation();

  const handleRemoveItem = (type: 'tags' | 'allergens', target: string) => {
    const current = dishForm[type] || [];
    setDishForm((prev) => ({
      ...prev,
      [type]: current.filter((item) => item !== target),
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            {t('menu.constructor.dishes.modal.tabs.characteristics')}
          </span>
          <button
            type="button"
            onClick={() => onOpenSidePanel('tags')}
            className={`h-8 text-xs font-bold border border-solid px-3 rounded-lg flex items-center gap-1 transition-all bg-transparent outline-none cursor-pointer ${
              isSidePanelOpen && activeType === 'tags'
                ? 'border-brand-emerald bg-brand-emerald/5 text-brand-emerald'
                : 'border-border-main/60 text-brand-emerald hover:bg-brand-emerald/5'
            }`}
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{t('menu.constructor.dishes.modal.characteristics.selectTags')}</span>
          </button>
        </div>
        <div className="border border-solid border-border-main/40 p-2.5 bg-bg-main/10 min-h-16 flex flex-wrap gap-1.5 rounded-lg items-start content-start">
          {!dishForm.tags || dishForm.tags.length === 0 ? (
            <div className="text-xs text-text-muted/60 italic font-light py-2 px-1 w-full text-center">
              {t('menu.constructor.dishes.modal.characteristics.noTags')}
            </div>
          ) : (
            dishForm.tags.map((tag) => (
              <div key={tag} className="flex items-center gap-1.5 bg-bg-surface border border-solid border-border-main/40 px-2.5 h-7 rounded-md shadow-3xs">
                <span className="text-xs font-semibold text-text-main">{tag}</span>
                <button type="button" onClick={() => handleRemoveItem('tags', tag)} className="text-text-muted/50 hover:text-red-500 p-0.5 rounded transition-colors border-0 bg-transparent outline-none cursor-pointer">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            {t('menu.constructor.dishes.modal.properties.allergensTitle')}
          </span>
          <button
            type="button"
            onClick={() => onOpenSidePanel('allergens')}
            className={`h-8 text-xs font-bold border border-solid px-3 rounded-lg flex items-center gap-1 transition-all bg-transparent outline-none cursor-pointer ${
              isSidePanelOpen && activeType === 'allergens'
                ? 'border-brand-emerald bg-brand-emerald/5 text-brand-emerald'
                : 'border-border-main/60 text-brand-emerald hover:bg-brand-emerald/5'
            }`}
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{t('menu.constructor.dishes.modal.characteristics.selectAllergens')}</span>
          </button>
        </div>
        <div className="border border-solid border-border-main/40 p-2.5 bg-bg-main/10 min-h-16 flex flex-wrap gap-1.5 rounded-lg items-start content-start">
          {!dishForm.allergens || dishForm.allergens.length === 0 ? (
            <div className="text-xs text-text-muted/60 italic font-light py-2 px-1 w-full text-center">
              {t('menu.constructor.dishes.modal.characteristics.noAllergens')}
            </div>
          ) : (
            dishForm.allergens.map((allergen) => (
              <div key={allergen} className="flex items-center gap-1.5 bg-bg-surface border border-solid border-border-main/40 px-2.5 h-7 rounded-md shadow-3xs">
                <span className="text-xs font-semibold text-text-main">{allergen}</span>
                <button type="button" onClick={() => handleRemoveItem('allergens', allergen)} className="text-text-muted/50 hover:text-red-500 p-0.5 rounded transition-colors border-0 bg-transparent outline-none cursor-pointer">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};