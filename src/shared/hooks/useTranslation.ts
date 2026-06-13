import { useCallback } from 'react';
import { uk } from '@/shared/i18n/uk';

export const useTranslation = () => {
  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value: unknown = uk;
    for (const k of keys) {
      if (value && typeof value === 'object' && !Array.isArray(value) && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    if (typeof value === 'object' && !Array.isArray(value)) return key;
    return value as string;
  }, []);
  return { t };
};