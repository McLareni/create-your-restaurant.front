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
      <div className="p-8 text-center text-brand-gray animate-pulse">
        {board.t('common.loading')}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 select-none flex flex-col">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-brand-gray/10 dark:border-brand-gray/20 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">
            {board.t('inventory.title')}
          </h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mt-1">
            {board.t('inventory.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-gray/60 dark:text-brand-gray/80" />
            <input 
              type="text" 
              placeholder={board.t('inventory.searchPlaceholder')} 
              value={board.searchQuery} 
              onChange={(e) => board.setSearchQuery(e.target.value)} 
              className="h-11 w-full rounded-full border border-brand-gray/30 dark:border-brand-gray/5 bg-white dark:bg-brand-mocha pl-9 pr-4 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper" 
            />
          </div>
          <button 
            type="button"
            onClick={board.openCreateModal} 
            className="h-11 px-5 rounded-full bg-brand-copper hover:bg-brand-copper/90 text-white text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            + {board.t('inventory.addButton')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-brand-gray/20 bg-white dark:bg-brand-mocha flex flex-col z-0">
        <div className="grid grid-cols-12 gap-4 border-b border-brand-gray/20 bg-brand-cream/50 dark:bg-brand-espresso px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brand-gray dark:text-brand-gray/60">
          <div className="col-span-5">{board.t('inventory.columns.name')}</div>
          <div className="col-span-3 text-center">{board.t('inventory.columns.unit')}</div>
          <div className="col-span-2 text-center">{board.t('inventory.columns.stock')}</div>
          <div className="col-span-2 text-right">{board.t('inventory.columns.actions')}</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {board.filteredItems.length === 0 ? (
            <div className="text-center py-10 text-xs italic text-brand-gray">
              {board.t('inventory.emptyState')}
            </div>
          ) : (
            board.filteredItems.map((item: InventoryItem) => (
              <div 
                key={item.id} 
                className={`grid grid-cols-12 items-center gap-4 rounded-lg p-2 transition-colors hover:bg-brand-cream/30 dark:hover:bg-white/5 ${ 
                  item.stock <= 2 ? 'bg-red-50/40 dark:bg-red-500/5' : '' 
                }`}
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cream dark:bg-brand-espresso text-brand-gray dark:text-brand-gray/60">
                    <Package className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream line-clamp-1">
                    {item.name}
                  </span>
                </div>
                <div className="col-span-3 text-center text-sm text-brand-gray dark:text-brand-gray/80">
                  {board.t(`menu.constructor.dishes.modal.ingredients.units.${item.unit}`) || item.unit}
                </div>
                <div className="col-span-2 flex justify-center">
                  <div className="relative w-20">
                    <Input 
                      id={`stock-input-${item.id}`} 
                      className="h-9 text-center text-sm font-medium pr-1 pl-1" 
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
                      <AlertCircle className="absolute -right-2 -top-2 h-4 w-4 text-brand-copper bg-white dark:bg-brand-mocha rounded-full" />
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
                  <button 
                    type="button"
                    onClick={() => board.startEdit(item)} 
                    className="p-2 text-brand-gray hover:text-brand-copper dark:hover:text-brand-cream rounded-md hover:bg-brand-cream dark:hover:bg-brand-espresso transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => board.setDeleteId(item.id)} 
                    className="p-2 text-brand-gray hover:text-red-500 rounded-md hover:bg-brand-cream dark:hover:bg-brand-espresso transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
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
          className="w-full max-w-md border-brand-copper/20" 
        >
          <form action={board.handleFormAction} className="space-y-4">
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
              <div>
                <label htmlFor="inventory-item-stock" className="block text-sm font-medium text-brand-gray mb-1">
                  {board.t('inventory.modal.stockLabel')}
                </label>
                <input 
                  id="inventory-item-stock"
                  type="number" 
                  step="any" 
                  value={board.formData.stock} 
                  onChange={(e) => board.setFormData({ ...board.formData, stock: parseFloat(e.target.value) || 0 })} 
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-brand-espresso px-3 text-sm text-brand-espresso dark:text-brand-cream outline-none focus:border-brand-copper ${ 
                    board.validationErrors.stock ? 'border-red-500' : 'border-brand-gray/30 dark:border-brand-gray/50' 
                  }`} 
                />
                {board.validationErrors.stock && (
                  <span className="text-xs text-red-500 mt-1 block">{board.validationErrors.stock}</span>
                )}
              </div>
              <div>
                <Select 
                  id="inventory-unit-select" 
                  label={board.t('inventory.modal.unitLabel')}
                  value={board.formData.unit} 
                  onChange={board.handleUnitChange} 
                  className="h-11 border-brand-gray/30" 
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
            <div className="flex justify-end space-x-2 pt-4 border-t border-brand-gray/10">
              <button 
                type="button" 
                onClick={() => board.setIsModalOpen(false)} 
                className="px-4 h-11 border border-brand-gray/30 text-brand-gray rounded-lg text-sm font-medium hover:bg-brand-cream/30 cursor-pointer"
              >
                {board.t('inventory.modal.cancel')}
              </button>
              <button 
                type="submit" 
                className="px-4 h-11 bg-brand-copper hover:bg-brand-copper/90 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
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