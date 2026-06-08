'use client';

import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Switch, Checkbox, Card } from '@/shared/ui';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { TableCardProps } from '@/features/qr-tables/types/tables.types';
import { useTableCardLogic } from '@/features/qr-tables/hooks/useTableCardLogic';

export const TableCard = (props: TableCardProps) => {
  const { table, isSelected, onToggleSelect } = props;
  const { t } = useTranslation();

  const {
    qrImage,
    handleEditClick,
    handleDeleteClick,
    handleToggleStatus,
  } = useTableCardLogic(props);

  return (
    <Card 
      className={`p-5 m-0.5 transition-all relative group flex flex-col justify-between min-h-70 rounded-2xl border ${
        isSelected 
          ? 'border-brand-copper bg-brand-copper/5 ring-1 ring-brand-copper' 
          : 'border-border-main bg-bg-surface'
      }`}
    >
      <div 
        className="absolute top-3 left-3 z-40 w-8 h-8 flex items-center justify-center rounded-md pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox 
          id={`check-${table.id}`} 
          checked={isSelected} 
          onChange={() => onToggleSelect(table.id)} 
          className="cursor-pointer scale-110 m-0"
        />
      </div>

      <div className="absolute top-3 right-3 z-30 flex gap-1.5 pointer-events-auto">
        {table.qrUrl && (
          <a 
            href={table.qrUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="rounded-md bg-bg-main border border-border-main p-1.5 text-text-muted hover:text-brand-copper transition-colors duration-200 shadow-xs flex items-center justify-center outline-none cursor-pointer"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <button 
          onClick={handleEditClick} 
          className="rounded-md bg-bg-main border border-border-main p-1.5 text-text-muted hover:text-brand-copper transition-colors duration-200 shadow-xs flex items-center justify-center outline-none cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          onClick={handleDeleteClick} 
          className="rounded-md bg-bg-main border border-border-main p-1.5 text-text-muted hover:text-red-500 transition-colors duration-200 shadow-xs flex items-center justify-center outline-none cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 mt-6 pointer-events-none">
        <div className="relative rounded-xl border border-border-main bg-white p-2 shadow-xs pointer-events-auto w-32 h-32 flex items-center justify-center shrink-0">
          {qrImage ? (
            table.qrUrl ? (
              <a href={table.qrUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full cursor-pointer">
                <Image 
                  src={qrImage} 
                  alt={`${t('qr.table')} ${table.tableNumber}`}
                  width={112}
                  height={112}
                  unoptimized
                  className="object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white rounded-md p-0.5" 
                />
              </a>
            ) : (
              <Image 
                src={qrImage} 
                alt={`${t('qr.table')} ${table.tableNumber}`}
                width={112}
                height={112}
                unoptimized
                className="object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white rounded-md p-0.5" 
              />
            )
          ) : (
            <div className="h-28 w-28 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg" />
          )}
        </div>
        
        <h3 className="mt-4 text-lg font-bold text-text-main text-center line-clamp-1">
          {t('qr.table')} {table.tableNumber}
        </h3>
        <span className="mt-1 text-xs font-medium text-text-muted bg-border-main px-2.5 py-0.5 rounded-full line-clamp-1">
          {table.type}
        </span>
      </div>

      <div className="mt-4 border-t border-border-main pt-3 flex items-center justify-between w-full relative z-20 pointer-events-auto">
        <span className={`text-xs font-semibold ${table.isActive ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'}`}>
          {table.isActive ? t('qr.statusActive') : t('qr.statusInactive')}
        </span>
        <Switch 
          id={`status-${table.id}`}
          checked={table.isActive} 
          onChange={handleToggleStatus} 
        />
      </div>
    </Card>
  );
};