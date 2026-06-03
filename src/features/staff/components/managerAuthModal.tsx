import { Modal } from '@/shared/ui';
import { PinPad } from './pinPad';
import { useStaffOps } from '../hooks/useStaffOps';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { ShieldAlert } from 'lucide-react';

interface ManagerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess?: () => void;
}

export const ManagerAuthModal = ({ isOpen, onClose, orderId, onSuccess }: ManagerAuthModalProps) => {
  const { t } = useTranslation();
  const { authorizeVoid, isAuthorizingVoid } = useStaffOps();

  const handlePinConfirm = async (pin: string) => {
    try {
      await authorizeVoid({ pinCode: pin, orderId });
      if (onSuccess) onSuccess();
      onClose();
    } catch {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('staff.ops.managerAuthTitle' as any) || 'Підтвердження адміністратора'}>
      <div className="flex flex-col gap-4 text-brand-espresso dark:text-brand-cream">
        <div className="flex items-center gap-3 p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 text-xs leading-relaxed">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{t('staff.ops.managerAuthDesc' as any) || 'Для скасування або видалення страви з рахунку замовлення потрібне обов’язкове введення ПІН-коду власника чи керуючого закладу.'}</span>
        </div>
        <div className="pt-2">
          <PinPad onConfirm={handlePinConfirm} isLoading={isAuthorizingVoid} />
        </div>
      </div>
    </Modal>
  );
};