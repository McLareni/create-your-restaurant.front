'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button } from '@/shared/ui/button';
import { LogIn, LogOut, Clock, CheckCircle2 } from 'lucide-react';
import { PinPad } from '@/features/staff/components/pinPad';
import { useStaffShiftManager } from '@/features/staff/hooks/useStaffShiftManager';

export const StaffShiftManager = () => {
  const { t } = useTranslation();
  const {
    mode,
    setMode,
    zReport,
    setZReport,
    isClockingIn,
    isClockingOut,
    handleClockInConfirm,
    handleClockOutConfirm,
  } = useStaffShiftManager();

  const currencyToken = t('menu.currency');

  if (zReport) {
    return (
      <div className="max-w-md mx-auto p-6 bg-brand-espresso text-brand-cream rounded-2xl border border-brand-copper/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-brand-gold">{t('staff.ops.reportTitle')}</h2>
          <p className="text-sm text-brand-gray mt-1">{zReport.waiterName}</p>
        </div>
        
        <div className="flex flex-col gap-3 bg-brand-mocha p-4 rounded-xl border border-brand-gray/10 text-sm">
          <div className="flex justify-between border-b border-brand-gray/10 pb-2 text-brand-gray">
            <span>{t('staff.ops.hours')}</span>
            <span className="font-semibold text-brand-cream">{zReport.totalHours}</span>
          </div>
          <div className="flex justify-between border-b border-brand-gray/10 pb-2 text-brand-gray">
            <span>{t('staff.ops.orders')}</span>
            <span className="font-semibold text-brand-cream">{zReport.totalOrdersClosed}</span>
          </div>
          <div className="flex justify-between border-b border-brand-gray/10 pb-2 text-brand-gray">
            <span>{t('staff.ops.sales')}</span>
            <span className="font-semibold text-brand-gold">{zReport.totalSalesVolume} {currencyToken}</span>
          </div>
          <div className="flex justify-between border-b border-brand-gray/10 pb-2 text-brand-gray">
            <span>{t('staff.ops.basePay')}</span>
            <span className="font-semibold text-brand-cream">{zReport.baseHourlyEarnings} {currencyToken}</span>
          </div>
          <div className="flex justify-between border-b border-brand-gray/10 pb-2 text-brand-gray">
            <span>{t('staff.ops.percentPay')}</span>
            <span className="font-semibold text-brand-cream">{zReport.percentageEarnings} {currencyToken}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-bold text-brand-cream">
            <span>{t('staff.ops.totalPay')}</span>
            <span className="text-green-400">{zReport.finalTotalEarnings} {currencyToken}</span>
          </div>
        </div>
        
        <Button variant="brand" className="w-full mt-6 h-11 text-sm font-bold" onClick={() => setZReport(null)}>
          {t('staff.ops.doneBtn')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 min-h-[60vh]">
      {mode === 'SELECT' && (
        <div className="flex flex-col items-center bg-brand-mocha border border-brand-gray/10 p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
          <Clock className="h-12 w-12 text-brand-copper mb-4 animate-pulse" />
          <h1 className="text-xl font-serif font-bold text-brand-cream mb-2">{t('staff.ops.terminalTitle')}</h1>
          <p className="text-xs text-brand-gray mb-6 leading-relaxed">{t('staff.ops.terminalDesc')}</p>
          
          <div className="flex flex-col gap-3 w-full">
            <Button variant="brand" className="h-12 text-sm font-bold flex items-center justify-center gap-2" icon={<LogIn className="h-4 w-4" />} onClick={() => setMode('IN')}>
              {t('staff.ops.clockInBtn')}
            </Button>
            <Button variant="outline" className="h-12 text-sm font-semibold flex items-center justify-center gap-2 border-brand-gray/20 hover:bg-brand-espresso text-brand-cream" icon={<LogOut className="h-4 w-4" />} onClick={() => setMode('OUT')}>
              {t('staff.ops.clockOutBtn')}
            </Button>
          </div>
        </div>
      )}

      {mode === 'IN' && (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-brand-cream">{t('staff.ops.clockInTitle')}</h2>
            <button onClick={() => setMode('SELECT')} className="text-xs text-brand-copper hover:underline mt-1">
              {t('staff.ops.back')}
            </button>
          </div>
          <PinPad onConfirm={handleClockInConfirm} isLoading={isClockingIn} />
        </div>
      )}

      {mode === 'OUT' && (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-brand-cream">{t('staff.ops.clockOutTitle')}</h2>
            <button onClick={() => setMode('SELECT')} className="text-xs text-brand-copper hover:underline mt-1">
              {t('staff.ops.back')}
            </button>
          </div>
          <PinPad onConfirm={handleClockOutConfirm} isLoading={isClockingOut} />
        </div>
      )}
    </div>
  );
};