import { Card, Button, Input, Switch } from '@/shared/ui';
import { ArrowRightLeft, CheckCircle2, AlertCircle, RefreshCw, HelpCircle, Layers, Settings2, Loader2 } from 'lucide-react';
import { usePosIntegration } from '@/features/pos/hooks/usePosIntegration';

export const PosIntegrationView = () => {
  const state = usePosIntegration();

  if (!state.hasModule) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-brand-cream/30 dark:bg-brand-espresso/20 min-h-[70vh]">
        <div className="text-center max-w-md bg-white dark:bg-brand-mocha p-8 rounded-3xl border border-brand-gray/10 shadow-xl flex flex-col items-center">
          <div className="h-16 w-16 bg-brand-cream dark:bg-brand-espresso rounded-2xl flex items-center justify-center text-brand-gray mb-5">
            <ArrowRightLeft className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-espresso dark:text-brand-cream mb-2">
            {state.t('pos.notEnabledTitle')}
          </h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mb-6 leading-relaxed">
            {state.t('pos.notEnabledDesc')}
          </p>
          <Button variant="brand" onClick={state.handleNavigateToMarketplace} className="w-full h-11 text-sm font-bold shadow-md">
            {state.t('pos.goToMarket')}
          </Button>
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-brand-gray font-medium animate-pulse">
        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-brand-copper" />
        {state.t('actions.loading')}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-brand-cream p-6 dark:bg-brand-espresso transition-colors duration-300">
      <div className="mb-8 border-b border-brand-gray/10 dark:border-brand-gray/20 pb-5">
        <h1 className="text-3xl font-serif font-bold text-brand-espresso dark:text-brand-cream flex items-center gap-3">
          <div className="p-2 bg-brand-copper/10 rounded-xl text-brand-copper">
            <ArrowRightLeft className="h-7 w-7" />
          </div>
          {state.t('pos.title')}
        </h1>
        <p className="mt-2 text-sm text-brand-gray dark:text-brand-gray/80 max-w-2xl leading-relaxed">
          {state.t('pos.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6! border border-brand-gray/10 dark:border-brand-gray/20 shadow-md bg-white dark:bg-brand-mocha rounded-2xl">
            <div className="flex items-center gap-2 mb-5 border-b border-brand-gray/10 dark:border-brand-gray/20 pb-3">
              <Settings2 className="h-5 w-5 text-brand-copper" />
              <h3 className="text-lg font-bold text-brand-espresso dark:text-brand-cream">
                {state.t('pos.posterTitle')}
              </h3>
            </div>
            
            {!state.isConnected ? (
              <div className="flex flex-col gap-5">
                <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 p-4 rounded-xl flex gap-3 text-sm leading-relaxed shadow-xs animate-in fade-in duration-200">
                  <AlertCircle className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
                  <p>{state.t('pos.alertText')}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-4 mt-1">
                  <div className="flex-1 w-full">
                    <Input 
                      id="posterToken" 
                      label={state.t('pos.apiTokenLabel')} 
                      placeholder={state.t('pos.apiTokenPlaceholder')} 
                      value={state.apiKey} 
                      onChange={(e) => state.setApiKey(e.target.value)} 
                      disabled={state.isSyncing} 
                      error={state.validationError || undefined}
                      className="h-11 border-brand-gray/30"
                    />
                  </div>
                  <Button 
                    variant="brand" 
                    onClick={state.handleConnect} 
                    disabled={!state.apiKey.trim() || state.isSyncing} 
                    className="h-11 px-6 font-bold shadow-md w-full sm:w-auto shrink-0 flex items-center justify-center gap-2"
                  >
                    {state.isSyncing && <Loader2 className="h-4 w-4 animate-spin" />}
                    {state.isSyncing ? state.t('pos.connectChecking') : state.t('pos.connectBtn')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3.5 p-4 bg-green-50/80 dark:bg-green-950/10 border border-green-100/70 dark:border-green-900/30 rounded-xl shadow-xs">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 dark:text-green-400 text-base">{state.t('pos.successTitle')}</h4>
                    <p className="text-xs font-medium text-green-600 dark:text-green-500 mt-0.5">{state.t('pos.lastSync')}</p>
                  </div>
                </div>
                
                <div className="pt-2 flex flex-col gap-4">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-brand-gray flex items-center gap-2 mb-1">
                    <Layers className="h-4 w-4 text-brand-copper" />
                    {state.t('pos.syncSettings')}
                  </h4>
                  
                  <div className="flex items-center justify-between p-4 border border-brand-gray/10 rounded-xl bg-brand-cream/10 dark:bg-brand-espresso/10 hover:border-brand-copper/20 transition-all shadow-xs">
                    <div className="pr-4">
                      <span className="block font-bold text-sm text-brand-espresso dark:text-brand-cream">{state.t('pos.importMenu')}</span>
                      <span className="text-xs text-brand-gray dark:text-brand-gray/77 mt-0.5 block leading-relaxed">{state.t('pos.importMenuDesc')}</span>
                    </div>
                    <Switch checked={state.importMenu} onChange={state.handleToggleImportMenu} disabled={state.isSyncing} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-brand-gray/10 rounded-xl bg-brand-cream/10 dark:bg-brand-espresso/10 hover:border-brand-copper/20 transition-all shadow-xs">
                    <div className="pr-4">
                      <span className="block font-bold text-sm text-brand-espresso dark:text-brand-cream">{state.t('pos.syncStops')}</span>
                      <span className="text-xs text-brand-gray dark:text-brand-gray/77 mt-0.5 block leading-relaxed">{state.t('pos.syncStopsDesc')}</span>
                    </div>
                    <Switch checked={state.syncStops} onChange={state.handleToggleSyncStops} disabled={state.isSyncing} />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-brand-gray/10 dark:border-brand-gray/20">
                  <Button 
                    variant="brand" 
                    icon={state.isMenuSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    onClick={state.handleSyncMenu}
                    disabled={state.isMenuSyncing}
                    className="h-10 px-5 text-xs font-bold shadow-md"
                  >
                    {state.t('pos.importMenu')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-1 w-full">
          <div className="p-6 bg-white dark:bg-brand-mocha border border-brand-gray/10 dark:border-brand-gray/20 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 mb-5 border-b border-brand-gray/10 dark:border-brand-gray/20 pb-3">
              <HelpCircle className="h-5 w-5 text-brand-copper" />
              <h3 className="font-serif font-bold text-lg text-brand-espresso dark:text-brand-cream">{state.t('pos.instructionsTitle')}</h3>
            </div>
            <ul className="space-y-4 text-sm text-brand-espresso/90 dark:text-brand-cream/90 relative">
              {[1, 2, 3, 4].map((step) => (
                <li key={step} className="flex gap-3.5 items-start leading-relaxed duration-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-copper text-white font-mono font-bold text-xs shadow-md mt-0.5">
                    {step}
                  </span>
                  <span className="text-[13px] font-medium text-brand-espresso dark:text-brand-cream/80">{state.t(`pos.step${step}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};