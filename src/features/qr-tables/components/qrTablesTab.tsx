'use client';

import React, { useState } from 'react';
import { Button, Checkbox, EmptyState } from '@/shared/ui';
import { Plus, Printer, QrCode, RefreshCw, AlertTriangle } from 'lucide-react';
import { TableCard } from '@/features/qr-tables/components/tableCard';
import { QrPrintSection } from '@/features/qr-tables/components/qrPrintSection';
import { useQrTablesManagement } from '@/features/qr-tables/hooks/useQrTablesManagement';
import { QrGeneratorModal } from './qrGeneratorModal';
import { ConfirmModal } from '@/shared/ui/confirmModal';
import type { Table } from '@/features/qr-tables/types/tables.types';

export const QrTablesTab = () => {
  const {
    t, tables, isLoading, isError, selectedIds, isModalOpen, setIsModalOpen, 
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

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-red-500 font-medium min-h-125 gap-2">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <span>{t('auth.errors.serverError')}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-bg-main w-full h-full overflow-hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-border-main print:hidden shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight">{t('qr.title')}</h1>
          <p className="text-xs md:text-sm text-text-muted font-light mt-1.5">{t('qr.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {selectedIds.size > 0 && (
            <Button 
              variant="outline" 
              icon={<Printer className="h-4 w-4" />} 
              onClick={handlePrint} 
              disabled={isLoading}
              className="flex-1 sm:flex-none text-xs md:text-sm h-11 px-4 font-bold rounded-xl border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 dark:bg-brand-emerald/20 dark:text-brand-emerald dark:hover:bg-brand-emerald/30 transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span className="hidden xs:inline mr-1">{t('qr.printBtn')}</span> ({selectedIds.size})
            </Button>
          )}
          <Button 
            variant="brand" 
            icon={<Plus className="h-4 w-4" />} 
            onClick={onOpenCreate} 
            disabled={isLoading}
            className="flex-1 sm:flex-none text-xs md:text-sm h-11 px-5 font-bold shadow-md rounded-xl bg-brand-emerald hover:bg-brand-emerald-hover text-white border-0 transition-all active:scale-98 flex items-center justify-center gap-1.5"
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
                checked={selectedIds.size === tables.length && tables.length > 0} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)} 
                disabled={isLoading} 
                className="scale-105 accent-brand-emerald pointer-events-auto z-10" 
              />
              <span 
                className="text-sm font-semibold text-text-main cursor-pointer tracking-wide hover:text-brand-emerald transition-colors" 
                onClick={() => handleSelectAll(selectedIds.size !== tables.length)}
              >
                {t('qr.selectAll')}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6" style={{ scrollbarGutter: 'stable' }}>
              <div className="qr-tables-grid px-1 py-2">
                {tables.map((table: Table) => (
                  <TableCard 
                    key={table.id} 
                    table={table} 
                    isSelected={selectedIds.has(table.id)} 
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