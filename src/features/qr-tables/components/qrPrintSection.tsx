'use client';

import React from 'react';
import Image from 'next/image';
import type { QrPrintSectionProps } from '@/features/qr-tables/types/tables.types';
import { useQrPrint } from '@/features/qr-tables/hooks/useQrPrint';

export const QrPrintSection = (props: QrPrintSectionProps) => {
  const { selectedIds } = props;
  const { t, printQrImages, tablesToPrint } = useQrPrint(props);

  if (selectedIds.size === 0) return null;

  return (
    <div className="hidden print:block print-canvas-target bg-white w-full h-full p-0 m-0">
      <style>
        {`
          @page { 
            size: A4 portrait;
            margin: 0; 
          }
          @media print {
            html, body {
              background: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print-flex-container {
              display: flex !important;
              flex-wrap: wrap !important;
              justify-content: center !important;
              align-content: start !important;
              gap: 24px !important;
              padding: 40px !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
            .print-card-item {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
              display: block !important;
            }
          }
        `}
      </style>

      <div className="print-flex-container">
        {tablesToPrint.map((table) => {
          const printableUrl = printQrImages[table.id];
          
          const zoneLabel = t(`tables.types.${table.type}`) !== `tables.types.${table.type}`
            ? t(`tables.types.${table.type}`)
            : table.type;

          return (
            <div key={table.id} className="print-card-item">
              <div 
                className="flex flex-col items-center justify-between bg-brand-espresso text-brand-cream p-8 rounded-3xl text-center relative overflow-hidden shadow-xl"
                style={{
                  width: '280px',
                  height: '420px',
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact'
                }}
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-emerald/40 m-4 rounded-tl-md" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-emerald/40 m-4 rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-emerald/40 m-4 rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-emerald/40 m-4 rounded-tr-md" />
                
                <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-center pt-2 w-48 h-48 shrink-0">
                  {printableUrl ? (
                    <Image src={printableUrl} alt={`${t('qr.table')} ${table.tableNumber}`} width={160} height={160} unoptimized className="w-40 h-40 object-contain block rounded-lg" />
                  ) : (
                    <div className="w-40 h-40 bg-brand-cream rounded-xl flex items-center justify-center text-xs text-brand-gray font-medium">
                      {t('qr.print.generating')}
                    </div>
                  )}
                </div>
                
                <div className="w-full flex flex-col items-center py-2">
                  <h2 className="text-3xl font-bold tracking-wide text-white">
                    {t('qr.table')} {table.tableNumber}
                  </h2>
                  {table.type && (
                    <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-brand-emerald bg-brand-mocha border border-brand-emerald/20 px-3 py-1 rounded-full">
                      {zoneLabel}
                    </span>
                  )}
                </div>
                
                <div className="w-full flex flex-col items-center pb-2">
                  <p className="text-xs text-brand-cream/90 max-w-50 leading-relaxed">
                    {t('qr.print.scanHint')}
                  </p>
                  <div className="w-8 h-px bg-brand-emerald/30 my-3" />
                  <p className="text-[9px] text-brand-gray uppercase tracking-widest font-mono">
                    {t('brandName')}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};