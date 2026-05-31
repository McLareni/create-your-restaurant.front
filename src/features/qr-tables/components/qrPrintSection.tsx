'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { QrPrintSectionProps } from '../types/tables.types';

export const QrPrintSection = ({ tables, selectedIds, printingDataUrls }: QrPrintSectionProps) => {
  const { t } = useTranslation();
  const tablesToPrint = tables.filter((t) => selectedIds.includes(t.id));

  if (tablesToPrint.length === 0) return null;

  return (
    <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:z-[99999] print:overflow-visible p-4 text-black">
      <style dangerouslySetInnerHTML={{ __html: '@media print { body * { visibility: hidden; } #print-section-area, #print-section-area * { visibility: visible; } #print-section-area { position: absolute; left: 0; top: 0; width: 100%; } }' }} />
      <div id="print-section-area" className="grid grid-cols-3 gap-6 w-full bg-white">
        {tablesToPrint.map((table) => (
          <div 
            key={`print-${table.id}`} 
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-xl bg-white w-full aspect-square text-center break-inside-avoid"
          >
            {printingDataUrls[table.id] && (
              <img src={printingDataUrls[table.id]} alt="QR" className="w-3/4 h-3/4 object-contain mb-2 mx-auto" />
            )}
            <span className="text-xl font-bold text-black">{t('qr.table')} {table.tableNumber}</span>
            {table.type && (
              <span className="text-xs font-medium text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full mt-1">
                {table.type}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};