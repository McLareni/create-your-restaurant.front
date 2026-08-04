'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const titleStyle = 'color: #00A46C; font-size: 40px; font-weight: bold; font-family: sans-serif; -webkit-text-stroke: 1px black;';
    const textStyle = 'font-size: 16px; font-weight: 500; font-family: sans-serif; line-height: 1.5;';
    const warnStyle = 'color: #EF4444; font-size: 18px; font-weight: bold; font-family: sans-serif;';

    /* eslint-disable no-console */
    console.log(`%c${t('securityConsole.title')}`, titleStyle);
    console.log(`%c${t('securityConsole.description')}`, textStyle);
    console.log(`%c${t('securityConsole.warning')}`, warnStyle);
    /* eslint-enable no-console */
  }, [t]);

  return <>{children}</>;
};