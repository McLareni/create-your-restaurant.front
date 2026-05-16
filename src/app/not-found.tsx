'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { Store } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream p-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-espresso text-brand-copper shadow-xl">
        <Store className="h-12 w-12" />
      </div>
      
      <h1 className="mb-2 text-7xl font-serif font-bold text-brand-espresso">
        {t('notFound.title')}
      </h1>
      <h2 className="mb-4 text-2xl font-medium text-brand-espresso">
        {t('notFound.subtitle')}
      </h2>
      <p className="mb-8 max-w-md text-brand-gray">
        {t('notFound.description')}
      </p>
      
      <Button 
        variant="brand" 
        onClick={() => router.push('/dashboard')}
        className="px-8"
      >
        {t('notFound.backButton')}
      </Button>
    </div>
  );
}