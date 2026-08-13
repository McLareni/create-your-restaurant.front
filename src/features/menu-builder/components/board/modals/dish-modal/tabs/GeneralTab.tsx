'use client';

import React from 'react';
import { Input } from '@/shared/ui';
import { PriceInput } from '@/shared/ui/forms/PriceInput';
import { Plus } from 'lucide-react';
import type { UseDishModalReturn } from '@/features/menu-builder/types/dishes.types';

interface GeneralTabProps {
  state: UseDishModalReturn;
  t: (key: string) => string;
  onOpenBadgePanel: () => void;
}

export const GeneralTab = ({ state, t, onOpenBadgePanel }: GeneralTabProps) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-100">
      <Input
        id="dish-name"
        name="name"
        label={t('menu.constructor.dishes.modal.nameLabel')}
        placeholder={t('menu.constructor.dishes.modal.namePlaceholder')}
        defaultValue={state.editingDish?.name}
        error={state.formErrors.name ? t(state.formErrors.name) : undefined}
        disabled={state.isSaving}
      />
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dish-desc" className="text-xs font-bold text-text-main/80 uppercase tracking-wider">
          {t('menu.constructor.dishes.modal.properties.descriptionLabel')}
        </label>
        <textarea
          id="dish-desc"
          name="description"
          placeholder={t('menu.constructor.dishes.modal.descPlaceholder')}
          defaultValue={state.editingDish?.description || ''}
          disabled={state.isSaving}
          className="w-full h-20 bg-bg-main/40 text-text-main text-xs border border-solid border-border-main/60 rounded-xl px-4 py-2.5 outline-none transition-all focus:border-brand-emerald/50 resize-none custom-scrollbar"
        />
        {state.formErrors.description && (
          <span className="text-[11px] font-medium text-red-500">
            {t(state.formErrors.description)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PriceInput
          id="dish-price"
          name="price"
          label={t('menu.constructor.dishes.modal.properties.priceLabel')}
          placeholder="0"
          value={state.dishForm.price || 0}
          onChange={(val) => state.setDishForm((prev) => ({ ...prev, price: val }))}
          error={state.formErrors.price ? t(state.formErrors.price) : undefined}
          disabled={state.isSaving}
        />
        <Input
          id="dish-weight"
          name="weight"
          type="number"
          label={t('menu.constructor.dishes.modal.weightLabel')}
          placeholder="0"
          defaultValue={state.editingDish?.weight || ''}
          error={state.formErrors.weight ? t(state.formErrors.weight) : undefined}
          disabled={state.isSaving}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="dish-cooking-time"
          name="cookingTime"
          type="number"
          label={t('menu.constructor.dishes.modal.timeLabel')}
          placeholder="0"
          defaultValue={state.editingDish?.cookingTime || ''}
          error={state.formErrors.cookingTime ? t(state.formErrors.cookingTime) : undefined}
          disabled={state.isSaving}
        />
        <Input
          id="dish-calories"
          name="calories"
          type="number"
          label={t('menu.constructor.dishes.modal.properties.caloriesLabel')}
          placeholder="0"
          defaultValue={state.editingDish?.calories || ''}
          error={state.formErrors.calories ? t(state.formErrors.calories) : undefined}
          disabled={state.isSaving}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">
          {t('menu.constructor.dishes.modal.badgeLabel')}
        </span>
        <button
          type="button"
          onClick={onOpenBadgePanel}
          className="h-11 w-full bg-bg-main/20 border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer outline-none rounded-lg border-border-main/60 text-brand-emerald hover:text-brand-emerald-hover hover:bg-brand-emerald/5"
        >
          <Plus className="h-4 w-4" />
          <span>
            {state.dishForm.badge 
              ? t(`menu.constructor.badges.${state.dishForm.badge}`) 
              : t('menu.constructor.dishes.modal.badgePlaceholder')
            }
          </span>
        </button>
      </div>
    </div>
  );
};