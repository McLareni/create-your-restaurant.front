'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { ConfirmModal } from '@/shared/ui';
import { Zap } from 'lucide-react';
import { useMarketplace } from '../hooks/useMarketplace';
import { ModuleCard } from './moduleCard';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useUserStore } from '@/shared/store/useUserStore';
import toast from 'react-hot-toast';

export const MarketplaceList = () => {
  const { t } = useTranslation();
  const { modules, connectModule } = useMarketplace();
  const user = useUserStore((state) => state.user);
  const restaurantId = Number(user?.restaurants?.[0]?.id || 1);
  
  const { hasModule, isPurchased, toggleModule, purchaseModule } = useAccessStore();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmConnection = async () => {
    if (!selectedModule) return;
    
    setIsSubmitting(true);
    try {
      // Спершу зберігаємо на бекенді через проксі-апі
      await connectModule(selectedModule);
      // Оновлюємо локальний Zustand стор
      purchaseModule(selectedModule);
      toast.success(t('marketplace.status.active'));
    } catch (error) {
      toast.error(t('auth.errors.defaultError'));
    } finally {
      setIsSubmitting(false);
      setSelectedModule(null);
    }
  };

  const getModalDescription = () => {
    if (!selectedModule) return '';
    const mod = modules.find(m => m.key === selectedModule);
    if (!mod) return '';
    
    const priceText = mod.price === 0 ? t('marketplace.price.free') : t('marketplace.price.monthly').replace('{{price}}', mod.price.toString());
    
    return t('marketplace.connectModal.description')
      .replace('{{module}}', t(`marketplace.modules.${selectedModule}.title`))
      .replace('{{price}}', priceText);
  };

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-espresso dark:text-brand-cream flex items-center gap-3">
            <Zap className="h-8 w-8 text-brand-copper" />
            {t('marketplace.title')}
          </h1>
          <p className="mt-2 text-brand-gray dark:text-brand-gray/80 max-w-2xl">
            {t('marketplace.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
        {modules.map((mod) => (
          <ModuleCard 
            key={mod.key} 
            moduleData={mod} 
            isPurchased={isPurchased(mod.key)}
            isActive={hasModule(mod.key)} 
            onConnect={setSelectedModule}
            onToggle={toggleModule}
          />
        ))}
      </div>

      <ConfirmModal 
        isOpen={!!selectedModule} 
        onClose={() => !isSubmitting && setSelectedModule(null)} 
        onConfirm={handleConfirmConnection} 
        title={t('marketplace.connectModal.title')}
        description={getModalDescription()}
        confirmLabel={isSubmitting ? t('pos.connectChecking') : t('marketplace.connectModal.confirmBtn')}
        isDestructive={false}
      />
    </div>
  );
};