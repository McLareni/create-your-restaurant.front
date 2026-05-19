'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';

interface BadgeProps {
  type: string;
}

export const Badge = ({ type }: BadgeProps) => {
  const { t } = useTranslation();
  
  if (!type || type === 'NONE') return null;

  const badgeColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700 border-blue-200',
    HIT: 'bg-orange-100 text-orange-700 border-orange-200',
    CHEF_CHOICE: 'bg-purple-100 text-purple-700 border-purple-200',
    TOP_RATED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${badgeColors[type] || 'bg-gray-100 text-gray-700'}`}>
      {t(`menu.constructor.badges.${type}`)}
    </span>
  );
};