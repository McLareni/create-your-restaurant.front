'use client';

import React, { useState, useMemo } from 'react';
import { Loader2, Check, X, Trash2, Plus } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { FloatingPanel, Checkbox, ConfirmModal, FloatingSidePanel, SearchInput } from '@/shared/ui';
import { DishCardVisual } from '@/shared/ui/dishCardVisual';
import { GeneralTab } from '@/features/menu-builder/components/board/modals/dish-modal/tabs/GeneralTab';
import { CharacteristicsTab } from '@/features/menu-builder/components/board/modals/dish-modal/tabs/CharacteristicsTab';
import { IngredientsTab } from '@/features/menu-builder/components/board/modals/dish-modal/tabs/IngredientsTab';
import { DishModifiersTab } from '@/features/menu-builder/components/board/modals/dish-modal/tabs/DishModifiersTab';
import { MediaTab } from '@/features/menu-builder/components/board/modals/dish-modal/tabs/MediaTab';
import { useDishesLookups } from '@/features/menu-builder/hooks/dishes/useDishesQueries';
import type { DishModalProps } from '@/features/menu-builder/types/dishes.types';
import type { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';
import { DISH_MODAL_TABS, DISH_BADGES } from '@/shared/api/menu.constants';

export const DishModal = ({ isOpen, onClose, dish, state }: DishModalProps) => {
  const { t } = useTranslation();
  const [isBadgePanelOpen, setIsBadgePanelOpen] = useState(false);
  const [badgeSearchQuery, setBadgeSearchQuery] = useState('');
  const [isCharacteristicsPanelOpen, setIsCharacteristicsPanelOpen] = useState(false);
  const [charSearchQuery, setCharSearchQuery] = useState('');
  const [charType, setCharType] = useState<'allergens' | 'tags'>('tags');
  const [deleteCharTarget, setDeleteCharTarget] = useState<{ type: 'allergens' | 'tags'; name: string } | null>(null);

  const { items: dbAllergens, deleteItem: deleteDbAllergen, createItem: createDbAllergen } = useDishesLookups('allergens');
  const { items: dbTags, deleteItem: deleteDbTag, createItem: createDbTag } = useDishesLookups('tags');
  const currentPreviewUrl = state.dishImageUrls[state.activeDishImageIndex] || null;

  const filteredBadges = useMemo(() => {
    return DISH_BADGES.filter((b) =>
      t(`menu.constructor.badges.${b}`).toLowerCase().includes(badgeSearchQuery.toLowerCase()),
    );
  }, [badgeSearchQuery, t]);

  const availableCharacteristics = useMemo(() => {
    const dbItems = charType === 'tags' ? dbTags : dbAllergens;
    return dbItems.filter((item) => item.toLowerCase().includes(charSearchQuery.toLowerCase()));
  }, [charSearchQuery, charType, dbAllergens, dbTags]);

  const exactMatchExists = useMemo(() => {
    const query = charSearchQuery.trim().toLowerCase();
    if (!query) return true;
    const dbItems = charType === 'tags' ? dbTags : dbAllergens;
    return dbItems.some((item) => item.toLowerCase() === query);
  }, [charSearchQuery, charType, dbAllergens, dbTags]);

  const toggleBadgePanel = (open: boolean) => {
    setIsBadgePanelOpen(open);
    if (open) setIsCharacteristicsPanelOpen(false);
  };

  const toggleCharPanel = (open: boolean, type?: 'allergens' | 'tags') => {
    if (type) setCharType(type);
    setIsCharacteristicsPanelOpen(open);
    if (open) setIsBadgePanelOpen(false);
  };

  const handleExecuteDelete = async () => {
    if (!deleteCharTarget) return;
    if (deleteCharTarget.type === 'tags') {
      await deleteDbTag(deleteCharTarget.name);
    } else {
      await deleteDbAllergen(deleteCharTarget.name);
    }
    setDeleteCharTarget(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <FloatingPanel
        panelId="dish-builder-panel"
        isOpen={isOpen}
        onClose={onClose}
        title={dish ? t('menu.constructor.dishes.modal.editTitle') : t('menu.constructor.dishes.modal.createTitle')}
        className="main-dish-panel w-full max-w-[95vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl h-auto max-h-[85vh] animate-in fade-in duration-200"
        contentClassName="flex-1 overflow-hidden p-4"
      >
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 items-stretch w-full text-text-main h-full">
          <div className="md:col-span-2 flex flex-col min-h-0 pb-20">
            <div className="flex gap-4 border-b border-solid border-neutral-200 dark:border-neutral-800 mb-4 pb-2 select-none shrink-0 overflow-x-auto scrollbar-none">
              {DISH_MODAL_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => state.setActiveTab(tab === 'pricing' ? 'general' : tab)}
                  className={`pb-2 text-sm font-semibold cursor-pointer transition-colors relative whitespace-nowrap border-0 bg-transparent outline-none ${
                    (state.activeTab === 'general' && tab === 'pricing') || state.activeTab === tab
                      ? 'border-b-2! border-solid! border-brand-emerald text-brand-emerald font-bold'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  {t(`menu.constructor.dishes.modal.tabs.${tab}`)}
                </button>
              ))}
            </div>

            <form id="dish-builder-form" action={state.formAction} className="flex flex-col w-full [&_input:not([type=checkbox])]:bg-bg-main/40! [&_input:not([type=checkbox])]:text-text-main! [&_input:not([type=checkbox])]:border-border-main/60! [&_input:not([type=checkbox])]:w-full [&_input:not([type=checkbox])]:focus:border-brand-emerald/50!">
              <div className="w-full space-y-4 h-110 overflow-y-auto scrollbar-none pr-1 pb-2">
                <div className={state.activeTab === 'general' ? 'block' : 'hidden'}>
                  <GeneralTab state={state} t={t} onOpenBadgePanel={() => toggleBadgePanel(true)} />
                </div>
                <div className={state.activeTab === 'characteristics' ? 'block' : 'hidden'}>
                  <CharacteristicsTab dishForm={state.dishForm} setDishForm={state.setDishForm} onOpenSidePanel={(type) => toggleCharPanel(true, type)} isSidePanelOpen={isCharacteristicsPanelOpen} activeType={charType} />
                </div>
                <div className={state.activeTab === 'ingredients' ? 'block' : 'hidden'}>
                  <IngredientsTab dishForm={state.dishForm} setDishForm={state.setDishForm} />
                </div>
                <div className={state.activeTab === 'modifiers' ? 'block' : 'hidden'}>
                  <DishModifiersTab state={state} t={t} />
                </div>
                <div className={state.activeTab === 'media' ? 'block' : 'hidden'}>
                  <MediaTab state={state} t={t} />
                </div>
              </div>
            </form>
          </div>

          <div className="hidden md:flex border-l border-solid border-neutral-200 dark:border-neutral-800 bg-bg-main/90 dark:bg-neutral-900/30 pl-6 items-start justify-center shrink-0 -my-4 -mr-4 py-4 px-6 -mb-20">
            <DishCardVisual
              name={state.dishForm.name}
              description={state.dishForm.description}
              price={state.dishForm.price}
              weight={state.dishForm.weight}
              calories={state.dishForm.calories}
              cookingTime={state.dishForm.cookingTime}
              badge={state.dishForm.badge}
              isAvailable={state.dishForm.isAvailable}
              imageUrl={currentPreviewUrl}
              className="sticky top-4 select-none animate-in fade-in duration-300"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-3 px-6 py-4 border-t border-solid border-border-main/60 bg-bg-surface shrink-0 z-20 select-none rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={state.isSaving}
            className="h-10 px-4 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-all cursor-pointer border-0 bg-transparent outline-none select-none"
          >
            {t('menu.constructor.dishes.modal.cancel')}
          </button>
          <button
            type="submit"
            form="dish-builder-form"
            disabled={state.isSaving}
            className="h-10 px-5 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10 select-none flex items-center justify-center gap-1.5"
          >
            {state.isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {dish ? t('menu.constructor.dishes.modal.save') : t('menu.constructor.dishes.addBtn')}
          </button>
        </div>
      </FloatingPanel>

      <FloatingSidePanel id="dish-left-badge-panel" isOpen={isBadgePanelOpen} onClose={() => toggleBadgePanel(false)} title={t('menu.constructor.dishes.modal.badgeLabel')} targetSelector=".main-dish-panel" targetPanelId="dish-builder-panel" side="left" width={280} className="transition-none! animate-in slide-in-from-left duration-200">
        <div className="h-12 px-4 border-b border-solid border-border-main/60 flex items-center justify-between bg-bg-main/30 shrink-0">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">{t('menu.constructor.dishes.modal.badgeLabel')}</h3>
          <button type="button" onClick={() => toggleBadgePanel(false)} className="text-text-muted hover:text-text-main p-1 rounded-md hover:bg-bg-hover transition-colors cursor-pointer"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-3 pb-1 shrink-0">
          <SearchInput
            id="badge-search-field"
            placeholder={t('menu.constructor.dishes.modal.searchPlaceholder')}
            value={badgeSearchQuery}
            onChange={(e) => setBadgeSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar">
          {filteredBadges.length === 0 ? (
            <span className="text-xs text-text-muted text-center py-6 font-light">{t('menu.constructor.dishes.modal.notFound')}</span>
          ) : (
            filteredBadges.map((b) => {
              const isSelected = state.dishForm.badge === b;
              return (
                <div key={b} onClick={() => state.setDishForm((prev: DishFormValues) => ({ ...prev, badge: b }))} className={`w-full flex items-center justify-between px-2.5 h-9 rounded-md cursor-pointer transition-all select-none border border-solid ${isSelected ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-3xs' : 'border-transparent hover:bg-bg-hover'}`}>
                  <span className={`text-xs font-semibold truncate transition-colors ${isSelected ? 'text-brand-emerald font-bold' : 'text-text-main'}`}>{t(`menu.constructor.badges.${b}`)}</span>
                  {isSelected && <Check className="h-4 w-4 text-brand-emerald shrink-0" />}
                </div>
              );
            })
          )}
        </div>
        <div className="p-4 bg-bg-main/10 border-t border-solid border-border-main/60 flex justify-end shrink-0 mt-auto">
          <button type="button" onClick={() => toggleBadgePanel(false)} className="h-8 px-4 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover rounded-md shadow-md transition-colors">{t('menu.constructor.dishes.modal.doneBtn')}</button>
        </div>
      </FloatingSidePanel>

      <FloatingSidePanel id="dish-left-char-panel" isOpen={isCharacteristicsPanelOpen} onClose={() => toggleCharPanel(false)} title={charType === 'tags' ? t('menu.constructor.dishes.modal.tabs.characteristics') : t('menu.constructor.dishes.modal.properties.allergensTitle')} targetSelector=".main-dish-panel" targetPanelId="dish-builder-panel" side="left" width={320} className="transition-none! animate-in slide-in-from-left duration-200">
        <div className="h-12 px-4 border-b border-solid border-border-main/60 flex items-center justify-between bg-bg-main/30 shrink-0">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">{charType === 'tags' ? t('menu.constructor.dishes.modal.tabs.characteristics') : t('menu.constructor.dishes.modal.properties.allergensTitle')}</h3>
          <button type="button" onClick={() => toggleCharPanel(false)} className="text-text-muted hover:text-text-main p-1 rounded-md hover:bg-bg-hover transition-colors cursor-pointer"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-3 pb-1 shrink-0">
          <SearchInput
            id="char-search-field"
            placeholder={t('menu.constructor.dishes.modal.searchPlaceholder')}
            value={charSearchQuery}
            onChange={(e) => setCharSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar">
          {charSearchQuery.trim() !== '' && !exactMatchExists && (
            <button
              type="button"
              onClick={async () => {
                const name = charSearchQuery.trim().toUpperCase();
                if (charType === 'tags') {
                  await createDbTag(name);
                  const current = state.dishForm.tags || [];
                  if (!current.includes(name)) {
                    state.setDishForm((prev: DishFormValues) => ({ ...prev, tags: [...current, name] }));
                  }
                } else {
                  await createDbAllergen(name);
                  const current = state.dishForm.allergens || [];
                  if (!current.includes(name)) {
                    state.setDishForm((prev: DishFormValues) => ({ ...prev, allergens: [...current, name] }));
                  }
                }
                setCharSearchQuery('');
              }}
              className="w-full flex items-center gap-2 px-2.5 h-9 bg-brand-emerald/5 hover:bg-brand-emerald/10 text-brand-emerald text-xs font-bold rounded-md transition-all cursor-pointer border border-dashed border-brand-emerald/20 mb-1 shrink-0"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>
                {t('menu.constructor.dishes.modal.createAction')}{' '}
                &ldquo;{charSearchQuery.trim().toUpperCase()}&rdquo;
              </span>
            </button>
          )}
          {availableCharacteristics.length === 0 && (charSearchQuery.trim() === '' || exactMatchExists) ? (
            <span className="text-xs text-text-muted text-center py-6 font-light">{t('menu.constructor.dishes.modal.notFound')}</span>
          ) : (
            availableCharacteristics.map((item) => {
              const isSelected = charType === 'tags' ? state.dishForm.tags?.includes(item) : state.dishForm.allergens?.includes(item);
              const isCustomDbItem = charType === 'tags' ? dbTags.includes(item) : dbAllergens.includes(item);

              return (
                <div key={item} onClick={() => {
                  const current = charType === 'tags' ? state.dishForm.tags || [] : state.dishForm.allergens || [];
                  const next = isSelected ? current.filter((i) => i !== item) : [...current, item];

                  state.setDishForm((prev: DishFormValues) => ({ ...prev, [charType]: next }));
                }} className={`w-full flex items-center justify-between px-2.5 h-9 rounded-md cursor-pointer transition-all select-none border border-solid ${isSelected ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-3xs' : 'border-transparent hover:bg-bg-hover'}`}>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Checkbox id={`char-item-${item}`} checked={isSelected} onChange={() => {}} />
                    <span className={`text-xs font-semibold truncate transition-colors ${isSelected ? 'text-brand-emerald font-bold' : 'text-text-main'}`}>{item}</span>
                  </div>
                  {isCustomDbItem && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteCharTarget({ type: charType, name: item }); }} className="text-text-muted hover:text-red-500 p-1 rounded-md hover:bg-bg-hover transition-colors ml-2 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="p-4 bg-bg-main/10 border-t border-solid border-border-main/60 flex justify-end shrink-0 mt-auto">
          <button type="button" onClick={() => toggleCharPanel(false)} className="h-8 px-4 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover rounded-md shadow-md transition-colors">{t('menu.constructor.dishes.modal.doneBtn')}</button>
        </div>
      </FloatingSidePanel>

      <ConfirmModal isOpen={!!deleteCharTarget} onClose={() => setDeleteCharTarget(null)} onConfirm={handleExecuteDelete} title={t('confirmModal.title')} description={t('confirmModal.defaultDesc')} />
    </>
  );
};