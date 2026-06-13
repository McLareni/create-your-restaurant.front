'use client';

import React from 'react';
import Image from 'next/image';
import { Switch, Checkbox } from '@/shared/ui';
import { Pencil, Trash2, ExternalLink, QrCode } from 'lucide-react';
import { TableCardProps } from '@/features/qr-tables/types/tables.types';
import { useTableCard } from '@/features/qr-tables/hooks/useTableCard';

export const TableCard = (props: TableCardProps) => {
  const { table, isSelected, onToggleSelect } = props;
  const {
    t,
    styledQr,
    zoneLabel,
    handleEditClick,
    handleDeleteClick,
    handleToggleStatus,
  } = useTableCard(props);

  let cardClasses = "pt-4 px-5 pb-5 flex flex-col justify-between w-full h-[360px] rounded-3xl border transition-all duration-300 group select-none relative bg-bg-surface shadow-table";
  
  if (isSelected) {
    cardClasses += " border-brand-emerald scale-[1.01] z-10 shadow-table-selected";
  } else {
    cardClasses += " border-border-main/60 dark:border-border-main hover:border-border-main";
  }

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between w-full relative z-10 shrink-0">
        <div 
          className="p-1 flex items-center justify-center rounded-xl bg-bg-element/60 hover:bg-bg-element transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox 
            id={`check-${table.id}`} 
            checked={isSelected} 
            onChange={() => onToggleSelect(table.id)} 
            className="cursor-pointer scale-100 accent-brand-emerald relative z-20" 
          />
        </div>

        <div className="flex items-center gap-0.5 bg-bg-element/60 px-1 py-0.5 rounded-xl border border-border-main/40">
          {table.qrUrl && (
            <a 
              href={table.qrUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-lg text-text-muted hover:text-brand-emerald transition-colors cursor-pointer"
              title={t('qr.actions.showQr')}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button 
            type="button"
            onClick={handleEditClick} 
            className="p-1.5 rounded-lg text-text-muted hover:text-brand-emerald transition-colors cursor-pointer"
            title={t('qr.actions.edit')}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button 
            type="button"
            onClick={handleDeleteClick} 
            className="p-1.5 rounded-lg text-text-muted hover:text-red-500 transition-colors cursor-pointer"
            title={t('qr.actions.delete')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 my-1.5 relative z-10 overflow-hidden">
        <div className="relative rounded-2xl bg-white p-3.5 w-34 h-34 flex items-center justify-center shrink-0 border border-border-main shadow-xs">
          {styledQr ? (
            <Image 
              src={styledQr} 
              alt={`${t('qr.table')} ${table.tableNumber}`} 
              width={108} 
              height={108} 
              unoptimized 
              className="object-contain rounded-md select-none pointer-events-none" 
            />
          ) : (
            <div className="h-full w-full bg-bg-element animate-pulse rounded-lg flex items-center justify-center">
              <QrCode className="h-6 w-6 text-text-muted/20" />
            </div>
          )}
        </div>

        <div className="mt-4 text-center w-full max-w-[200px] shrink-0">
          <h3 className="text-2xl font-bold tracking-tight text-text-main leading-none truncate">
            {table.tableNumber}
          </h3>
          
          <div className="mt-3 inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg bg-bg-element border border-border-main/50 text-[11px] font-medium text-text-muted truncate max-w-full">
            {zoneLabel}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-solid border-border-main flex items-center justify-between w-full relative z-10 shrink-0">
        <div className="flex items-center">
          <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
            table.isActive ? 'text-brand-emerald' : 'text-text-muted'
          }`}>
            {table.isActive ? t('qr.statusActive') : t('qr.statusInactive')}
          </span>
        </div>
        
        <Switch 
          id={`status-${table.id}`} 
          checked={table.isActive} 
          onChange={handleToggleStatus} 
          className={table.isActive ? 'bg-brand-emerald!' : ''}
        />
      </div>
    </div>
  );
};