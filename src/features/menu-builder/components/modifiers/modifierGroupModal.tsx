'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { FloatingPanel, Input, Switch } from '@/shared/ui';
import { FormActionsFooter } from '@/shared/ui/formActionsFooter';
import type { ModifierGroup } from '@/features/menu-builder/types/modifiers.types';

interface ModifierGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  editingGroup: ModifierGroup | null;
  groupFormAction: (formData: FormData) => void;
  errors?: Record<string, string>;
  isLoading?: boolean;
}

export const ModifierGroupModal = ({
  isOpen,
  onClose,
  isEditing,
  editingGroup,
  groupFormAction,
  errors = {},
  isLoading = false,
}: ModifierGroupModalProps) => {
  const { t } = useTranslation();
  const [isRequiredChecked, setIsRequiredChecked] = useState<boolean>(!!editingGroup?.isRequired);

  if (!isOpen) return null;

  return (
    <FloatingPanel
      panelId="modifier-group-panel"
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('menu.constructor.modifiers.modal.group.editTitle') : t('menu.constructor.modifiers.modal.group.createTitle')}
      className="max-w-xl"
    >
      <form 
        action={groupFormAction} 
        className="flex flex-col gap-4 text-text-main w-full
          [&_input]:bg-bg-main/60! [&_input]:text-text-main! [&_input]:border-border-main/60! [&_input]:w-full [&_input]:rounded-xl! [&_input]:focus:border-brand-emerald/50!
          [&_label]:text-text-main/90! [&_label]:text-xs! [&_label]:font-bold! [&_label]:uppercase! [&_label]:tracking-wider!"
      >
        <Input
          id="groupName"
          name="name"
          label={t('menu.constructor.modifiers.modal.group.nameLabel')}
          defaultValue={editingGroup?.name || ''}
          disabled={isLoading}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="minSelections"
            name="minSelections"
            type="text"
            inputMode="numeric"
            label={t('menu.constructor.modifiers.modal.group.minLabel')}
            placeholder="0"
            defaultValue={editingGroup?.minSelections ?? (isRequiredChecked ? '1' : '0')}
            disabled={isLoading}
            error={errors.minSelections}
          />
          <Input
            id="maxSelections"
            name="maxSelections"
            type="text"
            inputMode="numeric"
            label={t('menu.constructor.modifiers.modal.group.maxLabel')}
            placeholder={t('menu.constructor.modifiers.unlimited')}
            defaultValue={editingGroup?.maxSelections ?? ''}
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
          <input type="hidden" name="isRequired" value={isRequiredChecked ? 'on' : 'off'} />
          <Switch
            checked={isRequiredChecked}
            onChange={(val) => setIsRequiredChecked(val)}
            disabled={isLoading}
          />
        </div>

        <FormActionsFooter 
          onCancel={onClose} 
          submitLabel={t('menu.constructor.modifiers.modal.save')}
          cancelLabel={t('menu.constructor.modifiers.modal.cancel')}
          className="mt-2"
        />
      </form>
    </FloatingPanel>
  );
};