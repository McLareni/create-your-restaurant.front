'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useInventoryTab } from '@/features/menu-builder/hooks/inventory/useInventoryTab';
import { AVAILABLE_UNITS } from '@/features/menu-builder/schemas/inventory.schema';
import { Input, Select, ConfirmModal, FloatingPanel, Button } from '@/shared/ui';
import { PageLoader } from '@/shared/ui/pageLoader';
import { FormActionsFooter } from '@/shared/ui/formActionsFooter';
import { Search, AlertCircle, Package, Edit2, Trash2 } from 'lucide-react';
import type { InventoryItem } from '@/features/menu-builder/types/inventory.types';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { usePermissions } from '@/shared/hooks/usePermissions';

export const InventoryTab = () => {
  const board = useInventoryTab();
  const router = useRouter();
  const hasInventoryModule = useAccessStore((state) => state.hasModule('inventory'));
  const { canManageInventory } = usePermissions();

  if (!hasInventoryModule) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-brand-cream p-6 dark:bg-brand-espresso">
        <div className="max-w-xl rounded-xl border border-brand-gray/10 bg-white p-8 text-center shadow-sm dark:border-brand-gray/20 dark:bg-brand-mocha">
          <Package className="mx-auto mb-4 h-12 w-12 text-brand-gray/40" />
          <h2 className="text-2xl font-bold text-brand-espresso dark:text-brand-cream">
            {board.t('inventory.notEnabledTitle')}
          </h2>
          <p className="mt-2 text-brand-gray dark:text-brand-gray/80">
            {board.t('inventory.notEnabledDesc')}
          </p>
          <div className="mt-6">
            <Button variant="brand" onClick={() => router.push('/dashboard/marketplace')}>
              {board.t('pos.goToMarket')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (board.isLoading && board.filteredItems.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="w-full h-full p-4 select-none flex flex-col text-text-main bg-bg-main">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-solid border-border-main/60 pb-4">
        <div>
          <h2 className="text-xl font-bold text-text-main tracking-tight">
            {board.t('inventory.title')}
          </h2>
          <p className="text-sm text-text-muted font-light mt-1">
            {board.t('inventory.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-text-muted/40" />
            <input
              type="text"
              placeholder={board.t('inventory.searchPlaceholder')}
              value={board.searchQuery}
              onChange={(e) => board.setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-full border border-solid border-neutral-300 dark:border-neutral-700 text-sm text-text-main pl-9 pr-4 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-colors placeholder:text-text-muted/40"
            />
          </div>
          {canManageInventory && (
            <button
              type="button"
              onClick={board.openCreateModal}
              className="h-11 px-5 rounded-full bg-brand-emerald hover:bg-brand-emerald-hover text-white text-sm font-bold shadow-md transition-all cursor-pointer select-none border-0"
            >
              <span>+ </span>{board.t('inventory.addButton')}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-solid border-neutral-300 dark:border-neutral-700 bg-bg-surface flex flex-col z-0 shadow-table">
        <div className="grid grid-cols-12 gap-4 border-b border-solid border-neutral-200 dark:border-neutral-800 bg-bg-main/40 px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">
          <div className="col-span-5">{board.t('inventory.columns.name')}</div>
          <div className="col-span-3 text-center">{board.t('inventory.columns.unit')}</div>
          <div className="col-span-2 text-center">{board.t('inventory.columns.stock')}</div>
          <div className="col-span-2 text-right">{board.t('inventory.columns.actions')}</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 pr-3 space-y-1 custom-scrollbar">
          {board.filteredItems.length === 0 ? (
            <div className="text-center py-10 text-xs italic text-text-muted font-light">
              {board.t('inventory.emptyState')}
            </div>
          ) : (
            board.filteredItems.map((item: InventoryItem) => (
              <div key={item.id} className={`grid grid-cols-12 items-center gap-4 rounded-lg p-2 transition-colors hover:bg-bg-hover/30 ${item.stock <= 2 ? 'bg-red-500/5 dark:bg-red-500/10 border-l-2 border-l-red-500/40 rounded-l-none' : ''}`}>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-main dark:bg-bg-element text-text-muted">
                    <Package className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-text-main line-clamp-1">
                    {item.name}
                  </span>
                </div>
                <div className="col-span-3 text-center text-sm text-text-muted font-medium">
                  {board.t(`inventory.units.${item.unit}`) || item.unit}
                </div>
                <div className="col-span-2 flex justify-center">
                  <div className="relative w-20">
                    <Input
                      id={`stock-input-${item.id}`}
                      className="h-9 text-center text-sm font-mono font-bold pr-1 pl-1 border-solid bg-bg-main/30"
                      type="text"
                      inputMode="decimal"
                      defaultValue={item.stock === 0 ? '' : item.stock}
                      placeholder="0"
                      disabled={!canManageInventory}
                      onBlur={(e) => board.handleStockBlur(item.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                    />
                    {item.stock <= 2 && (
                      <AlertCircle className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 text-red-500 bg-bg-surface rounded-full shadow-2xs animate-bounce" />
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1 pr-2">
                  {canManageInventory && (
                    <>
                      <button
                        type="button"
                        onClick={() => board.startEdit(item)}
                        className="p-1.5 text-text-muted hover:text-brand-emerald hover:bg-bg-element rounded-md transition-colors cursor-pointer border-0 bg-transparent outline-none"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => board.setDeleteId(item.id)}
                        className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-md transition-colors cursor-pointer border-0 bg-transparent outline-none"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {board.isModalOpen && (
        <FloatingPanel
          panelId="inventory-item-modal"
          isOpen={board.isModalOpen}
          onClose={() => board.setIsModalOpen(false)}
          title={board.editingId ? board.t('inventory.modal.editTitle') : board.t('inventory.modal.createTitle')}
          className="w-full max-w-md h-78"
        >
          <form
            key={board.editingId}
            action={board.formAction}
            className="space-y-4 text-text-main p-4 flex flex-col h-full justify-between"
          >
            <div className="space-y-4">
              <div>
                <Input
                  id="inventory-item-name"
                  name="name"
                  label={board.t('inventory.modal.nameLabel')}
                  placeholder={board.t('inventory.modal.namePlaceholder')}
                  defaultValue={board.editingItem?.name}
                  error={board.validationErrors.name}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="inventory-item-stock"
                    name="stock"
                    type="number"
                    step="any"
                    label={board.t('inventory.modal.stockLabel')}
                    defaultValue={board.editingItem?.stock ?? ''}
                    placeholder="0"
                    error={board.validationErrors.stock}
                  />
                </div>
                <div>
                  <Select
                    id="inventory-item-unit"
                    name="unit"
                    label={board.t('inventory.modal.unitLabel')}
                    defaultValue={board.editingItem?.unit}
                    error={board.validationErrors.unit}
                  >
                    {AVAILABLE_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {board.t(`inventory.units.${unit}`) || unit}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <FormActionsFooter 
              onCancel={() => board.setIsModalOpen(false)} 
              submitLabel={board.t('inventory.modal.save')}
              cancelLabel={board.t('inventory.modal.cancel')}
            />
          </form>
        </FloatingPanel>
      )}

      <ConfirmModal 
        isOpen={!!board.deleteId} 
        onClose={() => board.setDeleteId(null)} 
        onConfirm={board.handleDeleteConfirm} 
        title={board.t('inventory.deleteModal.title')} 
        description={board.t('inventory.deleteModal.description')} 
      />
    </div>
  );
};