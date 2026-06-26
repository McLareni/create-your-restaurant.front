'use client';

import React from 'react';
import { useInventoryTab } from '@/features/menu-builder/hooks/inventory/useInventoryTab';
import { AVAILABLE_UNITS } from '@/features/menu-builder/schemas/inventory.schema';
import { Input, Select, ConfirmModal, FloatingPanel } from '@/shared/ui';
import { Search, AlertCircle, Package, Edit2, Trash2 } from 'lucide-react';
import type { InventoryItem } from '@/features/menu-builder/types/inventory.types';

export const InventoryTab = () => {
  const board = useInventoryTab();

  if (board.isLoading) {
    return (
      <div className="p-8 text-center text-text-muted font-medium animate-pulse">
        {board.t('actions.loading')}
      </div>
    );
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
              className="h-11 w-full rounded-full border border-solid border-neutral-300 dark:border-neutral-700 bg-bg-surface pl-9 pr-4 text-sm text-text-main outline-none transition-colors focus:border-brand-emerald/50 focus:ring-1 focus:ring-brand-emerald/20 placeholder:text-text-muted/40" 
            />
          </div>
          <button 
            type="button"
            onClick={board.openCreateModal} 
            className="h-11 px-5 rounded-full bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 text-white text-sm font-bold transition-all whitespace-nowrap cursor-pointer shadow-md border border-brand-emerald/10"
          >
            <span>+ </span>{board.t('inventory.addButton')}
          </button>
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
              <div 
                key={item.id} 
                className={`grid grid-cols-12 items-center gap-4 rounded-lg p-2 transition-colors hover:bg-bg-hover/40 ${ 
                  item.stock <= 2 ? 'bg-red-500/5 dark:bg-red-500/10 border-l-2 border-l-red-500/40 rounded-l-none' : '' 
                }`}
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-main dark:bg-bg-element text-text-muted">
                    <Package className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-text-main line-clamp-1">
                    {item.name}
                  </span>
                </div>
                <div className="col-span-3 text-center text-sm text-text-muted font-medium">
                  {board.t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`) || item.unit}
                </div>
                <div className="col-span-2 flex justify-center">
                  <div className="relative w-20">
                    <Input 
                      id={`stock-input-${item.id}`} 
                      className="h-9 text-center text-sm font-mono font-bold pr-1 pl-1 [&_input]:text-center! border-solid! bg-bg-main/30!" 
                      type="number" 
                      step="any" 
                      defaultValue={item.stock} 
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
          className="w-full max-w-md h-75" 
        >
          <form action={board.handleFormAction} className="space-y-4 text-text-main
            [&_input:not([type=checkbox])]:bg-bg-main/40! [&_input:not([type=checkbox])]:text-text-main! [&_input:not([type=checkbox])]:border-solid! [&_input:not([type=checkbox])]:border-neutral-300! dark:[&_input:not([type=checkbox])]:border-neutral-700! [&_input:not([type=checkbox])]:w-full [&_input:not([type=checkbox])]:rounded-xl! [&_input:not([type=checkbox])]:focus:border-brand-emerald/50! [&_input:not([type=checkbox])]:focus:ring-1! [&_input:not([type=checkbox])]:focus:ring-brand-emerald/20! [&_input:not([type=checkbox])]:outline-none!
            [&_select]:bg-bg-main/40! [&_select]:text-text-main! [&_select]:border-solid! [&_select]:border-neutral-300! dark:[&_select]:border-neutral-700! [&_select]:w-full [&_select]:rounded-xl! [&_select]:focus:border-brand-emerald/50! [&_select]:focus:ring-1! [&_select]:focus:ring-brand-emerald/20! [&_select]:outline-none!
            [&_label]:text-text-main/80! [&_label]:text-xs! [&_label]:font-bold! [&_label]:uppercase! [&_label]:tracking-wider!"
          >
            <div>
              <Input 
                id="inventory-item-name" 
                label={board.t('inventory.modal.nameLabel')} 
                placeholder={board.t('inventory.modal.namePlaceholder')} 
                value={board.formData.name} 
                onChange={(e) => board.setFormData({ ...board.formData, name: e.target.value })} 
                error={board.validationErrors.name} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="inventory-item-stock">
                  {board.t('inventory.modal.stockLabel')}
                </label>
                <input 
                  id="inventory-item-stock"
                  type="number" 
                  step="any" 
                  value={board.formData.stock} 
                  onChange={(e) => board.setFormData({ ...board.formData, stock: parseFloat(e.target.value) || 0 })} 
                  className={`h-11 w-full rounded-xl bg-bg-main/40 border border-solid px-3.5 text-sm text-text-main outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-colors ${ 
                    board.validationErrors.stock ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 dark:border-neutral-700' 
                  }`} 
                />
                {board.validationErrors.stock && (
                  <span className="text-xs text-red-500 font-semibold mt-0.5 block">{board.validationErrors.stock}</span>
                )}
              </div>
              <div>
                <Select 
                  id="inventory-unit-select" 
                  label={board.t('inventory.modal.unitLabel')}
                  value={board.formData.unit} 
                  onChange={board.handleUnitChange} 
                  className="h-11 border-neutral-300! dark:border-neutral-700!" 
                  error={board.validationErrors.unit}
                >
                  {AVAILABLE_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {board.t(`menu.constructor.dishes.modal.ingredients.units.${u}`)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-solid border-neutral-200 dark:border-neutral-800/60 shrink-0 bg-bg-surface mt-auto">
              <button 
                type="button" 
                onClick={() => board.setIsModalOpen(false)} 
                className="h-10 px-4 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-all cursor-pointer border-0 bg-transparent outline-none select-none"
              >
                {board.t('inventory.modal.cancel')}
              </button>
              <button 
                type="submit" 
                className="h-10 px-5 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10 select-none flex items-center justify-center"
              >
                {board.t('inventory.modal.save')}
              </button>
            </div>
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