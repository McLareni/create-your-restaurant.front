'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Input, Button, FloatingPanel } from '@/shared/ui';
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
      panelId="category-modal-panel"
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing 
        ? t('menu.constructor.categories.modal.editTitle') 
        : t('menu.constructor.categories.modal.createTitle')}
      className="w-full max-w-md border-brand-copper/20"
    >
      <form action={handleSubmitAction} className="space-y-4">
        <div>
          <Input
            id="category-name"
            label={t('menu.constructor.categories.modal.nameLabel')}
            placeholder={t('menu.constructor.categories.modal.namePlaceholder')}
            error={error ? t(error) : undefined}
            disabled={isLoading}
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 mt-2 border-t border-zinc-100 dark:border-brand-gray/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold rounded-xl"
          >
            {t('menu.constructor.categories.modal.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !catName.trim()}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-copper text-white hover:bg-brand-copper/90"
          >
            {isEditing 
              ? t('menu.constructor.categories.modal.save') 
              : t('menu.constructor.categories.addBtn')}
          </Button>
        </div>
      </form>
    </FloatingPanel>
  );
};