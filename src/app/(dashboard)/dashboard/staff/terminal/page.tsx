'use client';

import { useState } from 'react';
import { StaffShiftManager } from '@/features/staff/components/staffShiftManager';
import { ManagerAuthModal } from '@/features/staff/components/managerAuthModal';
import { Button } from '@/shared/ui';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

export default function StaffTerminalPage() {
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="p-6 flex flex-col gap-8 min-h-screen bg-brand-espresso/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-gray/10 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-espresso dark:text-brand-cream">
            {t('staff.ops.terminalTitle')}
          </h1>
          <p className="text-sm text-brand-gray mt-1">
            {t('staff.ops.terminalDesc')}
          </p>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 border-amber-500/30 text-amber-600 hover:bg-amber-500/10 text-xs"
          icon={<ShieldAlert className="h-4 w-4" />}
          onClick={() => setIsAuthModalOpen(true)}
        >
          {t('staff.ops.managerAuthTitle')}
        </Button>
      </div>

      <div className="py-10">
        <StaffShiftManager />
      </div>

      <ManagerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        orderId="test-order-uuid-12345"
      />
    </div>
  );
}