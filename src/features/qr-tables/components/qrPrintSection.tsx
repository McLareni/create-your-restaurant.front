'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { QrPrintSectionProps } from '@/features/qr-tables/types/tables.types';

export const QrPrintSection = ({
  tables,
  selectedIds,
  printingDataUrls,
}: QrPrintSectionProps) => {
  const { t } = useTranslation();

  if (selectedIds.length === 0) return null;

  const tablesToPrint = tables.filter((table) => selectedIds.includes(table.id));

  return (
    <div className="hidden print:block print-isolate-canvas print-canvas-target bg-white text-black p-8">
      <div className="grid grid-cols-2 gap-8">
        {tablesToPrint.map((table) => {
          const qrCodeUrl = printingDataUrls[table.id];
          return (
            <div
              key={table.id}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-6 rounded-xl text-center print-no-break"
            >
              <h2 className="text-2xl font-bold tracking-wide text-gray-900 mb-1">
                {t('qr.table')} {table.tableNumber}
              </h2>
              {table.type && (
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full mb-4">
                  {table.type}
                </span>
              )}
              
              {qrCodeUrl ? (
                <Image
                  src={qrCodeUrl}
                  alt={`${t('qr.table')} ${table.tableNumber}`}
                  width={192}
                  height={192}
                  unoptimized
                  className="object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-gray-400">
                  {t('qr.print.generating')}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-4 font-mono">
                {t('qr.print.scanHint')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};