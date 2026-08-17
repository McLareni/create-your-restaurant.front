'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useInventoryTab } from '@/features/menu-builder/hooks/inventory/useInventoryTab';
import { formatInventoryDateTime } from '@/features/menu-builder/hooks/inventory/inventoryHistory';
import { AVAILABLE_UNITS } from '@/features/menu-builder/schemas/inventory.schema';
import { Input, Select, ConfirmModal, FloatingPanel, Modal, Button } from '@/shared/ui';
import { PageLoader } from '@/shared/ui/pageLoader';
import { FormActionsFooter } from '@/shared/ui/formActionsFooter';
import { Search, AlertCircle, Package, Edit2, Trash2, History } from 'lucide-react';
import type { InventoryItem } from '@/features/menu-builder/types/inventory.types';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { usePermissions } from '@/shared/hooks/usePermissions';

export const InventoryTab = () => {
  const board = useInventoryTab();
  const router = useRouter();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
  const hasInventoryModule = useAccessStore((state) => state.hasModule('inventory'));
  const { canManageInventory } = usePermissions();
  const selectedItemLabel = board.filteredItems.find((item) => item.id === board.selectedItemId)?.name
    ?? board.t('inventory.history.empty');

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
    <div className="flex h-full w-full flex-col bg-bg-main p-4 text-text-main select-none">
      <div className="mb-4 flex flex-col gap-3 border-b border-border-main/60 pb-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-text-main">{board.t('inventory.title')}</h2>
          <p className="max-w-100 text-sm font-light text-text-muted">{board.t('inventory.subtitle')}</p>
        </div>
        <div className="flex flex-nowrap items-center gap-3">
          <div className="relative w-full min-w-60 md:w-80">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-text-muted/40" />
            <input
              type="text"
              placeholder={board.t('inventory.searchPlaceholder')}
              value={board.searchQuery}
              onChange={(e) => board.setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-300 bg-bg-surface pl-9 pr-4 text-sm text-text-main transition-colors placeholder:text-text-muted/40 focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald/20 dark:border-neutral-700"
            />
          </div>
          {canManageInventory && (
            <button
              type="button"
              onClick={board.openCreateModal}
              className="h-11 rounded-xl border-0 bg-brand-emerald px-5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-emerald-hover"
            >
              + {board.t('inventory.addButton')}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 min-w-full">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border-main/60 bg-bg-surface shadow-table w-full">
          <div className="flex items-center justify-between border-b border-border-main/60 px-4 py-3">
            <div>
              <div className="text-sm font-bold">{board.t('inventory.audit.title')}</div>
              <div className="text-xs text-text-muted">{board.t('inventory.audit.subtitle')}</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 border-b border-border-main/60 bg-bg-main/40 px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">
            <div className="col-span-5">{board.t('inventory.columns.name')}</div>
            <div className="col-span-2 text-center">{board.t('inventory.columns.unit')}</div>
            <div className="col-span-2 text-center">{board.t('inventory.columns.stock')}</div>
            <div className="col-span-2 text-center">{board.t('inventory.columns.auditedAt')}</div>
            <div className="col-span-1 text-right">{board.t('inventory.columns.actions')}</div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2 pr-3 custom-scrollbar w-full">
            {board.filteredItems.length === 0 ? (
              <div className="py-10 text-center text-xs italic font-light text-text-muted">
                {board.t('inventory.emptyState')}
              </div>
            ) : (
              board.filteredItems.map((item: InventoryItem) => {
                const isActive = item.id === board.selectedItemId;
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 items-center gap-4 rounded-lg p-2 transition-colors hover:bg-bg-hover/30 ${
                      isActive ? 'bg-brand-emerald/5 ring-1 ring-brand-emerald/20' : ''
                    } ${item.stock <= 2 ? 'border-l-2 border-l-red-500/40 bg-red-500/5 dark:bg-red-500/10' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => board.setSelectedItemId(item.id)}
                      className="col-span-5 flex items-center gap-3 rounded-lg text-left outline-none transition-colors hover:bg-bg-main/30"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-main text-text-muted dark:bg-bg-element">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-text-main">{item.name}</div>
                        <div className="text-xs text-text-muted">#{item.id.slice(0, 6)}</div>
                      </div>
                    </button>
                    <div className="col-span-2 text-center text-sm font-medium text-text-muted">
                      {board.t(`inventory.units.${item.unit}`) || item.unit}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <div className="relative w-24">
                        <Input
                          id={`stock-input-${item.id}`}
                          className="h-9 rounded-lg border-solid bg-bg-main/30 text-center font-mono text-sm font-bold"
                          type="text"
                          inputMode="decimal"
                          defaultValue={item.stock === 0 ? '' : item.stock}
                          placeholder="0"
                          disabled={!canManageInventory}
                          onBlur={(event) => {
                            void board.handleStockBlur(item.id, event.target.value);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              (event.target as HTMLInputElement).blur();
                            }
                          }}
                        />
                        {item.stock <= 2 && (
                          <AlertCircle className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full bg-bg-surface text-red-500 shadow-2xs animate-bounce" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-xs text-text-muted">
                      {board.lastAuditByItem[item.id] ? formatInventoryDateTime(board.lastAuditByItem[item.id]) : '—'}
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-1 pr-2">
                      <button
                        type="button"
                        onClick={() => {
                          board.setSelectedItemId(item.id);
                          setIsHistoryModalOpen(true);
                        }}
                        aria-label={board.t('inventory.history.title')}
                        className="rounded-md border-0 bg-transparent p-1.5 text-text-muted transition-colors hover:bg-bg-element hover:text-brand-emerald"
                      >
                        <History className="h-3.5 w-3.5" />
                      </button>
                      {canManageInventory && (
                        <>
                          <button
                            type="button"
                            onClick={() => board.startEdit(item)}
                            className="rounded-md border-0 bg-transparent p-1.5 text-text-muted transition-colors hover:bg-bg-element hover:text-brand-emerald"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => board.setDeleteId(item.id)}
                            className="rounded-md border-0 bg-transparent p-1.5 text-text-muted transition-colors hover:bg-red-500/5 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={selectedItemLabel}
        className="h-[min(80vh,720px)] w-full max-w-3xl"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <History className="h-4 w-4" />
            {board.t('inventory.history.title')}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
            {!board.selectedItemId || !board.filteredItems.some((item) => item.id === board.selectedItemId) ? (
              <div className="rounded-lg border border-dashed border-border-main/60 p-6 text-center text-sm text-text-muted">
                {board.t('inventory.history.empty')}
              </div>
            ) : board.selectedItemHistory.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border-main/60 p-6 text-center text-sm text-text-muted">
                {board.t('inventory.history.noEntries')}
              </div>
            ) : (
              <div className="divide-y divide-border-main/60 rounded-lg border border-border-main/60">
                {board.selectedItemHistory.map((entry) => (
                  <div key={entry.id} className="px-3 py-2.5 first:rounded-t-lg last:rounded-b-lg hover:bg-bg-main/30">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="truncate text-sm font-semibold">
                          {board.t(`inventory.history.${entry.action}`) || entry.action}
                        </div>
                        <div className="text-xs text-text-muted">
                          {entry.recordedBy}
                        </div>
                      </div>
                      <div className="shrink-0 text-xs text-text-muted">
                        {formatInventoryDateTime(entry.recordedAt)}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-3 border-t border-border-main/40 pt-2 text-xs sm:grid-cols-[auto_auto_minmax(0,1fr)]">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="text-text-muted">{board.t('inventory.history.stockFromTo')}:</span>
                        <span className="font-semibold">{entry.previousStock} → {entry.nextStock}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-muted">{board.t('inventory.history.delta')}:</span>
                        <span className="font-semibold">{entry.delta > 0 ? '+' : ''}{entry.delta}</span>
                      </div>
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="shrink-0 text-text-muted">{board.t('inventory.history.note')}:</span>
                        <span className="truncate font-semibold">{entry.note ?? '—'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {board.isModalOpen && (
        <FloatingPanel
          panelId="inventory-item-modal"
          isOpen={board.isModalOpen}
          onClose={() => board.setIsModalOpen(false)}
          title={board.editingId ? board.t('inventory.modal.editTitle') : board.t('inventory.modal.createTitle')}
          className="h-78 w-full max-w-md"
        >
          <form
            key={board.editingId}
            action={board.formAction}
            className="flex h-full flex-col justify-between space-y-4 p-4 text-text-main"
          >
            <div className="space-y-4">
              <Input
                id="inventory-item-name"
                name="name"
                label={board.t('inventory.modal.nameLabel')}
                placeholder={board.t('inventory.modal.namePlaceholder')}
                defaultValue={board.editingItem?.name}
                error={board.validationErrors.name}
              />
              <div className="grid grid-cols-2 gap-4">
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