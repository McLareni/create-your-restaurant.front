'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Modal, Input } from '@/shared/ui';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  catName: string;
  setCatName: (name: string) => void;
  onSave: () => void;
}

export const CategoryModal = ({ isOpen, onClose, isEditing, catName, setCatName, onSave }: CategoryModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? t('menu.constructor.categories.modal.editTitle') : t('menu.constructor.categories.modal.createTitle')}>
      <div className="flex flex-col gap-4">
        <Input 
          id="catName" 
          label={t('menu.constructor.categories.modal.nameLabel')} 
          value={catName} 
          onChange={(e) => setCatName(e.target.value)} 
        />
        <div className="flex justify-end gap-2 pt-3 border-t border-brand-gray/10 mt-1">
          <Button variant="ghost" className="h-9 text-sm" onClick={onClose}>
            {t('menu.constructor.dishes.modal.cancel')}
          </Button>
          <Button variant="brand" className="h-9 text-sm" onClick={onSave} disabled={!catName.trim()}>
            {t('menu.constructor.dishes.modal.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};