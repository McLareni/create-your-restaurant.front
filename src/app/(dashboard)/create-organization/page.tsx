'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUserStore } from '@/shared/store/useUserStore';
import { CreateOrganizationView } from '@/features/organizations/components/createOrganizationView';
import toast from 'react-hot-toast';

export default function CreateOrganizationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isLoading } = useUserStore();

  useEffect(() => {
    if (!isLoading && user && user.restaurants && user.restaurants.length >= 3) {
      toast.error(t('sidebar.limitReached'));
      router.push('/dashboard');
    }
  }, [user, isLoading, router, t]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-cream dark:bg-brand-espresso">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-copper border-t-transparent" />
      </div>
    );
  }

  if (user && user.restaurants && user.restaurants.length >= 3) {
    return null;
  }

  return <CreateOrganizationView />;
}