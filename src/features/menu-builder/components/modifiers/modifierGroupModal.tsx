'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { FloatingPanel, Input, Switch } from '@/shared/ui';
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
      className="max-w-xl"
    >
      <form action={handleSubmitAction} className="flex flex-col gap-4 text-text-main w-full
        [&_input]:bg-bg-main/60! [&_input]:text-text-main! [&_input]:border-border-main/60! [&_input]:w-full [&_input]:rounded-xl! [&_input]:focus:border-brand-emerald/50!
        [&_label]:text-text-main/90! [&_label]:text-xs! [&_label]:font-bold! [&_label]:uppercase! [&_label]:tracking-wider!"
      >
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

        <div className="flex items-center justify-between border-t border-border-main/60 pt-4 mt-2">
          <div className="max-w-[75%]">
            <span className="block text-sm font-semibold text-text-main">
              {t('menu.constructor.modifiers.modal.group.requiredLabel')}
            </span>
          </div>
          <Switch
            checked={form.isRequired}
            onChange={(val) => setForm({ ...form, isRequired: val, minSelections: val ? '1' : form.minSelections })}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-border-main/60">
          <button 
            type="button"
            onClick={onClose} 
            className="h-10 px-4 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-all cursor-pointer border-0 bg-transparent outline-none select-none"
            disabled={isLoading}
          >
            {t('menu.constructor.modifiers.modal.cancel')}
          </button>
          <button
            type="submit"
            disabled={!form.name.trim() || isLoading}
            className="h-10 px-5 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10 select-none"
          >
            {t('menu.constructor.modifiers.modal.save')}
          </button>
        </div>
      </form>
    </FloatingPanel>
  );
};