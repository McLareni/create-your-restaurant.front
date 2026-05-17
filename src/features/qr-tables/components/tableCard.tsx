'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Switch, Checkbox, Card } from '@/shared/ui';
import { Pencil, Trash2 } from 'lucide-react';
import QRCode from 'qrcode';
import { Table } from '../types/tables.types';

interface TableCardProps {
  table: Table;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (table: Table) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, isActive: boolean) => void;
}

export const TableCard = ({ table, isSelected, onToggleSelect, onEdit, onDelete, onStatusChange }: TableCardProps) => {
  const { t } = useTranslation();
  const [qrImage, setQrImage] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(table.qrUrl, { margin: 1, width: 200 })
      .then(url => setQrImage(url))
      .catch(err => console.error(err));
  }, [table.qrUrl]);

  return (
    <Card 
      className={`!p-5 ${
        isSelected 
          ? '!border-brand-copper !bg-brand-copper/5 ring-1 ring-brand-copper' 
          : ''
      }`}
    >
      <div className="absolute top-4 left-4 z-20">
        <Checkbox 
          id={`check-${table.id}`} 
          label="" 
          checked={isSelected} 
          onChange={() => onToggleSelect(table.id)} 
        />
      </div>

      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity mb-2 relative z-20">
        <button onClick={() => onEdit(table)} className="rounded-md bg-white p-1.5 text-brand-gray shadow-sm hover:text-brand-copper outline-none">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(table.id)} className="rounded-md bg-white p-1.5 text-brand-gray shadow-sm hover:text-red-500 outline-none">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-4 mt-2 relative z-0">
        <div className="relative rounded-xl border border-brand-gray/10 bg-white p-2 shadow-sm">
          {qrImage ? (
            <img src={qrImage} alt={`QR ${table.tableNumber}`} className="h-28 w-28 object-contain mix-blend-multiply" />
          ) : (
            <div className="h-28 w-28 bg-brand-cream/50 rounded-lg animate-pulse" />
          )}
        </div>
        
        <h3 className="mt-4 text-xl font-bold text-brand-espresso text-center line-clamp-1">
          {t('qr.table')} {table.tableNumber}
        </h3>
        <span className="mt-1 text-xs font-medium text-brand-gray bg-brand-gray/10 px-2.5 py-1 rounded-full line-clamp-1">
          {table.type}
        </span>
      </div>

      <div className="mt-auto border-t border-brand-gray/10 pt-4 flex items-center justify-between relative z-10">
        <span className={`text-xs font-medium ${table.isActive ? 'text-green-600' : 'text-red-500'}`}>
          {table.isActive ? t('qr.statusActive') : t('qr.statusInactive')}
        </span>
        <Switch checked={table.isActive} onChange={(val) => onStatusChange(table.id, val)} />
      </div>
    </Card>
  );
};