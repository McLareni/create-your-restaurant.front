import { Button } from '@/shared/ui';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { usePosIntegration } from '@/features/pos/hooks/usePosIntegration';
import { PosConnectForm } from './PosConnectForm';
import { PosConfigScreen } from './PosConfigScreen';

export const PosIntegrationView = () => {
  const state = usePosIntegration();

  if (!state.hasModule) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-bg-main min-h-[70vh] transition-colors">
        <div className="text-center max-w-md bg-bg-surface p-8 rounded-3xl border border-solid border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col items-center">
          <div className="h-16 w-16 bg-bg-element rounded-2xl flex items-center justify-center text-text-muted mb-5">
            <ArrowRightLeft className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-2">
            {state.t('pos.notEnabledTitle')}
          </h2>
          <p className="text-sm text-text-muted mb-6 leading-relaxed font-light">
            {state.t('pos.notEnabledDesc')}
          </p>
          <Button variant="brand" onClick={state.handleNavigateToMarketplace} className="w-full h-12 text-sm font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl shadow-md transition-all">
            {state.t('pos.goToMarket')}
          </Button>
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-text-muted font-medium bg-bg-main min-h-screen">
        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-brand-emerald" />
        {state.t('actions.loading')}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg-main p-6 text-text-main overflow-x-hidden transition-colors duration-300">
      <div className="mb-8 border-b border-border-main pb-5 max-w-7xl w-full mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-3">
          <div className="p-2 bg-brand-emerald/10 rounded-xl text-brand-emerald">
            <ArrowRightLeft className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          {state.t('pos.title')}
        </h1>
        <p className="mt-2 text-xs md:text-sm text-text-muted max-w-2xl leading-relaxed font-light">
          {state.t('pos.subtitle')}
        </p>
      </div>

      {!state.isConnected ? (
        <PosConnectForm state={state} />
      ) : (
        <PosConfigScreen state={state} />
      )}
    </div>
  );
};