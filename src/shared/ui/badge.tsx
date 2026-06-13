'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';

interface BadgeProps {
  type: string;
}

export const Badge = ({ type }: BadgeProps) => {
  const { t } = useTranslation();
  
  if (!type || type === 'NONE') return null;

  const badgeColors: Record<string, string> = {
    NEW: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    HIT: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
    CHEF_CHOICE: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
    TOP_RATED: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border border-solid ${badgeColors[type] || 'bg-bg-element text-text-muted'}`}>
      {t(`menu.constructor.badges.${type}`)}
    </span>
  );
};