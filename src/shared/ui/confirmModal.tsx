'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Modal } from './modal';
import { Button } from './button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title || t('common.confirmModal.title')}
    >
      <div className="flex flex-col gap-6">
        <p className="text-brand-gray">
          {description || t('common.confirmModal.defaultDesc')}
        </p>
        <div className="flex justify-end gap-3 pt-2 border-t border-brand-gray/10">
          <Button variant="ghost" onClick={onClose}>
            {t('common.confirmModal.cancel')}
          </Button>
          <Button 
            variant="brand" 
            className="bg-red-500 hover:bg-red-600 border-red-500 text-white" 
            onClick={onConfirm}
          >
            {t('common.confirmModal.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};