'use client';

import React, { useState } from 'react';
import { Button, Checkbox, EmptyState } from '@/shared/ui';
import { Plus, Printer, QrCode, RefreshCw } from 'lucide-react';
import { TableCard } from '@/features/qr-tables/components/tableCard';
import { QrPrintSection } from '@/features/qr-tables/components/qrPrintSection';
import { useQrTablesManagement } from '@/features/qr-tables/hooks/useQrTablesManagement';
import { Table } from '@/features/qr-tables/types/tables.types';
import { QrGeneratorModal } from './qrGeneratorModal';
import { ConfirmModal } from '@/shared/ui/confirmModal';

export const QrTablesTab = () => {
  const {
    t, tables, isLoading, selectedIds, isModalOpen, setIsModalOpen, 
    editingTable, formData, deleteId, setDeleteId, onOpenCreate, onOpenEdit, onSave, onDeleteConfirm,
    handleToggleSelect, handleSelectAll, handlePrint, handleStatusChange, handleFormDataChange,
    filteredTypes, showTypeSuggestions, setShowTypeSuggestions, errorMsg
  } = useQrTablesManagement();

  const [styleUpdates, setStyleUpdates] = useState<Record<string, number>>({});

  const handleStyleConfigured = (tableId: string) => {
    setStyleUpdates(prev => ({
      ...prev,
      [tableId]: (prev[tableId] || 0) + 1
    }));
  };

  if (isLoading && tables.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-text-muted font-medium min-h-125">
        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-brand-emerald" />
        {t('qr.loading')}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-bg-surface border border-border-main rounded-3xl p-5 md:p-6 shadow-md overflow-hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-border-main print:hidden shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-main">{t('qr.title')}</h1>
          <p className="text-xs md:text-sm text-text-muted mt-1">{t('qr.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {selectedIds.length > 0 && (
            <Button 
              variant="outline" 
              icon={<Printer className="h-4 w-4" />} 
              onClick={handlePrint} 
              disabled={isLoading}
              className="flex-1 sm:flex-none text-xs md:text-sm h-11 px-4 font-bold rounded-xl border border-border-main bg-bg-surface text-text-main hover:border-brand-emerald hover:text-brand-emerald transition-all shadow-sm"
            >
              <span className="hidden xs:inline mr-1">{t('qr.printBtn')}</span> ({selectedIds.length})
            </Button>
          )}
          <Button 
            variant="brand" 
            icon={<Plus className="h-4 w-4" />} 
            onClick={onOpenCreate} 
            disabled={isLoading}
            className="flex-1 sm:flex-none text-xs md:text-sm h-11 px-5 font-bold shadow-md rounded-xl bg-brand-emerald hover:bg-brand-emerald-hover text-white border border-border-main transition-all active:scale-98 flex items-center justify-center gap-1.5"
          >
            {t('qr.addBtn')}
          </Button>
        </div>
      </div>

      <div className="print:hidden flex-1 overflow-hidden flex flex-col">
        {tables.length === 0 ? (
          <EmptyState 
            icon={<QrCode className="h-12 w-12 text-text-muted/40" />} 
            title={t('qr.emptyTitle')} 
            description={t('qr.emptyDesc')} 
            actionLabel={t('qr.addBtn')} 
            onAction={onOpenCreate} 
          />
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            
            <div className="mb-4 flex items-center gap-3 px-1 shrink-0 select-none">
              <Checkbox 
                id="selectAll" 
                checked={selectedIds.length === tables.length && tables.length > 0} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)} 
                disabled={isLoading} 
                className="scale-105 accent-brand-emerald pointer-events-auto z-10" 
              />
              <span 
                className="text-xs md:text-sm font-semibold text-text-main cursor-pointer tracking-wide hover:text-brand-emerald transition-colors" 
                onClick={() => handleSelectAll(selectedIds.length !== tables.length)}
              >
                {t('qr.selectAll')}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6" style={{ scrollbarGutter: 'stable' }}>
              <div className="qr-tables-grid px-6 py-4">
                {tables.map((table: Table) => (
                  <TableCard 
                    key={table.id} 
                    table={table} 
                    isSelected={selectedIds.includes(table.id)} 
                    onToggleSelect={handleToggleSelect} 
                    onEdit={onOpenEdit} 
                    onDelete={setDeleteId} 
                    onStatusChange={handleStatusChange} 
                    styleVersion={styleUpdates[table.id] || 0} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <QrPrintSection tables={tables} selectedIds={selectedIds} />

      <QrGeneratorModal 
        key={isModalOpen ? (editingTable?.id || 'new') : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
        errorMsg={errorMsg}
        onDelete={editingTable ? () => { setIsModalOpen(false); setDeleteId(editingTable.id); } : undefined}
        onPrint={editingTable ? () => { handleToggleSelect(editingTable.id); handlePrint(); } : undefined}
        formData={formData}
        handleFormDataChange={handleFormDataChange}
        tables={tables}
        filteredTypes={filteredTypes}
        showTypeSuggestions={showTypeSuggestions}
        setShowTypeSuggestions={setShowTypeSuggestions}
        editingTableId={editingTable?.id || null}
        onStyleConfigured={handleStyleConfigured}
      />

      <div className="dark:text-[#F5F5F4]">
        <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={onDeleteConfirm} description={t('qr.deleteConfirm')} />
      </div>
    </div>
  );
};