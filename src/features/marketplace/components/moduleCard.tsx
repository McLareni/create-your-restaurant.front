'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Card, Button, Switch } from '@/shared/ui';
import { CheckCircle2, Plus, Settings2, Check } from 'lucide-react';
import { MarketplaceModule } from '../types/marketplace.types';

interface ModuleCardProps {
  moduleData: MarketplaceModule;
  isPurchased: boolean;
  isActive: boolean;
  onConnect: (moduleKey: string) => void;
  onToggle: (moduleKey: string, isActive: boolean) => void;
}

export const ModuleCard = ({ moduleData, isPurchased, isActive, onConnect, onToggle }: ModuleCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const Icon = moduleData.icon;

  const getPriceText = (price: number) => {
    if (price === 0) return t('marketplace.price.free');
    return t('marketplace.price.monthly').replace('{{price}}', price.toString());
  };

  const features = t(`marketplace.modules.${moduleData.key}.features`) as unknown as string[];

  const handleSettingsClick = () => {
    const routeMap: Record<string, string> = {
      'menu-engine': '/dashboard/menu-builder',
      'qr-tables': '/dashboard/qr',
      'staff': '/dashboard/staff',
      'pos-sync': '/dashboard/pos',
    };
    
    router.push(routeMap[moduleData.key] || `/dashboard/${moduleData.key}`);
  };

  return (
    <Card className={`p-6! flex flex-col h-full min-h-80 ${isActive ? 'border-brand-copper/30 bg-brand-copper/5 dark:bg-brand-copper/10' : ''}`}>
      <div className="flex justify-between items-start mb-5">
        <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-brand-copper text-white shadow-md' : 'bg-brand-cream text-brand-espresso dark:bg-brand-mocha/50 dark:text-brand-cream'}`}>
          <Icon className="h-6 w-6" />
        </div>
        
        {isPurchased && (
          <div className="flex items-center gap-2 bg-white dark:bg-brand-espresso px-2.5 py-1.5 rounded-full shadow-sm border border-brand-gray/10 dark:border-brand-gray/20">
            <span className={`text-xs font-bold ${isActive ? 'text-green-600 dark:text-green-500' : 'text-brand-gray dark:text-brand-gray/80'}`}>
              {isActive ? t('marketplace.status.enabled') : t('marketplace.status.disabled')}
            </span>
            <Switch checked={isActive} onChange={(val) => onToggle(moduleData.key, val)} />
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-brand-espresso dark:text-brand-cream mb-2">
          {t(`marketplace.modules.${moduleData.key}.title`)}
        </h3>
        <p className="text-sm text-brand-gray dark:text-brand-gray/80 leading-relaxed mb-4">
          {t(`marketplace.modules.${moduleData.key}.description`)}
        </p>
        
        {Array.isArray(features) && (
          <ul className="flex flex-col gap-1.5 mt-auto">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-brand-espresso/80 dark:text-brand-cream/80 font-medium">
                <Check className="h-3.5 w-3.5 text-brand-copper shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-brand-gray/10 dark:border-brand-gray/20 flex items-center justify-between">
        {!isPurchased ? (
          <>
            <span className="font-semibold text-brand-espresso dark:text-brand-cream">
              {getPriceText(moduleData.price)}
            </span>
            <Button 
              variant="outline" 
              className="h-9 px-4 text-sm border-brand-copper text-brand-copper hover:bg-brand-copper hover:text-white"
              onClick={() => onConnect(moduleData.key)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {t('marketplace.status.connect')}
            </Button>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-xs font-bold text-brand-copper">
              <CheckCircle2 className="h-4 w-4" />
              {t('marketplace.status.purchased')}
            </span>
            {isActive && (
              <Button 
                variant="ghost" 
                className="h-8 px-3 text-xs text-brand-gray hover:text-brand-copper outline-none"
                onClick={handleSettingsClick}
              >
                <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                {t('marketplace.status.settings')}
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};