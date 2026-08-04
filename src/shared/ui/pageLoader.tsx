'use client';

import { RefreshCcw } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

export const PageLoader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <RefreshCcw className="h-5 w-5 animate-spin text-brand-emerald" />
        <span className="text-sm font-medium text-text-muted">
          {t('actions.loading')}
        </span>
      </div>
    </div>
  );
};