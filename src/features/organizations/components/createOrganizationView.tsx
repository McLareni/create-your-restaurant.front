'use client';

import { useUserStore } from '@/shared/store/useUserStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button } from '@/shared/ui';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateOrganization } from '../hooks/useCreateOrganization';
import { CreateOrgAnimation } from './createOrgAnimation';
import { CreateOrgForm } from './createOrgForm';

export const CreateOrganizationView = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const organizationState = useCreateOrganization();
  
  const user = useUserStore((state) => state.user);
  const activeModules = useAccessStore((state) => state.activeModules);

  const restaurants = user?.restaurants || [];
  const hasMultiModule = activeModules.includes('multi-restaurant');
  const maxAllowed = hasMultiModule ? 3 : 1;

  if (restaurants.length >= maxAllowed) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-bg-main p-4 md:p-8 text-text-main">
        <div className="w-full max-w-md rounded-3xl bg-bg-surface p-8 shadow-2xl border border-border-main flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-300">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm animate-pulse">
            <Lock className="h-8 w-8 stroke-2" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">
              {t('sidebar.locked.title')}
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {t('marketplace.modules.multi-restaurant.description')}
            </p>
          </div>

          <div className="w-full pt-2 flex flex-col gap-2">
            <Button 
              variant="brand" 
              onClick={() => router.push('/dashboard/marketplace')}
              className="w-full h-11 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              {t('sidebar.locked.activateBtn')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="w-full h-11 rounded-xl text-xs font-bold border-neutral-700 text-neutral-400 cursor-pointer"
            >
              {t('sidebar.nav.dashboard')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (organizationState.animationStep > 0) {
    return (
      <CreateOrgAnimation 
        state={{
          animationStep: organizationState.animationStep,
          formData: {
            name: organizationState.formData.name ?? '',
            slug: organizationState.formData.slug ?? '',
          }
        }} 
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-main p-4 md:p-8">
      <CreateOrgForm state={organizationState} />
    </div>
  );
};