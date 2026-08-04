'use client';

import React, { useSyncExternalStore } from 'react';
import { Monitor } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

const subscribe = (callback: () => void) => {
  const media = window.matchMedia('(max-width: 767px)');
  
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  } else {
    media.addListener(callback);
    return () => media.removeListener(callback);
  }
};

const getSnapshot = () => window.matchMedia('(max-width: 767px)').matches;
const getServerSnapshot = () => false;

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerMountedSnapshot = () => false;

export const ResponsiveGuard = () => {
  const { t } = useTranslation();
  
  // Використовуємо useSyncExternalStore для безпечного визначення клієнтського рендеру (без useEffect)
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerMountedSnapshot);
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted || !isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-main p-6 text-center animate-fade-in select-none">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-emerald/10 text-brand-emerald shadow-sm">
        <Monitor className="h-10 w-10" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-text-main tracking-tight">
        {t('responsiveGuard.title')}
      </h1>
      <p className="max-w-xs text-xs text-text-muted leading-relaxed font-light">
        {t('responsiveGuard.description')}
      </p>
    </div>
  );
};