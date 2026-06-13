'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { TableCardProps } from '@/features/qr-tables/types/tables.types';
import { drawStyledQr } from '@/features/qr-tables/utils/qrRenderer';

export const useTableCard = ({
  table,
  onEdit,
  onDelete,
  onStatusChange,
  styleVersion = 0,
}: TableCardProps) => {
  const { t } = useTranslation();
  const [styledQr, setStyledQr] = useState<string>('');
  
  const restaurantImageUrl = useRestaurantStore((state) => state.activeRestaurant?.imageUrl);

  useEffect(() => {
    if (!table.qrUrl) return;

    const generateCardCode = async () => {
      let patternType: 'dots' | 'squares' | 'lines' = 'dots';
      let logoOverlay = true;

      const savedStyle = localStorage.getItem(`qr-style-${table.id}`);
      if (savedStyle) {
        try {
          const parsed = JSON.parse(savedStyle);
          patternType = parsed.patternType || 'dots';
          logoOverlay = parsed.logoOverlay !== false;
        } catch {}
      }

      const canvas = document.createElement('canvas');
      const dataUrl = await drawStyledQr({
        canvas,
        url: table.qrUrl,
        patternType,
        logoOverlay,
        logoUrl: restaurantImageUrl,
      });
      setStyledQr(dataUrl);
    };

    generateCardCode();
  }, [table.qrUrl, table.id, styleVersion, restaurantImageUrl]);

  const zoneLabel = t(`tables.types.${table.type}`) !== `tables.types.${table.type}`
    ? t(`tables.types.${table.type}`)
    : table.type;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(table);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(table.id);
  };

  const handleToggleStatus = (val: boolean) => {
    onStatusChange(table.id, val);
  };

  return {
    t,
    styledQr,
    zoneLabel,
    handleEditClick,
    handleDeleteClick,
    handleToggleStatus,
  };
};