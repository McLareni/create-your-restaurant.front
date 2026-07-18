import { useCallback } from 'react';
import { uk } from '@/shared/i18n/uk';

export const useTranslation = () => {
  const t = useCallback((key: string, replace?: Record<string, string | number>) => {
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
    
    let result = value as string;
    if (replace) {
      Object.entries(replace).forEach(([placeholder, val]) => {
        result = result.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(val));
      });
    }
    return result;
  }, []);
  return { t };
};