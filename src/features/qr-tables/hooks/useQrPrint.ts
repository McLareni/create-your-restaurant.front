'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { QrPrintSectionProps } from '@/features/qr-tables/types/tables.types';
import { drawStyledQr } from '@/features/qr-tables/utils/qrRenderer';

export const useQrPrint = ({ tables, selectedIds }: QrPrintSectionProps) => {
  const { t } = useTranslation();
  const [printQrImages, setPrintQrImages] = useState<Record<string, string>>({});
  
  const restaurantImageUrl = useRestaurantStore((state) => state.activeRestaurant?.imageUrl);

  useEffect(() => {
    let isCurrent = true;
    const currentTablesToPrint = tables.filter((table) => selectedIds.includes(table.id));
    if (currentTablesToPrint.length === 0) return;

    const loadAllPrintCodes = async () => {
      const compiledImages: Record<string, string> = {};

      for (const table of currentTablesToPrint) {
        if (!table.qrUrl) continue;

        let patternType: 'dots' | 'squares' | 'lines' = 'dots';
        let logoOverlay = true;

        const savedStyle = localStorage.getItem(`qr-style-${table.id}`);
        if (savedStyle) {
          try {
            const parsed = JSON.parse(savedStyle);
            patternType = parsed.patternType || 'dots';
            logoOverlay = parsed.logoOverlay !== false;
          } catch {
            patternType = 'dots';
            logoOverlay = true;
          }
        }

        const canvas = document.createElement('canvas');
        const dataUrl = await drawStyledQr({
          canvas,
          url: table.qrUrl,
          patternType,
          logoOverlay,
          logoUrl: restaurantImageUrl,
          isDark: true,
        });
        compiledImages[table.id] = dataUrl;
      }

      if (isCurrent) {
        setPrintQrImages(compiledImages);
      }
    };

    loadAllPrintCodes();

    return () => {
      isCurrent = false;
    };
  }, [selectedIds, tables, restaurantImageUrl]);

  const tablesToPrint = tables.filter((table) => selectedIds.includes(table.id));

  return {
    t,
    printQrImages,
    tablesToPrint,
  };
};