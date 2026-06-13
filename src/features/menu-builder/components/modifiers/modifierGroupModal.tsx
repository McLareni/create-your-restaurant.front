'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, FloatingPanel, Input, Switch } from '@/shared/ui';
import type { ModifierGroupModalProps } from '@/features/menu-builder/types/modifiers.types';

export const ModifierGroupModal = ({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave,
  errors = {},
  isLoading = false,
}: ModifierGroupModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmitAction = () => {
    if (isLoading) return;
    onSave();
  };

  return (
    <FloatingPanel
      panelId="modifier-group-panel"
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('menu.constructor.modifiers.modal.group.editTitle') : t('menu.constructor.modifiers.modal.group.createTitle')}
      className="w-132 border-brand-copper/20"
    >
      <form action={handleSubmitAction} className="flex flex-col gap-4 text-brand-espresso dark:text-brand-cream">
        <Input
          id="groupName"
          label={t('menu.constructor.modifiers.modal.group.nameLabel')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={isLoading}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="minSelections"
            type="text"
            inputMode="numeric"
            label={t('menu.constructor.modifiers.modal.group.minLabel')}
            placeholder="0"
            value={form.minSelections}
            onChange={(e) => setForm({ ...form, minSelections: e.target.value.replace(/\D/g, '') })}
            disabled={isLoading}
            error={errors.minSelections}
          />
          <Input
            id="maxSelections"
            type="text"
            inputMode="numeric"
            label={t('menu.constructor.modifiers.modal.group.maxLabel')}
            placeholder={t('menu.constructor.modifiers.unlimited')}
            value={form.maxSelections}
            onChange={(e) => setForm({ ...form, maxSelections: e.target.value.replace(/\D/g, '') })}
            disabled={isLoading}
            error={errors.maxSelections}
          />
        </div>

        <div className="flex items-center justify-between border-t border-brand-gray/10 pt-4 mt-2">
          <div className="max-w-[75%]">
            <span className="block text-sm font-semibold text-brand-espresso dark:text-brand-cream">
              {t('menu.constructor.modifiers.modal.group.requiredLabel')}
            </span>
          </div>
          <Switch
            checked={form.isRequired}
            onChange={(val) => setForm({ ...form, isRequired: val, minSelections: val ? '1' : form.minSelections })}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-brand-gray/10">
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose} 
            className="h-9 text-xs font-semibold" 
            disabled={isLoading}
          >
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