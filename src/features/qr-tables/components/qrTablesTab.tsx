'use client';

import { Button, Input, ConfirmModal, Checkbox, Switch, EmptyState, FloatingPanel, Select } from '@/shared/ui';
import { Plus, Printer, QrCode } from 'lucide-react';
import { TableCard } from './tableCard';
import { QrPrintSection } from './qrPrintSection';
import { useQrTablesTabLogic } from '@/features/qr-tables/hooks/useQrTablesTabLogic';
import { Table } from '@/features/qr-tables/types/tables.types';

export const QrTablesTab = () => {
  const {
    t,
    tables,
    zones,
    isLoading,
    isSubmitting,
    errorMsg,
    setErrorMsg,
    newZoneName,
    setNewZoneName,
    selectedIds,
    printingDataUrls,
    isModalOpen,
    setIsModalOpen,
    editingTable,
    formData,
    deleteId,
    setDeleteId,
    onOpenCreate,
    onOpenEdit,
    handleAddZone,
    onSave,
    onDeleteConfirm,
    handleToggleSelect,
    handleSelectAll,
    handlePrint,
    handleStatusChange,
    handleFormDataChange,
  } = useQrTablesTabLogic();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 print:hidden shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">{t('qr.title')}</h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mt-1">{t('qr.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <Button variant="outline" icon={<Printer className="h-4 w-4" />} onClick={handlePrint} disabled={isLoading || isSubmitting}>
              {t('qr.printBtn')} ({selectedIds.length})
            </Button>
          )}
          <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={onOpenCreate} disabled={isLoading || isSubmitting}>
            {t('qr.addBtn')}
          </Button>
        </div>
      </div>

      <div className="print:hidden flex-1 overflow-hidden flex flex-col">
        {tables.length === 0 ? (
          <EmptyState icon={<QrCode />} title={t('qr.emptyTitle')} description={t('qr.emptyDesc')} actionLabel={t('qr.addBtn')} onAction={onOpenCreate} />
        ) : (
          <div className="flex flex-col h-full">
            <div className="mb-4 flex items-center gap-2 px-1 shrink-0">
              <Checkbox id="selectAll" label="" checked={selectedIds.length === tables.length && tables.length > 0} onChange={(e) => handleSelectAll(e.target.checked)} disabled={isLoading || isSubmitting} />
              <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('qr.selectAll')}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {tables.map((table: Table) => (
                  <TableCard 
                    key={table.id} 
                    table={table} 
                    isSelected={selectedIds.includes(table.id)}
                    onToggleSelect={handleToggleSelect}
                    onEdit={onOpenEdit} 
                    onDelete={setDeleteId}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <QrPrintSection 
        tables={tables} 
        selectedIds={selectedIds} 
        printingDataUrls={printingDataUrls} 
      />

      <FloatingPanel 
        panelId="qr-table-floating-panel"
        isOpen={isModalOpen} 
        onClose={() => !isLoading && !isSubmitting && setIsModalOpen(false)} 
        title={editingTable ? t('qr.modal.editTitle') : t('qr.modal.createTitle')}
        className="w-132 border-brand-copper/20 shadow-2xl"
      >
        <div className="flex flex-col gap-5 text-brand-espresso dark:text-brand-cream">
          <Input id="tableNumber" label={t('qr.modal.numberLabel')} placeholder={t('qr.modal.numberPlaceholder')} value={formData.tableNumber} onChange={(e) => { handleFormDataChange({ tableNumber: e.target.value }); setErrorMsg(''); }} disabled={isLoading || isSubmitting} />
          
          <div className="flex flex-col gap-4">
            <Select
              id="zoneSelect"
              label={t('qr.modal.typeLabel')}
              value={formData.zoneId || ''}
              onChange={(e) => {
                const val = e.target.value;
                const matchedZone = zones.find((z: { id: string; name: string }) => z.id === val);
                handleFormDataChange({
                  zoneId: val || null,
                  type: matchedZone ? matchedZone.name : '',
                });
                setErrorMsg('');
              }}
              disabled={isLoading || isSubmitting}
            >
              <option value="">{t('qr.modal.selectZonePlaceholder' as any) || 'Оберіть наявну зону закладу'}</option>
              {zones.map((zone: { id: string; name: string }) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </Select>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-espresso dark:text-brand-cream">
                {t('qr.modal.createZoneLabel' as any) || 'Або створіть нову зону, якщо її немає у списку'}
              </label>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    id="newZoneInput"
                    placeholder={t('qr.modal.newZonePlaceholder' as any) || 'Назва нової зони (напр. VIP, Тераса)'}
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    disabled={isLoading || isSubmitting}
                  />
                </div>
                <Button
                  type="button"
                  variant="brand"
                  onClick={handleAddZone}
                  disabled={isLoading || isSubmitting || !newZoneName.trim()}
                  className="h-12 px-4 shrink-0 flex items-center justify-center"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-brand-gray/10 dark:border-brand-gray/20 pt-4">
            <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('qr.modal.statusLabel')}</span>
            <Switch id="isActive" checked={formData.isActive} onChange={(val) => handleFormDataChange({ isActive: val })} disabled={isLoading || isSubmitting} />
          </div>

          {errorMsg && <div className="text-sm text-red-500 font-medium">{errorMsg}</div>}

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-gray/10 dark:border-brand-gray/20">
            <Button variant="ghost" className="h-9 text-xs font-semibold" onClick={() => setIsModalOpen(false)} disabled={isLoading || isSubmitting}>{t('qr.modal.cancel')}</Button>
            <Button variant="brand" className="px-5 h-9 text-xs font-bold shadow-md" onClick={onSave} isLoading={isLoading || isSubmitting} disabled={isLoading || isSubmitting}>{t('qr.modal.save')}</Button>
          </div>
        </div>
      </FloatingPanel>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={onDeleteConfirm} description={t('qr.deleteConfirm')} />
    </div>
  );
};