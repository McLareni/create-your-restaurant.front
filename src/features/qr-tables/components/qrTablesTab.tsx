'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Modal, ConfirmModal, Checkbox, Switch, EmptyState } from '@/shared/ui';
import { Plus, Printer, QrCode } from 'lucide-react';
import { useTables } from '../hooks/useTables';
import { Table, CreateTableDTO } from '../types/tables.types';
import { TableCard } from './tableCard';
import { useCrudModal } from '@/shared/hooks/useCrudModal';
import QRCode from 'qrcode';

const INITIAL_FORM_DATA: CreateTableDTO = { tableNumber: '', type: '', isActive: true };

export const QrTablesTab = () => {
  const { t } = useTranslation();
  const { tables, uniqueTypes, createTable, updateTable, deleteTable, isTableNumberUnique } = useTables();
  
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printingDataUrls, setPrintingDataUrls] = useState<Record<string, string>>({});

  const {
    isModalOpen,
    setIsModalOpen,
    editingItem: editingTable,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    handleSave,
    confirmDelete,
  } = useCrudModal<Table, CreateTableDTO>({
    initialFormData: INITIAL_FORM_DATA,
    createItem: createTable,
    updateItem: updateTable,
    deleteItem: deleteTable,
  });

  const onOpenCreate = () => {
    setErrorMsg('');
    openCreateModal();
  };

  const onOpenEdit = (table: Table) => {
    setErrorMsg('');
    openEditModal(table, (t) => ({ ...t }));
  };

  const onSave = () => {
    if (!formData.tableNumber.trim()) { setErrorMsg(t('qr.errors.numberRequired')); return; }
    if (!formData.type.trim()) { setErrorMsg(t('qr.errors.typeRequired')); return; }
    if (!isTableNumberUnique(formData.tableNumber, editingTable?.id)) { setErrorMsg(t('qr.errors.numberUnique')); return; }
    handleSave();
  };

  const onDeleteConfirm = () => {
    if (deleteId) {
      setSelectedIds(prev => prev.filter(id => id !== deleteId));
      confirmDelete();
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? tables.map(t => t.id) : []);
  };

  const handlePrint = async () => {
    const urls: Record<string, string> = {};
    const tablesToPrint = tables.filter(t => selectedIds.includes(t.id));
    for (const table of tablesToPrint) {
      urls[table.id] = await QRCode.toDataURL(table.qrUrl, { margin: 0, width: 300 });
    }
    setPrintingDataUrls(urls);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const selectBaseClasses = "h-12 w-full rounded-md border bg-white dark:bg-brand-mocha px-3 py-2 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors border-brand-gray/30 dark:border-brand-gray/50 focus:border-brand-copper focus:ring-1 focus:ring-brand-copper";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 print:hidden shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">{t('qr.title')}</h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mt-1">{t('qr.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <Button variant="outline" icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
              {t('qr.printBtn')} ({selectedIds.length})
            </Button>
          )}
          <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={onOpenCreate}>
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
              <Checkbox id="selectAll" label="" checked={selectedIds.length === tables.length && tables.length > 0} onChange={(e) => handleSelectAll(e.target.checked)} />
              <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('qr.selectAll')}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {tables.map(table => (
                  <TableCard 
                    key={table.id} 
                    table={table} 
                    isSelected={selectedIds.includes(table.id)}
                    onToggleSelect={handleToggleSelect}
                    onEdit={onOpenEdit} 
                    onDelete={setDeleteId}
                    onStatusChange={(id, isActive) => updateTable({ id, data: { isActive } })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="hidden print:flex flex-wrap gap-8 justify-center items-center w-full bg-white text-black">
        {tables.filter(t => selectedIds.includes(t.id)).map(table => (
          <div key={`print-${table.id}`} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 w-[60mm] h-[60mm]">
            <img src={printingDataUrls[table.id]} alt="QR" className="w-full h-full object-contain mb-2" />
            <span className="text-xl font-bold text-black">{table.tableNumber}</span>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTable ? t('qr.modal.editTitle') : t('qr.modal.createTitle')}>
        <div className="flex flex-col gap-5">
          <Input id="tableNumber" label={t('qr.modal.numberLabel')} placeholder={t('qr.modal.numberPlaceholder')} value={formData.tableNumber} onChange={(e) => { setFormData(prev => ({ ...prev, tableNumber: e.target.value })); setErrorMsg(''); }} />
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="type" className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('qr.modal.typeLabel')}</label>
            <input id="type" list="uniqueTypesList" placeholder={t('qr.modal.typePlaceholder')} value={formData.type} onChange={(e) => { setFormData(prev => ({ ...prev, type: e.target.value })); setErrorMsg(''); }} className={selectBaseClasses} />
            <datalist id="uniqueTypesList">
              {uniqueTypes.map(type => <option key={type} value={type} />)}
            </datalist>
            <span className="text-xs text-brand-gray">{t('qr.modal.typeHint')}</span>
          </div>

          <div className="flex items-center justify-between border-t border-brand-gray/10 dark:border-brand-gray/20 pt-4">
            <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('qr.modal.statusLabel')}</span>
            <Switch checked={formData.isActive} onChange={(val) => setFormData(prev => ({ ...prev, isActive: val }))} />
          </div>

          {errorMsg && <div className="text-sm text-red-500 font-medium">{errorMsg}</div>}
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-brand-gray/10 dark:border-brand-gray/20">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t('qr.modal.cancel')}</Button>
          <Button variant="brand" onClick={onSave}>{t('qr.modal.save')}</Button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={onDeleteConfirm} description={t('qr.deleteConfirm')} />
    </div>
  );
};