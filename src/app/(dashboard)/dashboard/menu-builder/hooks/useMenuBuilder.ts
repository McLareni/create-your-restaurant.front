'use client';

import { useState, useTransition, useMemo } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { LayoutList, Layers, PackagePlus } from 'lucide-react';

export type TabId = 'board' | 'modifiers' | 'combos';

export const useMenuBuilder = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('board');
  const [isPending, startTransition] = useTransition();

  const tabs = useMemo(() => [
    { id: 'board', label: t('menu.constructor.tabs.categories'), icon: LayoutList },
    { id: 'modifiers', label: t('menu.constructor.tabs.modifiers'), icon: Layers },
    { id: 'combos', label: t('menu.constructor.tabs.combos'), icon: PackagePlus },
  ] as const, [t]);

  const handleTabChange = (tabId: TabId) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

  return {
    t,
    activeTab,
    setActiveTab: handleTabChange,
    tabs,
    isPending,
  };
};