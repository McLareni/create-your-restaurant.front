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
  confirmLabel?: string;   // Новий проп для тексту
  isDestructive?: boolean; // Новий проп для кольору
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  confirmLabel,
  isDestructive = true // За замовчуванням залишаємо червоним (для видалень)
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title || t('confirmModal.title')}
    >
      <div className="flex flex-col gap-6">
        <p className="text-brand-gray dark:text-brand-gray/80">
          {description || t('confirmModal.defaultDesc')}
        </p>
        <div className="flex justify-end gap-3 pt-2 border-t border-brand-gray/10 dark:border-brand-gray/20">
          <Button variant="ghost" onClick={onClose}>
            {t('confirmModal.cancel')}
          </Button>
          <Button 
            variant="brand" 
            // Якщо це деструктивна дія — робимо червоним, інакше — стандартним мідним
            className={isDestructive ? "bg-red-500 hover:bg-red-600 border-red-500 text-white" : ""} 
            onClick={onConfirm}
          >
            {confirmLabel || t('confirmModal.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};