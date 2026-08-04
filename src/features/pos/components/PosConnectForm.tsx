'use client';

import { Button, Input } from '@/shared/ui';
import { HelpCircle, Settings2, AlertCircle, Loader2 } from 'lucide-react';
import { usePosIntegration } from '@/features/pos/hooks/usePosIntegration';
import { HasAccess } from '@/shared/components/hasAccess';
import { PERMISSIONS } from '@/shared/api/menu.constants';

interface PosConnectFormProps {
  state: ReturnType<typeof usePosIntegration>;
}

export const PosConnectForm = ({ state }: PosConnectFormProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full pb-12 animate-in fade-in duration-200">
      <div className="lg:col-span-2 w-full">
        <div className="p-6 border border-solid border-neutral-200 dark:border-neutral-800 bg-bg-surface rounded-2xl shadow-table w-full">
          <div className="flex items-center gap-2 mb-5 border-b border-border-main pb-3">
            <Settings2 className="h-5 w-5 text-brand-emerald" />
            <h3 className="text-lg font-bold text-text-main">{state.t('pos.posterTitle')}</h3>
          </div>
          
          <div className="flex flex-col gap-5 w-full">
            <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 p-4 rounded-xl flex gap-3 text-sm leading-relaxed w-full">
              <AlertCircle className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
              <p className="font-light text-sm">{state.t('pos.alertText')}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 mt-1 w-full">
              <div className="flex-1">
                <Input 
                  id="posterToken" 
                  type="password"
                  label={state.t('pos.apiTokenLabel')} 
                  placeholder={state.t('pos.apiTokenPlaceholder')} 
                  value={state.apiKey} 
                  onChange={(e) => state.setApiKey(e.target.value)} 
                  disabled={state.isSyncing} 
                  error={state.validationError || undefined}
                  className="h-12 border-border-main w-full"
                />
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                {state.isEditingToken && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      state.setIsEditingToken(false);
                      state.setApiKey('');
                    }}
                    disabled={state.isSyncing}
                    className="h-12 px-5 font-bold border-neutral-300 dark:border-neutral-700 hover:bg-bg-element text-text-main rounded-xl transition-all"
                  >
                    {state.t('confirmModal.cancel')}
                  </Button>
                )}
                <HasAccess permission={PERMISSIONS.POS_MANAGE}>
                  <Button 
                    variant="brand" 
                    onClick={state.handleConnect} 
                    disabled={!state.apiKey.trim() || state.isSyncing} 
                    className="h-12 px-6 font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl transition-all flex items-center justify-center shrink-0 shadow-md disabled:opacity-50"
                  >
                    {state.isSyncing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {state.isSyncing ? state.t('pos.connectChecking') : state.t('pos.connectBtn')}
                  </Button>
                </HasAccess>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 w-full">
        <div className="p-6 bg-bg-surface border border-solid border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-table w-full">
          <div className="flex items-center gap-2 mb-5 border-b border-border-main pb-3">
            <HelpCircle className="h-5 w-5 text-brand-emerald" />
            <h3 className="font-bold text-lg text-text-main">{state.t('pos.instructionsTitle')}</h3>
          </div>
          <ul className="space-y-4 text-sm text-text-main">
            {[1, 2, 3, 4].map((step) => (
              <li key={step} className="flex gap-3 items-center leading-normal">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-emerald text-white font-mono font-bold text-xs shadow-sm">
                  {step}
                </span>
                <span className="text-[13px] font-medium text-text-main dark:text-text-main/80">{state.t(`pos.step${step}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};