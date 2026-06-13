'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button } from '@/shared/ui/button';
import { LogIn, LogOut, Clock, CheckCircle2 } from 'lucide-react';
import { PinPad } from '@/features/staff/components/pinPad';
import { useStaffShiftManager } from '@/features/staff/hooks/useStaffShiftManager';
import type { StaffShiftManagerProps } from '@/features/staff/types/staff.types';

export const StaffShiftManager = ({ restaurantId }: StaffShiftManagerProps) => {
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
  } = useStaffShiftManager(restaurantId);
  const currencyToken = t('menu.currency');

  if (zReport) {
    return (
      <div className="max-w-md mx-auto p-6 bg-bg-surface text-text-main rounded-3xl border border-solid border-border-main shadow-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-text-main">{t('staff.ops.reportTitle')}</h2>
          <p className="text-sm text-text-muted mt-1 font-light">{zReport.waiterName}</p>
        </div>
        
        <div className="flex flex-col gap-3 bg-bg-main p-4 rounded-2xl border border-solid border-border-main text-sm">
          <div className="flex justify-between border-b border-solid border-border-main/60 pb-2 text-text-muted">
            <span className="font-light">{t('staff.ops.hours')}</span>
            <span className="font-bold text-text-main">{zReport.totalHours}</span>
          </div>
          <div className="flex justify-between border-b border-solid border-border-main/60 pb-2 text-text-muted">
            <span className="font-light">{t('staff.ops.orders')}</span>
            <span className="font-bold text-text-main">{zReport.totalOrdersClosed}</span>
          </div>
          <div className="flex justify-between border-b border-solid border-border-main/60 pb-2 text-text-muted">
            <span className="font-light">{t('staff.ops.sales')}</span>
            <span className="font-bold text-brand-emerald">{zReport.totalSalesVolume} {currencyToken}</span>
          </div>
          <div className="flex justify-between border-b border-solid border-border-main/60 pb-2 text-text-muted">
            <span className="font-light">{t('staff.ops.basePay')}</span>
            <span className="font-bold text-text-main">{zReport.baseHourlyEarnings} {currencyToken}</span>
          </div>
          <div className="flex justify-between border-b border-solid border-border-main/60 pb-2 text-text-muted">
            <span className="font-light">{t('staff.ops.percentPay')}</span>
            <span className="font-bold text-text-main">{zReport.percentageEarnings} {currencyToken}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-bold text-text-main">
            <span>{t('staff.ops.totalPay')}</span>
            <span className="text-emerald-600 dark:text-emerald-400">{zReport.finalTotalEarnings} {currencyToken}</span>
          </div>
        </div>
        
        <Button variant="brand" className="w-full mt-6 h-12 text-sm font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl transition-all" onClick={() => setZReport(null)}>
          {t('staff.ops.doneBtn')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 min-h-[60vh]">
      {mode === 'SELECT' && (
        <div className="flex flex-col items-center bg-bg-surface border border-solid border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-xs w-full max-w-sm text-center">
          <Clock className="h-12 w-12 text-brand-emerald mb-4 animate-pulse" />
          <h1 className="text-xl font-bold text-text-main mb-2">{t('staff.ops.terminalTitle')}</h1>
          <p className="text-xs text-text-muted mb-6 leading-relaxed font-light">{t('staff.ops.terminalDesc')}</p>
          
          <div className="flex flex-col gap-3 w-full">
            <Button variant="brand" className="h-12 text-sm font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl transition-all" icon={<LogIn className="h-4 w-4" />} onClick={() => setMode('IN')}>
              {t('staff.ops.clockInBtn')}
            </Button>
            <Button variant="outline" className="h-12 text-sm font-bold border border-solid border-neutral-200 dark:border-border-main rounded-xl transition-all text-text-main hover:bg-bg-element bg-transparent" icon={<LogOut className="h-4 w-4" />} onClick={() => setMode('OUT')}>
              {t('staff.ops.clockOutBtn')}
            </Button>
          </div>
        </div>
      )}

      {mode === 'IN' && (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-text-main">{t('staff.ops.clockInTitle')}</h2>
            <button onClick={() => setMode('SELECT')} className="text-xs text-brand-emerald hover:underline mt-1 font-semibold cursor-pointer border-0 bg-transparent">
              {t('staff.ops.back')}
            </button>
          </div>
          <PinPad onConfirm={handleClockInConfirm} isLoading={isClockingIn} />
        </div>
      )}

      {mode === 'OUT' && (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-text-main">{t('staff.ops.clockOutTitle')}</h2>
            <button onClick={() => setMode('SELECT')} className="text-xs text-brand-emerald hover:underline mt-1 font-semibold cursor-pointer border-0 bg-transparent">
              {t('staff.ops.back')}
            </button>
          </div>
          <PinPad onConfirm={handleClockOutConfirm} isLoading={isClockingOut} />
        </div>
      )}
    </div>
  );
};