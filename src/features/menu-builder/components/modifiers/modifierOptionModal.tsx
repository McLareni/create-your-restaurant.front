'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { FloatingPanel, Input, Switch } from '@/shared/ui';
import { PriceInput } from '@/shared/ui/forms/PriceInput';
import type { ModifierOptionModalProps } from '@/features/menu-builder/types/modifiers.types';

export const ModifierOptionModal = ({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave,
  isLoading = false,
}: ModifierOptionModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmitAction = () => {
    if (isLoading) return;
    onSave();
  };

  return (
    <FloatingPanel
      panelId="modifier-option-panel"
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('menu.constructor.modifiers.modal.option.editTitle') : t('menu.constructor.modifiers.modal.option.createTitle')}
      className="max-w-xl"
    >
      <form action={handleSubmitAction} className="flex flex-col gap-4 text-text-main w-full
        [&_input]:bg-bg-main/60! [&_input]:text-text-main! [&_input]:border-border-main/60! [&_input]:w-full [&_input]:rounded-xl! [&_input]:focus:border-brand-emerald/50!"
      >
        <Input
          id="mod-option-name-input"
          label={t('menu.constructor.modifiers.modal.option.nameLabel')}
          placeholder={t('menu.constructor.modifiers.modal.option.namePlaceholder')}
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          disabled={isLoading}
          error={undefined}
        />
        
        <PriceInput
          id="mod-option-price-input"
          label={t('menu.constructor.modifiers.modal.option.priceLabel')}
          placeholder="0"
          value={Number(form.price) || 0}
          onChange={(val) => setForm((prev) => ({ ...prev, price: String(val) }))}
          disabled={isLoading}
          error={undefined}
        />

        <div className="flex items-center justify-between border-t border-border-main/60 pt-4 mt-2">
          <span className="text-sm font-semibold text-text-main">
            {t('menu.constructor.modifiers.modal.option.availableLabel')}
          </span>
          <Switch checked={form.isAvailable} onChange={(val) => setForm((prev) => ({ ...prev, isAvailable: val }))} disabled={isLoading} />
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-border-main/60">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-all border-0 bg-transparent"
            disabled={isLoading}
          >
            {t('menu.constructor.modifiers.modal.cancel')}
          </button>
          <button
            type="submit"
            disabled={!form.name.trim() || isLoading}
            className="h-10 px-5 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover rounded-xl shadow-md border border-brand-emerald/10"
          >
            {t('menu.constructor.modifiers.modal.save')}
          </button>
        </div>
      </form>
    </FloatingPanel>
  );
};