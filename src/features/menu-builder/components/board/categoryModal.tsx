'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { FloatingPanel, Input, Button } from '@/shared/ui';
import { CategoryModalProps } from '../../types/categories.types';

export const CategoryModal = ({ 
  isOpen, 
  onClose, 
  isEditing, 
  catName, 
  setCatName, 
  onSave, 
  isLoading = false,
  error 
}: CategoryModalProps & { error?: string | null }) => {
  const { t } = useTranslation();

  return (
    <FloatingPanel 
      panelId="category-modal" 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? t('menu.constructor.categories.modal.editTitle') : t('menu.constructor.categories.modal.createTitle')}
    >
      <div className="flex flex-col gap-4">
        <Input 
          id="catName" 
          label={t('menu.constructor.categories.modal.nameLabel')} 
          value={catName} 
          onChange={(e) => setCatName(e.target.value)} 
          disabled={isLoading}
          error={error || undefined}
        />
        <div className="flex justify-end gap-2 pt-3 border-t border-brand-gray/10 mt-1">
          <Button variant="ghost" className="h-9 text-sm" onClick={onClose} disabled={isLoading}>
            {t('menu.constructor.categories.modal.cancel')}
          </Button>
          <Button variant="brand" className="h-9 text-sm" onClick={onSave} disabled={isLoading} isLoading={isLoading}>
            {t('menu.constructor.categories.modal.save')}
          </Button>
        </div>
      </div>
    </FloatingPanel>
  );
};