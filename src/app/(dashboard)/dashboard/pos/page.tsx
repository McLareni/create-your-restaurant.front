'use client';

import { Card, Button, Input, Switch } from '@/shared/ui';
import { ArrowRightLeft, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { usePosIntegration } from '@/features/pos/hooks/usePosIntegration';

export default function PosIntegrationPage() {
  const state = usePosIntegration();

  if (!state.hasModule) {
    return (
      <div className="flex h-full items-center justify-center p-6 bg-brand-cream dark:bg-brand-espresso">
        <div className="text-center max-w-md">
          <ArrowRightLeft className="h-16 w-16 text-brand-gray/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-espresso dark:text-brand-cream mb-2">{state.t('pos.notEnabledTitle')}</h2>
          <p className="text-brand-gray dark:text-brand-gray/80 mb-6">{state.t('pos.notEnabledDesc')}</p>
          <Button variant="brand" onClick={state.handleNavigateToMarketplace}>
            {state.t('pos.goToMarket')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-brand-cream p-6 dark:bg-brand-espresso">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-espresso dark:text-brand-cream flex items-center gap-3">
            <ArrowRightLeft className="h-8 w-8 text-brand-copper" />
            {state.t('pos.title')}
          </h1>
          <p className="mt-2 text-brand-gray dark:text-brand-gray/80 max-w-2xl">
            {state.t('pos.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6!">
            <h3 className="text-lg font-bold text-brand-espresso dark:text-brand-cream mb-4">{state.t('pos.posterTitle')}</h3>
            {!state.isConnected ? (
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 p-4 rounded-lg flex gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{state.t('pos.alertText')}</p>
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Input id="posterToken" label={state.t('pos.apiTokenLabel')} placeholder={state.t('pos.apiTokenPlaceholder')} value={state.apiKey} onChange={(e) => state.setApiKey(e.target.value)} disabled={state.isSyncing} />
                  </div>
                  <Button variant="brand" onClick={state.handleConnect} disabled={!state.apiKey.trim() || state.isSyncing} >
                    {state.isSyncing ? state.t('pos.connectChecking') : state.t('pos.connectBtn')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-bold text-green-900 dark:text-green-300">{state.t('pos.successTitle')}</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">{state.t('pos.lastSync')}</p>
                  </div>
                  <Button variant="outline" className="ml-auto border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => state.setIsConnected(false)}>
                    {state.t('pos.disconnectBtn')}
                  </Button>
                </div>
                <div className="border-t border-brand-gray/10 pt-6 flex flex-col gap-4">
                  <h4 className="font-semibold text-brand-espresso dark:text-brand-cream">{state.t('pos.syncSettings')}</h4>
                  <div className="flex items-center justify-between p-3 border border-brand-gray/10 rounded-lg bg-white dark:bg-brand-mocha">
                    <div>
                      <span className="block font-medium text-brand-espresso dark:text-brand-cream">{state.t('pos.importMenu')}</span>
                      <span className="text-sm text-brand-gray dark:text-brand-gray/70">{state.t('pos.importMenuDesc')}</span>
                    </div>
                    <Switch checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-brand-gray/10 rounded-lg bg-white dark:bg-brand-mocha">
                    <div>
                      <span className="block font-medium text-brand-espresso dark:text-brand-cream">{state.t('pos.syncStops')}</span>
                      <span className="text-sm text-brand-gray dark:text-brand-gray/70">{state.t('pos.syncStopsDesc')}</span>
                    </div>
                    <Switch checked={true} onChange={() => {}} />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button variant="brand" icon={<Save className="h-4 w-4" />}>
                    {state.t('pos.saveBtn')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="p-6! bg-brand-espresso text-brand-cream border-none dark:bg-brand-mocha">
            <h3 className="font-bold text-lg mb-4 text-white">{state.t('pos.instructionsTitle')}</h3>
            <ul className="space-y-4 text-sm text-brand-cream/80 relative">
              {[1, 2, 3, 4].map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-copper text-white font-bold text-xs">{step}</span>
                  <span>{state.t(`pos.step${step}` as any)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}