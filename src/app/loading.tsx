'use client';

import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

export default function GlobalLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-main text-text-main transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-brand-emerald" />
        <p className="text-sm font-medium text-text-muted animate-pulse">
          {t('loading')}
        </p>
      </div>
    </div>
  );
}