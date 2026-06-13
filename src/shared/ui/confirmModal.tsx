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
  confirmLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  confirmLabel,
  isDestructive = true
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title || t('confirmModal.title')}
    >
      <div className="flex flex-col gap-6">
        <p className="text-text-muted font-light">
          {description || t('confirmModal.defaultDesc')}
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t border-solid border-border-main">
          <Button variant="ghost" onClick={onClose} className="h-10 text-xs">
            {t('confirmModal.cancel')}
          </Button>
          <Button 
            variant="brand" 
            className={`h-10 text-xs px-5 ${isDestructive ? "bg-red-500 hover:bg-red-600 text-white" : ""}`} 
            onClick={onConfirm}
          >
            {confirmLabel || t('confirmModal.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};