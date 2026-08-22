'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { drawStyledQr, getQrStyle } from '@/features/qr-tables/utils/qrRenderer';
import type { TableCardProps } from '@/features/qr-tables/types/tables.types';

const URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const useTableCard = ({
  table,
  onEdit,
  onDelete,
  onStatusChange,
  styleVersion = 0,
}: TableCardProps) => {
  const { t } = useTranslation();
  const [styledQr, setStyledQr] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const restaurantImageUrl = useRestaurantStore((state) => state.activeRestaurant?.imageUrl);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!table.qrUrl || !isVisible) return;
    let isCurrent = true;

    const generateCardCode = async () => {
      const style = getQrStyle(table.id);

      const dataUrl = await drawStyledQr({
        url: `${URL}${table.qrUrl}`,
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
  }, [table.qrUrl, table.id, styleVersion, restaurantImageUrl, isVisible]);

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
    cardRef,
    handleEditClick,
    handleDeleteClick,
    handleToggleStatus,
  };
};