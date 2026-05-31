'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Switch, Checkbox, Card } from '@/shared/ui';
import { Pencil, Trash2 } from 'lucide-react';
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
      className={`p-5 m-0.5 transition-all relative group ${
        isSelected 
          ? 'border-brand-copper bg-brand-copper/5 dark:bg-brand-copper/10 ring-1 ring-brand-copper' 
          : 'border-brand-gray/10 dark:border-brand-gray/20'
      }`}
    >
      <div 
        className="absolute top-2 left-2 z-40 w-10 h-10 flex items-center justify-center rounded-md hover:bg-brand-gray/5 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox 
          id={`check-${table.id}`} 
          label="" 
          checked={isSelected} 
          onChange={() => onToggleSelect(table.id)} 
          className="cursor-pointer scale-110 m-0"
        />
      </div>

      <div className="absolute top-2 right-2 z-30 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
        <button 
          onClick={handleEditClick} 
          className="rounded-md bg-white dark:bg-brand-espresso border border-brand-gray/10 dark:border-brand-gray/20 p-1.5 text-brand-gray dark:text-brand-gray/80 shadow-sm hover:text-brand-copper outline-none cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          onClick={handleDeleteClick} 
          className="rounded-md bg-white dark:bg-brand-espresso border border-brand-gray/10 dark:border-brand-gray/20 p-1.5 text-brand-gray dark:text-brand-gray/80 shadow-sm hover:text-red-500 outline-none cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-4 mt-8 relative z-10 pointer-events-none">
        <div className="relative rounded-xl border border-brand-gray/10 dark:border-brand-gray/20 bg-white dark:bg-brand-mocha/50 p-2 shadow-sm pointer-events-auto">
          {qrImage ? (
            <img 
              src={qrImage} 
              alt={`QR ${table.tableNumber}`} 
              className="h-28 w-28 object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:rounded-md dark:p-1" 
            />
          ) : (
            <div className="h-28 w-28 bg-brand-cream/50 dark:bg-brand-gray/10 rounded-lg animate-pulse" />
          )}
        </div>
        
        <h3 className="mt-4 text-xl font-bold text-brand-espresso dark:text-brand-cream text-center line-clamp-1">
          {t('qr.table')} {table.tableNumber}
        </h3>
        <span className="mt-1 text-xs font-medium text-brand-gray dark:text-brand-gray/80 bg-brand-gray/10 dark:bg-brand-gray/20 px-2.5 py-1 rounded-full line-clamp-1">
          {table.type}
        </span>
      </div>

      <div className="mt-auto border-t border-brand-gray/10 dark:border-brand-gray/20 pt-4 flex items-center justify-between relative z-20 pointer-events-auto">
        <span className={`text-xs font-medium ${table.isActive ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'}`}>
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