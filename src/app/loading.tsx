'use client';

import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

export default function GlobalLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream text-brand-espresso">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-brand-copper" />
        <p className="text-sm font-medium text-brand-gray animate-pulse">
          {t('loading')}
        </p>
      </div>
    </div>
  );
}