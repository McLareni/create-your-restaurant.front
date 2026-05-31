'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { LayoutList, Layers, PackagePlus } from 'lucide-react';

export type TabId = 'board' | 'modifiers' | 'combos';

export const useMenuBuilder = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('board');

  const tabs = [
    { id: 'board', label: t('menu.constructor.tabs.categories'), icon: LayoutList },
    { id: 'modifiers', label: t('menu.constructor.tabs.modifiers'), icon: Layers },
    { id: 'combos', label: t('menu.constructor.tabs.combos'), icon: PackagePlus },
  ] as const;

  return {
    t,
    activeTab,
    setActiveTab,
    tabs,
  };
};