'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { ModifiersTab } from '@/features/menu-builder/components/modifiers/modifiersTab';
import { CombosTab } from '@/features/menu-builder/components/combos/combosTab';
import { MenuBoard } from '@/features/menu-builder/components/board/menuBoard';
import { LayoutList, Layers, PackagePlus } from 'lucide-react';

type TabId = 'board' | 'modifiers' | 'combos';

export default function MenuConstructorPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('board');

  const tabs = [
    { id: 'board', label: t('menu.constructor.tabs.categories'), icon: LayoutList },
    { id: 'modifiers', label: t('menu.constructor.tabs.modifiers'), icon: Layers },
    { id: 'combos', label: t('menu.constructor.tabs.combos'), icon: PackagePlus },
  ] as const;

  return (
    <div className="flex h-full flex-col bg-brand-cream p-6">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-espresso">
            {t('menu.constructor.title')}
          </h1>
          <p className="mt-2 text-brand-gray">
            {t('menu.constructor.subtitle')}
          </p>
        </div>
      </div>

      <div className="mb-6 flex space-x-1 rounded-xl bg-white p-1 shadow-sm border border-brand-gray/20 max-w-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all outline-none ${
                isActive 
                  ? 'bg-brand-copper text-white shadow-md' 
                  : 'text-brand-gray hover:bg-brand-gray/10 hover:text-brand-espresso'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 rounded-3xl bg-white shadow-xl border border-brand-gray/20 p-6 overflow-y-auto custom-scrollbar flex flex-col relative">
        {activeTab === 'board' && <MenuBoard />}
        {activeTab === 'modifiers' && <ModifiersTab />}
        {activeTab === 'combos' && <CombosTab />}
      </div>
    </div>
  );
}