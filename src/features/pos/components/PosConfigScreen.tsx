import { Button, Switch } from '@/shared/ui';
import { CheckCircle2, RefreshCw, Layers, Loader2 } from 'lucide-react';
import { usePosIntegration } from '../hooks/usePosIntegration';

interface PosConfigScreenProps {
  state: ReturnType<typeof usePosIntegration>;
}

export const PosConfigScreen = ({ state }: PosConfigScreenProps) => {
  return (
    <div className="max-w-7xl w-full mx-auto pb-12 animate-in fade-in duration-300">
      <div className="p-6 border border-solid border-neutral-200 dark:border-neutral-800 bg-bg-surface rounded-3xl shadow-xs flex flex-col gap-6">
        
        <div className="flex items-center gap-3.5 p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-xs">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-text-main text-base">{state.t('pos.successTitle')}</h4>
            <p className="text-xs font-medium text-text-muted mt-0.5">{state.t('pos.lastSync')}</p>
          </div>
        </div>
        
        <div className="pt-2 flex flex-col gap-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-brand-emerald" />
            {state.t('pos.syncSettings')}
          </h4>
          
          <div className="flex items-center justify-between p-4 border border-solid border-neutral-200 dark:border-neutral-800 rounded-xl bg-bg-main hover:border-brand-emerald/30 transition-all shadow-xs">
            <div className="pr-4 text-left">
              <span className="block font-bold text-sm text-text-main">{state.t('pos.importMenu')}</span>
              <span className="text-xs text-text-muted mt-0.5 block leading-relaxed font-light">{state.t('pos.importMenuDesc')}</span>
            </div>
            <Switch checked={state.importMenu} onChange={state.handleToggleImportMenu} disabled={state.isSyncing} />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-solid border-neutral-200 dark:border-neutral-800 rounded-xl bg-bg-main hover:border-brand-emerald/30 transition-all shadow-xs">
            <div className="pr-4 text-left">
              <span className="block font-bold text-sm text-text-main">{state.t('pos.syncStops')}</span>
              <span className="text-xs text-text-muted mt-0.5 block leading-relaxed font-light">{state.t('pos.syncStopsDesc')}</span>
            </div>
            <Switch checked={state.syncStops} onChange={state.handleToggleSyncStops} disabled={state.isSyncing} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-solid border-border-main">
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

      </div>
    </div>
  );
};