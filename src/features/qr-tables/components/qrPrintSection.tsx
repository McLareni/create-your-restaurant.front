'use client';

import React from 'react';
import Image from 'next/image';
import { QrPrintSectionProps } from '@/features/qr-tables/types/tables.types';
import { useQrPrint } from '@/features/qr-tables/hooks/useQrPrint';

export const QrPrintSection = (props: QrPrintSectionProps) => {
  const { selectedIds } = props;
  const { t, printQrImages, tablesToPrint } = useQrPrint(props);

  if (selectedIds.length === 0) return null;

  return (
    <div className="hidden print:block bg-white w-full h-full p-6">
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
        {tablesToPrint.map((table) => {
          const printableUrl = printQrImages[table.id];
          return (
            <div
              key={table.id}
              className="flex flex-col items-center justify-between bg-brand-espresso text-brand-cream p-8 rounded-3xl text-center aspect-2/3 max-w-80 mx-auto border border-brand-emerald/30 relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-emerald/40 m-4 rounded-tl-md" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-emerald/40 m-4 rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-emerald/40 m-4 rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-emerald/40 m-4 rounded-br-md" />

              <div className="w-full flex flex-col items-center pt-2">
                <h2 className="text-3xl font-bold tracking-wide text-white">
                  {t('qr.table')} {table.tableNumber}
                </h2>
                {table.type && (
                  <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-brand-emerald bg-brand-mocha border border-brand-emerald/20 px-3 py-1 rounded-full">
                    {table.type}
                  </span>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-center my-4 w-48 h-48">
                {printableUrl ? (
                  <Image
                    src={printableUrl}
                    alt={`${t('qr.table')} ${table.tableNumber}`}
                    width={160}
                    height={160}
                    unoptimized
                    className="w-40 h-40 object-contain block rounded-lg"
                  />
                ) : (
                  <div className="w-40 h-40 bg-brand-cream rounded-xl flex items-center justify-center text-xs text-brand-gray font-medium">
                    {t('qr.print.generating')}
                  </div>
                )}
              </div>
              
              <div className="w-full flex flex-col items-center pb-2">
                <p className="text-xs text-brand-cream/90 max-w-50 leading-relaxed">
                  {t('qr.print.scanHint')}
                </p>
                <div className="w-8 h-px bg-brand-emerald/30 my-3" />
                <p className="text-[9px] text-brand-gray uppercase tracking-widest font-mono">
                  gustio menu
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};