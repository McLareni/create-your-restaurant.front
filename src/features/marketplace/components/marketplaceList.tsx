'use client';

import { FloatingPanel, Input, Button } from '@/shared/ui';
import { Zap, Info } from 'lucide-react';
import { useMarketplace } from '../hooks/useMarketplace';
import { ModuleCard } from './moduleCard';

export const MarketplaceList = () => {
  const state = useMarketplace();

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-espresso dark:text-brand-cream flex items-center gap-3">
            <Zap className="h-8 w-8 text-brand-copper" />
            {state.t('marketplace.title')}
          </h1>
          <p className="mt-2 text-brand-gray dark:text-brand-gray/80 max-w-2xl">
            {state.t('marketplace.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
        {state.modules.map((mod) => (
          <ModuleCard 
            key={mod.key} 
            moduleData={mod} 
            isPurchased={state.isModulePurchased(mod.key)}
            isActive={state.isModuleActive(mod.key)} 
            onConnect={state.handleOpenConnectModal}
            onToggle={state.handleToggleModule}
            onSettingsClick={state.handleSettingsClick}
          />
        ))}
      </div>

      {!!state.selectedModule && (
        <FloatingPanel
          panelId="marketplace-connect-panel"
          isOpen={!!state.selectedModule}
          onClose={state.handleCloseConnectModal}
          title={state.t('marketplace.connectModal.title')}
          className="w-full max-w-md"
        >
          <form onSubmit={state.handleConfirmConnection} className="space-y-4 text-brand-espresso dark:text-brand-cream">
            <div className="bg-brand-cream/40 dark:bg-brand-espresso/40 p-4 rounded-xl border border-brand-gray/10 flex gap-3 text-sm leading-relaxed">
              <Info className="h-5 w-5 text-brand-copper shrink-0 mt-0.5" />
              <p>{state.modalDescription}</p>
            </div>

            <div>
              <Input
                id="activation-code-input"
                label={state.t('marketplace.connectModal.activationCodeLabel')}
                placeholder={state.t('marketplace.connectModal.activationCodePlaceholder')}
                value={state.activationCode}
                onChange={(e) => state.setActivationCode(e.target.value)}
                disabled={state.isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-brand-gray/10">
              <Button
                type="button"
                variant="ghost"
                className="h-10 text-xs font-semibold"
                onClick={state.handleCloseConnectModal}
                disabled={state.isSubmitting}
              >
                {state.t('confirmModal.cancel')}
              </Button>
              <Button
                type="submit"
                variant="brand"
                className="px-5 h-10 text-xs font-bold shadow-md"
                isLoading={state.isSubmitting}
                disabled={state.isSubmitting}
              >
                {state.t('marketplace.connectModal.confirmBtn')}
              </Button>
            </div>
          </form>
        </FloatingPanel>
      )}
    </div>
  );
};