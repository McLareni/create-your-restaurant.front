'use client';

import React, { useActionState } from 'react';
import { Button, Input, ConfirmModal, Checkbox, EmptyState, FloatingPanel } from '@/shared/ui';
import { Plus, Printer, QrCode, RefreshCw } from 'lucide-react';
import { TableCard } from '@/features/qr-tables/components/tableCard';
import { QrPrintSection } from '@/features/qr-tables/components/qrPrintSection';
import { useQrTablesManagement } from '@/features/qr-tables/hooks/useQrTablesManagement';
import { Table } from '@/features/qr-tables/types/tables.types';

export const QrTablesTab = () => {
  const {
    t, tables, isLoading, errorMsg, selectedIds, printingDataUrls, isModalOpen, setIsModalOpen, 
    editingTable, formData, deleteId, setDeleteId, onOpenCreate, onOpenEdit, onSave, onDeleteConfirm,
    handleToggleSelect, handleSelectAll, handlePrint, handleStatusChange, handleFormDataChange,
    filteredTypes, showTypeSuggestions, setShowTypeSuggestions
  } = useQrTablesManagement();

  const [actionError, formAction, isPending] = useActionState(
    async (prevState: string | null, actionFormData: FormData) => {
      void prevState;
      void actionFormData;
      try {
        await onSave();
        return null;
      } catch (err: unknown) {
        if (err instanceof Error) {
          return err.message;
        }
        return t('qr.errors.unknown');
      }
    },
    null
  );

  const displayError = actionError || errorMsg;

  if (isLoading && tables.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-text-muted font-medium animate-pulse min-h-[50vh]">
        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-brand-copper" />
        {t('actions.loading')}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-main print:hidden shrink-0">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main">{t('qr.title')}</h1>
          <p className="text-sm text-text-muted mt-1">{t('qr.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <Button variant="outline" icon={<Printer className="h-4 w-4" />} onClick={handlePrint} disabled={isLoading || isPending}>
              {t('qr.printBtn')} ({selectedIds.length})
            </Button>
          )}
          <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={onOpenCreate} disabled={isLoading || isPending}>
            {t('qr.addBtn')}
          </Button>
        </div>
      </div>

      <div className="print:hidden flex-1 overflow-hidden flex flex-col">
        {tables.length === 0 ? (
          <EmptyState icon={<QrCode className="h-12 w-12 text-text-muted/30" />} title={t('qr.emptyTitle')} description={t('qr.emptyDesc')} actionLabel={t('qr.addBtn')} onAction={onOpenCreate} />
        ) : (
          <div className="flex flex-col h-full">
            <div className="mb-4 flex items-center gap-2 px-1 shrink-0">
              <Checkbox id="selectAll" checked={selectedIds.length === tables.length && tables.length > 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)} disabled={isLoading || isPending} />
              <span className="text-sm font-medium text-text-main">{t('qr.selectAll')}</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
              <div className="qr-tables-grid">
                {tables.map((table: Table) => (
                  <TableCard key={table.id} table={table} isSelected={selectedIds.includes(table.id)} onToggleSelect={handleToggleSelect} onEdit={onOpenEdit} onDelete={setDeleteId} onStatusChange={handleStatusChange} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <QrPrintSection tables={tables} selectedIds={selectedIds} printingDataUrls={printingDataUrls} />

      <FloatingPanel panelId="qr-table-floating-panel" isOpen={isModalOpen} onClose={() => !isLoading && !isPending && setIsModalOpen(false)} title={editingTable ? t('qr.modal.editTitle') : t('qr.modal.createTitle')} className="w-132 border-brand-copper/20 shadow-2xl">
        <form action={formAction} className="flex flex-col gap-5 text-text-main">
          <Input id="tableNumber" label={t('qr.modal.numberLabel')} placeholder={t('qr.modal.numberPlaceholder')} value={formData.tableNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormDataChange({ tableNumber: e.target.value })} disabled={isLoading || isPending} />
          
          <div className="relative flex flex-col" onFocusCapture={() => setShowTypeSuggestions(true)} onBlurCapture={() => setTimeout(() => setShowTypeSuggestions(false), 250)}>
            <Input id="type" label={t('qr.modal.typeLabel')} placeholder={t('qr.modal.typePlaceholder')} value={formData.type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormDataChange({ type: e.target.value })} disabled={isLoading || isPending} />
            
            {showTypeSuggestions && filteredTypes.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border-main bg-bg-surface p-1 shadow-xl custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
                {filteredTypes.map((typeName) => (
                  <button
                    key={typeName}
                    type="button"
                    onClick={() => {
                      handleFormDataChange({ type: typeName });
                      setShowTypeSuggestions(false);
                    }}
                    className="flex w-full items-center px-3 h-9 text-xs font-semibold text-text-main rounded-lg hover:bg-bg-hover text-left cursor-pointer outline-none transition-colors duration-150"
                  >
                    {typeName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {displayError && (
            <div className="text-sm text-red-500 font-medium animate-pulse">{displayError}</div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border-main">
            <Button type="button" variant="ghost" className="h-9 text-xs font-semibold" onClick={() => setIsModalOpen(false)} disabled={isLoading || isPending}>{t('qr.modal.cancel')}</Button>
            <Button type="submit" variant="brand" className="px-5 h-9 text-xs font-bold shadow-md" isLoading={isPending} disabled={isLoading || isPending}>{t('qr.modal.save')}</Button>
          </div>
        </form>
      </FloatingPanel>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={onDeleteConfirm} description={t('qr.deleteConfirm')} />
    </div>
  );
};