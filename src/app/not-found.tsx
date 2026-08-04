'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { Store } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream p-6 text-center select-none animate-fade-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-brand-espresso text-brand-copper shadow-md">
        <Store className="h-10 w-10" />
      </div>
      
      <h1 className="mb-2 text-6xl font-bold text-brand-espresso tracking-tight">
        {t('notFound.title')}
      </h1>
      <h2 className="mb-4 text-xl font-semibold text-brand-espresso">
        {t('notFound.subtitle')}
      </h2>
      <p className="mb-8 max-w-sm text-xs text-brand-gray font-light leading-relaxed">
        {t('notFound.description')}
      </p>
      
      <Button 
        variant="brand" 
        onClick={() => router.push('/dashboard')}
        className="px-8 h-11 text-xs rounded-xl shadow-sm"
      >
        {t('notFound.backButton')}
      </Button>
    </div>
  );
}