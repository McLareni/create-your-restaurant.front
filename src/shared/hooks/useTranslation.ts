import { useCallback } from 'react';
import { uk } from '@/shared/i18n/uk';

export type TranslationOptions = Record<string, string | number> & {
  defaultValue?: string;
};

export const useTranslation = () => {
  const t = useCallback((key: string, options?: TranslationOptions) => {
    const { defaultValue, ...replace } = options ?? {};
    const keys = key.split('.');
    let value: unknown = uk;

    for (const k of keys) {
      if (value && typeof value === 'object' && !Array.isArray(value) && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return defaultValue ?? key;
      }
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return defaultValue ?? key;
    }

    let result = (value ?? defaultValue ?? key) as string;
    if (!result) {
      return defaultValue ?? key;
    }

    if (replace) {
      Object.entries(replace).forEach(([placeholder, val]) => {
        result = result.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(val));
      });
    }

    return result;
  }, []);

  return { t };
};