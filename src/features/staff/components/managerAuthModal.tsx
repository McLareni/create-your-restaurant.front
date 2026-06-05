import { Modal } from '@/shared/ui/modal';
import { PinPad } from '@/features/staff/components/pinPad';
import { useStaffOps } from '@/features/staff/hooks/useStaffOps';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { ShieldAlert } from 'lucide-react';
import type { ManagerAuthModalProps } from '@/features/staff/types/staff.types';

export const ManagerAuthModal = ({
  isOpen,
  onClose,
  orderId,
  onSuccess,
}: ManagerAuthModalProps) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title={t('staff.ops.managerAuthTitle')}>
      <div className="flex flex-col gap-4 text-brand-espresso dark:text-brand-cream">
        <div className="flex items-center gap-3 border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-500 rounded-xl">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{t('staff.ops.managerAuthDesc')}</span>
        </div>
        <div className="pt-2">
          <PinPad onConfirm={handlePinConfirm} isLoading={isAuthorizingVoid} />
        </div>
      </div>
    </Modal>
  );
};