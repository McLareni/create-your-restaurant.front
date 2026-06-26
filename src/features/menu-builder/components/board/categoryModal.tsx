'use client';

import React from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Input, FloatingPanel } from '@/shared/ui';
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
      title={isEditing ? t('menu.constructor.categories.modal.editTitle') : t('menu.constructor.categories.modal.createTitle')}
      className="max-w-md"
    >
      <form action={handleSubmitAction} className="flex flex-col gap-4 text-text-main w-full
        [&_input]:bg-bg-main/40! [&_input]:text-text-main! [&_input]:border-solid! [&_input]:border-neutral-300! dark:[&_input]:border-neutral-700! [&_input]:w-full [&_input]:rounded-xl! [&_input]:focus:border-brand-emerald/50!
        [&_label]:text-text-main/90! [&_label]:text-xs! [&_label]:font-bold! [&_label]:uppercase! [&_label]:tracking-wider!"
      >
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-solid border-border-main/60 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-4 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-all cursor-pointer border-0 bg-transparent outline-none select-none"
          >
            {t('menu.constructor.categories.modal.cancel')}
          </button>
          <button
            type="submit"
            disabled={isLoading || !catName.trim()}
            className="h-10 px-5 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10 select-none"
          >
            {isEditing ? t('menu.constructor.categories.modal.save') : t('menu.constructor.categories.addBtn')}
          </button>
        </div>
      </form>
    </FloatingPanel>
  );
};