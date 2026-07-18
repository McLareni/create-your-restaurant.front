'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { drawStyledQr, getQrStyle } from '@/features/qr-tables/utils/qrRenderer';
import type { TableCardProps } from '@/features/qr-tables/types/tables.types';

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
    let isCurrent = true;

    const generateCardCode = async () => {
      const style = getQrStyle(table.id);

      const dataUrl = await drawStyledQr({
        url: table.qrUrl,
        patternType: style.patternType,
        logoOverlay: style.logoOverlay,
        logoUrl: restaurantImageUrl,
      });

      if (isCurrent) {
        setStyledQr(dataUrl);
      }
    };

    generateCardCode();

    return () => {
      isCurrent = false;
    };
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