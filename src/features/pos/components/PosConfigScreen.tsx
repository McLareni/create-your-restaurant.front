import { Button, Switch, ConfirmModal, Input } from '@/shared/ui';
import { CheckCircle2, RefreshCw, Layers, Loader2, LogOut, ChevronRight, KeyRound } from 'lucide-react';
import { usePosIntegration } from '../hooks/usePosIntegration';

interface PosConfigScreenProps {
  state: ReturnType<typeof usePosIntegration>;
}

export const PosConfigScreen = ({ state }: PosConfigScreenProps) => {
  return (
    <div className="w-full pb-12 animate-in fade-in duration-300 flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-bg-surface border border-solid border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-table w-full">
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-text-main text-base">{state.t('pos.successTitle')}</h4>
            <p className="text-xs font-medium text-text-muted mt-0.5">{state.t('pos.lastSync')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => state.setIsDisconnectModalOpen(true)}
          disabled={state.isSyncing || state.isMenuSyncing}
          className="h-10 px-4 text-xs font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 active:scale-98 border border-solid border-red-500/20 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer outline-none select-none"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{state.t('actions.delete')}</span>
        </button>
      </div>

      <div className="border border-solid border-neutral-200 dark:border-neutral-800 bg-bg-surface rounded-2xl shadow-table overflow-hidden w-full transition-all">
        <button
          type="button"
          onClick={() => state.setIsTokenPanelOpen(!state.isTokenPanelOpen)}
          className="w-full flex items-center gap-3.5 p-5 text-left font-bold text-sm text-text-main hover:bg-bg-element/40 transition-colors outline-none cursor-pointer select-none"
        >
          <ChevronRight className={`h-4 w-4 text-text-muted transform transition-transform duration-300 ${state.isTokenPanelOpen ? 'rotate-90' : ''}`} />
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand-emerald" />
            <span>{state.t('pos.tokenSection')}</span>
          </div>
        </button>
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${state.isTokenPanelOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="p-5 border-t border-solid border-neutral-100 dark:border-neutral-800/60 bg-bg-surface flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <Input
                  id="maskedPosterToken"
                  type="text"
                  label={state.t('pos.apiTokenLabel')}
                  value={state.maskedApiKey || '•••• •••• •••• 4821'}
                  disabled
                  leftIcon={<KeyRound className="h-4 w-4 text-text-muted/50" />}
                  className="h-11 border-border-main bg-bg-main/50 font-mono tracking-wide"
                />
              </div>
              <Button
                variant="brand"
                onClick={() => state.setIsEditingToken(true)}
                disabled={state.isMenuSyncing}
                className="h-11 px-6 text-xs font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl shadow-md transition-all shrink-0"
              >
                {state.t('marketplace.status.settings')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border border-solid border-neutral-200 dark:border-neutral-800 bg-bg-surface rounded-2xl shadow-table overflow-hidden w-full transition-all">
        <button
          type="button"
          onClick={() => state.setIsSettingsPanelOpen(!state.isSettingsPanelOpen)}
          className="w-full flex items-center gap-3.5 p-5 text-left font-bold text-sm text-text-main hover:bg-bg-element/40 transition-colors outline-none cursor-pointer select-none"
        >
          <ChevronRight className={`h-4 w-4 text-text-muted transform transition-transform duration-300 ${state.isSettingsPanelOpen ? 'rotate-90' : ''}`} />
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-emerald" />
            <span>{state.t('pos.syncSettings')}</span>
          </div>
        </button>
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${state.isSettingsPanelOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="p-5 border-t border-solid border-neutral-100 dark:border-neutral-800/60 bg-bg-surface flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 border border-solid border-neutral-200 dark:border-neutral-800/60 rounded-xl bg-bg-main hover:border-brand-emerald/20 transition-all shadow-sm w-full">
                <div className="pr-4 text-left">
                  <span className="block font-bold text-sm text-text-main">{state.t('pos.importMenu')}</span>
                  <span className="text-xs text-text-muted mt-0.5 block leading-relaxed font-light">{state.t('pos.importMenuDesc')}</span>
                </div>
                <Switch checked={state.importMenu} onChange={state.handleToggleImportMenu} disabled={state.isMenuSyncing} />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-solid border-neutral-200 dark:border-neutral-800/60 rounded-xl bg-bg-main hover:border-brand-emerald/20 transition-all shadow-sm w-full">
                <div className="pr-4 text-left">
                  <span className="block font-bold text-sm text-text-main">{state.t('pos.syncStops')}</span>
                  <span className="text-xs text-text-muted mt-0.5 block leading-relaxed font-light">{state.t('pos.syncStopsDesc')}</span>
                </div>
                <Switch checked={state.syncStops} onChange={state.handleToggleSyncStops} disabled={state.isMenuSyncing} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-solid border-border-main w-full mt-2">
        <Button 
          variant="brand" 
          onClick={state.handleSyncMenu}
          disabled={state.isMenuSyncing}
          className="h-11 px-5 text-xs font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          {state.isMenuSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {state.t('pos.importMenu')}
        </Button>
      </div>

      <ConfirmModal
        isOpen={state.isDisconnectModalOpen}
        onClose={() => state.setIsDisconnectModalOpen(false)}
        onConfirm={() => state.handleDisconnect()}
        title={state.t('pos.title')}
        description={state.t('confirmModal.defaultDesc')}
      />
    </div>
  );
};