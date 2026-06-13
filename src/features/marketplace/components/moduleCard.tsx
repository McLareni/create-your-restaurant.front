'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Switch } from '@/shared/ui';
import { Check, Settings2, Plus, Lock } from 'lucide-react';
import { ModuleCardProps } from '../types/marketplace.types';

export const ModuleCard = ({
  moduleData,
  isPurchased,
  isActive,
  onConnect,
  onToggle,
  onSettingsClick,
  isDisabled = false,
}: ModuleCardProps) => {
  const { t } = useTranslation();
  const Icon = moduleData.icon;

  const priceText = moduleData.price === 0 
    ? t('marketplace.price.free') 
    : t('marketplace.price.monthly').replace('{{price}}', moduleData.price.toString());

  const features = t(`marketplace.modules.${moduleData.key}.features`) as unknown as string[];

  const isModuleActive = isPurchased && isActive;
  const isModuleInactivePurchased = isPurchased && !isActive;

  let cardClasses = "p-6 flex flex-col justify-between w-full h-[380px] rounded-2xl bg-bg-surface transition-all duration-300 relative border scale-100 outline-none shadow-table";
  
  if (isModuleActive) {
    cardClasses += " border-brand-emerald shadow-table-selected";
  } else if (isModuleInactivePurchased) {
    cardClasses += " border-border-main/60 dark:border-border-main";
  } else {
    cardClasses += " border-border-main/40 dark:border-border-main/50 hover:border-border-main";
  }

  if (isDisabled) {
    cardClasses += " opacity-60 pointer-events-none";
  }

  let iconWrapperClasses = "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 border border-transparent";
  let iconClasses = "h-4 w-4";

  if (isModuleActive) {
    iconWrapperClasses += " bg-brand-emerald/10 border-brand-emerald/20";
    iconClasses += " text-brand-emerald";
  } else {
    iconWrapperClasses += " bg-bg-element";
    iconClasses += " text-text-muted";
  }

  return (
    <div className={cardClasses}>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-4 gap-4 shrink-0">
          <div className={iconWrapperClasses}>
            <Icon className={iconClasses} />
          </div>

          {isPurchased && (
            <div className="flex items-center gap-2.5 shrink-0">
              <div className={`flex items-center justify-center px-3 py-1 rounded-md w-auto border transition-colors ${
                isModuleActive ? 'bg-bg-element border-brand-emerald/10' : 'bg-bg-element border-transparent'
              }`}>
                <span className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap text-center transition-colors ${
                  isModuleActive ? 'text-brand-emerald' : 'text-text-muted/60'
                }`}>
                  {isActive ? t('marketplace.status.enabled') : t('marketplace.status.disabled')}
                </span>
              </div>
              <Switch checked={isActive} disabled={isDisabled} onChange={(val) => onToggle(moduleData.key, val)} />
            </div>
          )}
        </div>

        <div className={`flex flex-col flex-1 overflow-hidden transition-opacity ${
          isModuleInactivePurchased ? 'opacity-65' : 'opacity-100'
        }`}>
          <h3 className="text-base font-bold text-text-main tracking-tight mb-1 line-clamp-1 shrink-0">
            {t(`marketplace.modules.${moduleData.key}.title`)}
          </h3>
          <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2 font-light shrink-0">
            {t(`marketplace.modules.${moduleData.key}.description`)}
          </p>
          
          {Array.isArray(features) && (
            <div className="flex-1 border-t border-border-main pt-3 overflow-hidden">
              <ul className="flex flex-col gap-1.5 h-full">
                {features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-text-main font-medium">
                    <Check className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                      isModuleActive ? 'text-brand-emerald' : 'text-text-muted/40'
                    }`} />
                    <span className="truncate w-full text-text-main/90 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border-main flex items-center justify-between gap-2 shrink-0">
        {!isPurchased ? (
          <>
            <span className="text-xs font-bold text-text-main tracking-tight bg-bg-element px-2.5 py-1 rounded-md truncate border border-transparent">
              {priceText}
            </span>
            <button 
              type="button"
              onClick={() => onConnect(moduleData.key)}
              className="h-8.5 px-4 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 border-0 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              {t('marketplace.status.connect')}
            </button>
          </>
        ) : (
          <>
            <span className={`text-xs font-bold flex items-center gap-1.5 transition-colors truncate ${
              isModuleActive ? 'text-brand-emerald' : 'text-text-muted/60'
            }`}>
              {isModuleActive ? (
                <Check className="h-3.5 w-3.5"/>
              ) : (
                <Lock className="h-3.5 w-3.5 opacity-40"/>
              )}
              {t('marketplace.status.purchased')}
            </span>
            <button 
              type="button"
              onClick={() => onSettingsClick(moduleData.key)}
              disabled={isDisabled || !isActive}
              className={`h-8 px-3 text-xs font-medium rounded-lg border transition-all flex items-center gap-1 shrink-0 ${
                isModuleActive 
                  ? 'bg-bg-element border-border-main text-text-muted hover:text-brand-emerald cursor-pointer pointer-events-auto' 
                  : 'bg-transparent border-border-main/50 text-text-muted/30 pointer-events-none opacity-40'
              }`}
            >
              <Settings2 className="h-3.5 w-3.5" />
              {t('marketplace.status.settings')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};