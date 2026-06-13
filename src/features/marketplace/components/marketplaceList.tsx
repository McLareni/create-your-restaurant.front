'use client';

import { FloatingPanel, Input } from '@/shared/ui';
import { Zap, Info } from 'lucide-react';
import { useMarketplace } from '@/features/marketplace/hooks/useMarketplace';
import { ModuleCard } from '@/features/marketplace/components/moduleCard';

export const MarketplaceList = () => {
  const state = useMarketplace();

  return (
    <div className="flex min-h-screen w-full flex-col p-8 bg-bg-main text-text-main overflow-x-hidden transition-colors">
      
      <div className="mb-8 flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-brand-emerald flex items-center justify-center text-white">
              <Zap className="h-4 w-4 fill-white text-white" />
            </div>
            {state.t('marketplace.title')}
          </h1>
          <p className="mt-1 text-xs text-text-muted max-w-2xl font-light">
            {state.t('marketplace.subtitle')}
          </p>
        </div>
      </div>

      <div 
        className="grid gap-6 pb-12 w-full"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
      >
        {state.modules.map((mod) => (
          <ModuleCard 
            key={mod.key} 
            moduleData={mod} 
            isPurchased={state.isModulePurchased(mod.key)}
            isActive={state.isModuleActive(mod.key)} 
            onConnect={state.handleOpenConnectModal}
            onToggle={state.handleToggleModule}
            onSettingsClick={state.handleSettingsClick}
            isDisabled={state.isPending}
          />
        ))}
      </div>

      {!!state.selectedModule && (
        <FloatingPanel
          panelId="marketplace-connect-panel"
          isOpen={!!state.selectedModule}
          onClose={state.handleCloseConnectModal}
          title={state.t('marketplace.connectModal.title')}
          className="w-full max-w-md border border-border-main bg-bg-surface shadow-md rounded-2xl"
        >
          <form action={state.handleConfirmConnectionAction} className="space-y-4 text-text-main">
            <div className="bg-bg-element border border-border-main p-4 rounded-xl flex gap-2.5 text-xs leading-relaxed font-medium">
              <Info className="h-4 w-4 text-brand-emerald shrink-0 mt-0.5" />
              <p className="text-text-main/90">{state.modalDescription}</p>
            </div>

            <div className="p-0.5">
              <Input
                id="activation-code-input"
                label={state.t('marketplace.connectModal.activationCodeLabel')}
                placeholder={state.t('marketplace.connectModal.activationCodePlaceholder')}
                value={state.activationCode}
                onChange={(e) => state.setActivationCode(e.target.value)}
                disabled={state.isPending}
                className="rounded-lg h-11 border-border-main bg-bg-element text-text-main placeholder:text-text-muted/40"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-border-main">
              <button
                type="button"
                onClick={state.handleCloseConnectModal}
                disabled={state.isPending}
                className="px-3.5 h-9 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-lg transition-all cursor-pointer"
              >
                {state.t('confirmModal.cancel')}
              </button>
              <button
                type="submit"
                disabled={state.isPending}
                className="px-4 h-9 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-lg transition-all cursor-pointer"
              >
                {state.t('marketplace.connectModal.confirmBtn')}
              </button>
            </div>
          </form>
        </FloatingPanel>
      )}
    </div>
  );
};