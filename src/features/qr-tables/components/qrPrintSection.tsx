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
                className="pt-4 px-5 pb-5 flex flex-col justify-between bg-white border border-solid border-neutral-300 rounded-md select-none relative text-left"
                style={{
                  width: '240px',
                  height: '360px',
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact',
                  boxSizing: 'border-box'
                }}
              >
                <div className="flex items-center justify-between w-full h-7 shrink-0">
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
                    {t('brandName')}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 my-1.5 overflow-hidden">
                  <div className="relative rounded-md bg-white p-3.5 w-34 h-34 flex items-center justify-center shrink-0 border border-solid border-neutral-200 shadow-xs">
                    {printableUrl ? (
                      <Image 
                        src={printableUrl} 
                        alt={`${t('qr.table')} ${table.tableNumber}`} 
                        width={108} 
                        height={108} 
                        unoptimized 
                        className="object-contain rounded-md block select-none pointer-events-none" 
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 rounded-md flex items-center justify-center text-[10px] text-neutral-400 font-medium">
                        {t('qr.print.generating')}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-center w-full max-w-50 shrink-0">
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900 leading-none truncate">
                      {table.tableNumber}
                    </h3>
                    
                    {table.type && (
                      <div className="mt-3 inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-neutral-100 border border-solid border-neutral-200 text-[11px] font-medium text-neutral-600 truncate max-w-full">
                        {zoneLabel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-solid border-neutral-200 flex items-center justify-between w-full shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    {t('qr.print.scanHint')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};