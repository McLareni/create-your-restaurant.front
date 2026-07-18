'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { drawStyledQr, getQrStyle } from '@/features/qr-tables/utils/qrRenderer';
import type { QrPrintSectionProps } from '@/features/qr-tables/types/tables.types';

export const useQrPrint = ({ tables, selectedIds }: QrPrintSectionProps) => {
  const { t } = useTranslation();
  const [printQrImages, setPrintQrImages] = useState<Record<string, string>>({});

  const restaurantImageUrl = useRestaurantStore((state) => state.activeRestaurant?.imageUrl);

  useEffect(() => {
    let isCurrent = true;
    const currentTablesToPrint = tables.filter((table) => selectedIds.has(table.id));
    if (currentTablesToPrint.length === 0) return;

    const loadAllPrintCodes = async () => {
      try {
        const promises = currentTablesToPrint.map(async (table) => {
          if (!table.qrUrl) return null;

          const style = getQrStyle(table.id);
          
          const dataUrl = await drawStyledQr({
            url: table.qrUrl,
            patternType: style.patternType,
            logoOverlay: style.logoOverlay,
            logoUrl: restaurantImageUrl,
            isDark: true,
          });

          return { id: table.id, dataUrl };
        });

        const results = await Promise.all(promises);
        const compiledImages: Record<string, string> = {};

        results.forEach((res) => {
          if (res) {
            compiledImages[res.id] = res.dataUrl;
          }
        });

        if (isCurrent) {
          setPrintQrImages(compiledImages);
        }
      } catch {}
    };

    loadAllPrintCodes();

    return () => {
      isCurrent = false;
    };
  }, [selectedIds, tables, restaurantImageUrl]);

  const tablesToPrint = tables.filter((table) => selectedIds.has(table.id));

  return {
    t,
    printQrImages,
    tablesToPrint,
  };
};