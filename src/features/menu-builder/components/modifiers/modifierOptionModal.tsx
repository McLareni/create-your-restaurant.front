'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, FloatingPanel, Input, Switch } from '@/shared/ui';
import type { ModifierOptionModalProps } from '@/features/menu-builder/types/modifiers.types';

export const ModifierOptionModal = ({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave,
  isLoading = false
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
      className="w-132 border-brand-copper/20"
    >
      <form action={handleSubmitAction} className="flex flex-col gap-4 text-brand-espresso dark:text-brand-cream">
        <Input
          id="optName"
          label={t('menu.constructor.modifiers.modal.option.nameLabel')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={isLoading}
        />
        <Input
          id="optPrice"
          type="number"
          label={t('menu.constructor.modifiers.modal.option.priceLabel')}
          placeholder="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between border-t border-brand-gray/10 pt-4 mt-2">
          <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">
            {t('menu.constructor.modifiers.modal.option.availableLabel')}
          </span>
          <Switch checked={form.isAvailable} onChange={(val) => setForm({ ...form, isAvailable: val })} disabled={isLoading} />
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-brand-gray/10">
          <Button type="button" variant="ghost" onClick={onClose} className="h-9 text-xs font-semibold" disabled={isLoading}>
            {t('menu.constructor.modifiers.modal.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="px-5 h-9 text-xs font-bold shadow-md"
            disabled={!form.name.trim() || isLoading}
            isLoading={isLoading}
          >
            {t('menu.constructor.modifiers.modal.save')}
          </Button>
        </div>
      </form>
    </FloatingPanel>
  );
};