'use client';

import { useMenuBuilder } from './hooks/useMenuBuilder';
import { ModifiersTab } from '@/features/menu-builder/components/modifiers/modifiersTab';
import { CombosTab } from '@/features/menu-builder/components/combos/combosTab';
import { MenuBoard } from '@/features/menu-builder/components/board/menuBoard';

export default function MenuConstructorPage() {
  const builder = useMenuBuilder();

  return (
    <div className="flex h-full flex-col bg-brand-cream p-6">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-espresso">
            {builder.t('menu.constructor.title')}
          </h1>
          <p className="mt-2 text-brand-gray">
            {builder.t('menu.constructor.subtitle')}
          </p>
        </div>
      </div>

      <div className="mb-6 flex space-x-1 rounded-xl bg-white p-1 shadow-sm border border-brand-gray/20 max-w-2xl">
        {builder.tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = builder.activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => builder.setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all outline-none cursor-pointer ${
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
        {builder.activeTab === 'board' && <MenuBoard />}
        {builder.activeTab === 'modifiers' && <ModifiersTab />}
        {builder.activeTab === 'combos' && <CombosTab />}
      </div>
    </div>
  );
}