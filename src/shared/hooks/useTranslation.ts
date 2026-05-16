import { uk } from '@/shared/i18n/uk';

export const useTranslation = () => {
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = uk;
    for (const k of keys) {
      if (value[k] === undefined) return key;
      value = value[k];
    }
    return value;
  };

  return { t };
};