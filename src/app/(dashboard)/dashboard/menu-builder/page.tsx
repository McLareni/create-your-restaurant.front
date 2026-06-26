'use client';

import { useMenuBuilder } from '@/app/(dashboard)/dashboard/menu-builder/hooks/useMenuBuilder';
import { ModifiersTab } from '@/features/menu-builder/components/modifiers/modifiersTab';
import { CombosTab } from '@/features/menu-builder/components/combos/combosTab';
import { MenuBoard } from '@/features/menu-builder/components/board/menuBoard';

export default function MenuConstructorPage() {
  const builder = useMenuBuilder();

  return (
    <div className="flex h-full flex-col bg-bg-main p-6 transition-colors duration-300 text-text-main">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight">
            {builder.t('menu.constructor.title')}
          </h1>
          <p className="mt-1.5 text-xs md:text-sm text-text-muted font-light">
            {builder.t('menu.constructor.subtitle')}
          </p>
        </div>
      </div>

      <div className="mb-6 flex space-x-1 rounded-xl bg-bg-surface p-1 shadow-sm border border-solid border-neutral-300 dark:border-neutral-700 max-w-2xl shrink-0">
        {builder.tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = builder.activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => builder.setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs md:text-sm font-bold transition-all border-0 outline-none cursor-pointer select-none ${
                isActive 
                  ? 'bg-brand-emerald text-white shadow-md' 
                  : 'text-text-muted hover:bg-bg-hover hover:text-text-main bg-transparent'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 rounded-3xl bg-bg-surface shadow-table border border-solid border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto custom-scrollbar flex flex-col relative">
        {builder.activeTab === 'board' && <MenuBoard />}
        {builder.activeTab === 'modifiers' && <ModifiersTab />}
        {builder.activeTab === 'combos' && <CombosTab />}
      </div>
    </div>
  );
}