'use client';

import React from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { useMenuBuilder } from '@/features/menu-builder/hooks/useMenuBuilder';
import { ModifiersTab } from '@/features/menu-builder/components/modifiers/modifiersTab';
import { CombosTab } from '@/features/menu-builder/components/combos/combosTab';
import { MenuBoard } from '@/features/menu-builder/components/board/menuBoard';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export default function MenuConstructorPage() {
  const builder = useMenuBuilder();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);

  return (
    <div className="flex h-full flex-col bg-bg-main p-6 transition-colors duration-300 text-text-main">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight">
            {builder.t('menu.constructor.title')}
          </h1>
          <p className="mt-1.5 text-xs md:text-sm text-text-muted font-light">
            {builder.t('menu.constructor.subtitle')}
          </p>
        </div>

        {activeRestaurant?.slug && (
          <Link
            href={`/menu/${activeRestaurant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-solid border-neutral-300 dark:border-neutral-700 bg-bg-surface px-4 text-xs font-bold text-text-main shadow-2xs hover:bg-bg-hover/40 transition-all active:scale-98"
          >
            <Eye className="h-4 w-4 text-brand-emerald" />
            <span>{builder.t('menu.constructor.viewMenu')}</span>
          </Link>
        )}
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