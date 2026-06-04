'use client';

import React, { useActionState } from 'react';
import { Button, Input, ConfirmModal, Checkbox, EmptyState, FloatingPanel, Select } from '@/shared/ui';
import { Plus, Printer, QrCode, RefreshCw } from 'lucide-react';
import { TableCard } from '@/features/qr-tables/components/tableCard';
import { QrPrintSection } from '@/features/qr-tables/components/qrPrintSection';
import { useQrTablesManagement } from '@/features/qr-tables/hooks/useQrTablesManagement';
import { Table, Zone } from '@/features/qr-tables/types/tables.types';

export const QrTablesTab = () => {
  const {
    t, tables, zones, isLoading, errorMsg, newZoneName, setNewZoneName,
    selectedIds, printingDataUrls, isModalOpen, setIsModalOpen, editingTable, formData,
    deleteId, setDeleteId, onOpenCreate, onOpenEdit, handleAddZone, onSave, onDeleteConfirm,
    handleToggleSelect, handleSelectAll, handlePrint, handleStatusChange, handleFormDataChange,
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
      <div className="flex flex-1 items-center justify-center p-12 text-brand-gray font-medium animate-pulse min-h-[50vh]">
        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-brand-copper" />
        {t('actions.loading')}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 print:hidden shrink-0">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-espresso dark:text-brand-cream">{t('qr.title')}</h1>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mt-1">{t('qr.subtitle')}</p>
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
          <EmptyState icon={<QrCode className="h-12 w-12 text-brand-gray/30" />} title={t('qr.emptyTitle')} description={t('qr.emptyDesc')} actionLabel={t('qr.addBtn')} onAction={onOpenCreate} />
        ) : (
          <div className="flex flex-col h-full">
            <div className="mb-4 flex items-center gap-2 px-1 shrink-0">
              <Checkbox id="selectAll" label="" checked={selectedIds.length === tables.length && tables.length > 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)} disabled={isLoading || isPending} />
              <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('qr.selectAll')}</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
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
        <form action={formAction} className="flex flex-col gap-5 text-brand-espresso dark:text-brand-cream">
          <Input id="tableNumber" label={t('qr.modal.numberLabel')} placeholder={t('qr.modal.numberPlaceholder')} value={formData.tableNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormDataChange({ tableNumber: e.target.value })} disabled={isLoading || isPending} />
          
          <div className="flex flex-col gap-4">
            <Select id="zoneSelect" label={t('qr.modal.typeLabel')} value={formData.zoneId || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const val = e.target.value;
              const matchedZone = zones.find((z: Zone) => z.id === val);
              handleFormDataChange({ zoneId: val || null, type: matchedZone ? matchedZone.name : '' });
            }} disabled={isLoading || isPending}>
              <option value="">{t('qr.modal.typePlaceholder')}</option>
              {zones.map((zone: Zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </Select>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-espresso dark:text-brand-cream">
                {t('qr.modal.createZoneLabel')}
              </label>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input id="newZoneInput" placeholder={t('qr.modal.newZonePlaceholder')} value={newZoneName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewZoneName(e.target.value)} disabled={isLoading || isPending} />
                </div>
                <Button type="button" variant="brand" onClick={handleAddZone} disabled={isLoading || isPending || !newZoneName.trim()} className="h-12 px-4 shrink-0 flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {displayError && (
            <div className="text-sm text-red-500 font-medium animate-pulse">{displayError}</div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-gray/10 dark:border-brand-gray/20">
            <Button type="button" variant="ghost" className="h-9 text-xs font-semibold" onClick={() => setIsModalOpen(false)} disabled={isLoading || isPending}>{t('qr.modal.cancel')}</Button>
            <Button type="submit" variant="brand" className="px-5 h-9 text-xs font-bold shadow-md" isLoading={isPending} disabled={isLoading || isPending}>{t('qr.modal.save')}</Button>
          </div>
        </form>
      </FloatingPanel>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={onDeleteConfirm} description={t('qr.deleteConfirm')} />
    </div>
  );
};