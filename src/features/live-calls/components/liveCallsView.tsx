'use client';

import { Card, Button } from '@/shared/ui';
import { BellRing, UserCheck, Receipt, Clock, Check, Loader2 } from 'lucide-react';
import { useLiveCalls } from '../hooks/useLiveCalls';

export const LiveCallsView = () => {
  const state = useLiveCalls();

  if (!state.hasModule) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-brand-cream/30 dark:bg-brand-espresso/20 min-h-[70vh]">
        <div className="text-center max-w-md bg-white dark:bg-brand-mocha p-8 rounded-3xl border border-brand-gray/10 shadow-xl flex flex-col items-center">
          <div className="h-16 w-16 bg-brand-cream dark:bg-brand-espresso rounded-2xl flex items-center justify-center text-brand-gray mb-5">
            <BellRing className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-espresso dark:text-brand-cream mb-2">
            {state.t('liveCalls.notEnabledTitle')}
          </h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mb-6 leading-relaxed">
            {state.t('liveCalls.notEnabledDesc')}
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
        {state.t('actions.loading')}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-brand-cream p-6 dark:bg-brand-espresso transition-colors duration-300">
      <div className="mb-8 border-b border-brand-gray/10 dark:border-brand-gray/20 pb-5">
        <h1 className="text-3xl font-serif font-bold text-brand-espresso dark:text-brand-cream flex items-center gap-3">
          <div className="p-2 bg-brand-copper/10 rounded-xl text-brand-copper relative">
            <BellRing className="h-7 w-7" />
            {state.calls.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
                {state.calls.length}
              </span>
            )}
          </div>
          {state.t('liveCalls.title')}
        </h1>
        <p className="mt-2 text-sm text-brand-gray dark:text-brand-gray/80 max-w-2xl leading-relaxed">
          {state.t('liveCalls.subtitle')}
        </p>
      </div>

      {state.calls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-brand-mocha rounded-3xl border border-dashed border-brand-gray/20 shadow-xs">
          <BellRing className="h-12 w-12 text-brand-gray/30 mb-3 animate-pulse" />
          <p className="text-brand-gray text-sm font-medium">{state.t('liveCalls.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-start">
          {state.calls.map((call) => {
            const isWaiter = call.type === 'WAITER';
            const isButtonDisabled = state.dismissingIds.includes(call.id);

            return (
              <Card 
                key={call.id} 
                className={`p-5! border rounded-2xl shadow-sm transition-all flex flex-col justify-between min-h-44 ${
                  isWaiter 
                    ? 'border-amber-100 bg-amber-50/20 dark:bg-amber-950/10' 
                    : 'border-blue-100 bg-blue-50/20 dark:bg-blue-950/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-brand-gray/10 pb-3 mb-3">
                    <span className="text-2xl font-serif font-black text-brand-espresso dark:text-brand-cream">
                      №{call.tableNumber}
                    </span>
                    <div className={`p-2 rounded-xl shrink-0 ${isWaiter ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}`}>
                      {isWaiter ? <UserCheck className="h-5 w-5" /> : <Receipt className="h-5 w-5" />}
                    </div>
                  </div>

                  <div className="text-sm font-bold text-brand-espresso dark:text-brand-cream mb-2">
                    {isWaiter ? state.t('liveCalls.typeWaiter') : state.t('liveCalls.typeBill')}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-brand-gray dark:text-brand-gray/70">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(call.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <Button
                    variant="outline"
                    onClick={() => state.handleDismiss(call.id)}
                    disabled={isButtonDisabled}
                    className="w-full h-9 text-xs font-bold border-brand-gray/20 hover:bg-brand-copper hover:text-white hover:border-brand-copper rounded-xl transition-all shadow-xs"
                    icon={isButtonDisabled ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Check className="h-3.5 w-3.5 mr-1.5" />}
                  >
                    {state.t('liveCalls.doneBtn')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};