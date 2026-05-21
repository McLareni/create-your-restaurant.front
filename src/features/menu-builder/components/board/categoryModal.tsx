'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, FloatingPanel, Input } from '@/shared/ui';
import { categorySchema } from '../../schemas/categories.schema';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  catName: string;
  setCatName: (name: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const CategoryModal = ({ isOpen, onClose, isEditing, catName, setCatName, onSave, isLoading = false }: CategoryModalProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setError(null);
  }, [isOpen]);

  const handleValidateAndSave = () => {
    const result = categorySchema.safeParse({ name: catName });
    if (!result.success) {
      setError(t(result.error.issues[0].message));
      return;
    }
    setError(null);
    onSave();
  };

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
          onChange={(e) => {
            setCatName(e.target.value);
            if (error) setError(null);
          }} 
          disabled={isLoading}
          error={error || undefined}
        />
        <div className="flex justify-end gap-2 pt-3 border-t border-brand-gray/10 mt-1">
          <Button variant="ghost" className="h-9 text-sm" onClick={onClose} disabled={isLoading}>
            {t('menu.constructor.categories.modal.cancel')}
          </Button>
          <Button variant="brand" className="h-9 text-sm" onClick={handleValidateAndSave} disabled={isLoading} isLoading={isLoading}>
            {t('menu.constructor.categories.modal.save')}
          </Button>
        </div>
      </div>
    </FloatingPanel>
  );
};