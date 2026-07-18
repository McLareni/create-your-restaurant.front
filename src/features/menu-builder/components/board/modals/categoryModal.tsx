'use client';

import React from 'react';
import { Input, FloatingPanel } from '@/shared/ui';
import { FormActionsFooter } from '@/shared/ui/formActionsFooter';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { CategoryModalProps } from '@/features/menu-builder/types/categories.types';

export const CategoryModal = ({
  isOpen,
  onClose,
  isEditing,
  catName,
  setCatName,
  onSave,
  error,
  isLoading = false,
}: CategoryModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmitAction = () => {
    if (isLoading) return;
    onSave();
  };

  return (
    <FloatingPanel
      panelId="category-editor-panel"
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('menu.constructor.categories.modal.editTitle') : t('menu.constructor.categories.modal.createTitle')}
      className="max-w-md"
    >
      <form
        id="category-modal-form"
        action={handleSubmitAction}
        className="flex flex-col gap-4 text-text-main w-full [&_input]:bg-bg-main/40! [&_input]:text-text-main! [&_input]:border-border-main/60! [&_input]:w-full [&_input]:rounded-xl! [&_input]:focus:border-brand-emerald/50!"
      >
        <Input
          id="category-name-input"
          label={t('menu.constructor.categories.modal.nameLabel')}
          placeholder={t('menu.constructor.categories.modal.namePlaceholder')}
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
          disabled={isLoading}
          error={error ? t(error) : undefined}
        />
        <FormActionsFooter
          onCancel={onClose}
          submitLabel={isEditing ? t('menu.constructor.categories.modal.save') : t('menu.constructor.categories.addBtn')}
          cancelLabel={t('menu.constructor.categories.modal.cancel')}
        />
      </form>
    </FloatingPanel>
  );
};