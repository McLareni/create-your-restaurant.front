'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { UseQrGeneratorModalProps } from '@/features/qr-tables/types/tables.types';
import { drawStyledQr } from '@/features/qr-tables/utils/qrRenderer';

export const useQrGeneratorModal = ({
  isOpen,
  editingTableId,
  formData,
  tables,
  onSave,
  onStyleConfigured,
}: UseQrGeneratorModalProps) => {
  const [isPending, startTransition] = useTransition();
  const [patternType, setPatternType] = useState<'dots' | 'squares' | 'lines'>('dots');
  const [logoOverlay, setLogoOverlay] = useState<boolean>(true);
  const [qrImage, setQrImage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const restaurantImageUrl = useRestaurantStore((state) => state.activeRestaurant?.imageUrl);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentCoordsRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`qr-style-${editingTableId || 'new'}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTimeout(() => {
            if (parsed.patternType) setPatternType(parsed.patternType);
            if (parsed.logoOverlay !== undefined) setLogoOverlay(parsed.logoOverlay !== false);
          }, 0);
        } catch {}
      }
    }
  }, [editingTableId]);

  useEffect(() => {
    if (!isOpen) return;

    const generatePreview = async () => {
      const mockUrl = `https://gustio.menu/table-preview-${formData.tableNumber || '0'}`;
      const activeTable = tables.find(t => t.id === editingTableId);
      const targetUrl = activeTable?.qrUrl || mockUrl;

      const canvas = document.createElement('canvas');
      const dataUrl = await drawStyledQr({
        canvas,
        url: targetUrl,
        patternType,
        logoOverlay,
        logoUrl: restaurantImageUrl,
      });
      setQrImage(dataUrl);
    };

    generatePreview();
  }, [formData.tableNumber, patternType, logoOverlay, isOpen, editingTableId, tables, restaurantImageUrl]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('.suggestions-dropdown') || target.closest('a')) return;
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - currentCoordsRef.current.x,
      y: e.clientY - currentCoordsRef.current.y,
    };
    modalRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !modalRef.current) return;
    
    const nextX = e.clientX - dragStartRef.current.x;
    const nextY = e.clientY - dragStartRef.current.y;
    
    currentCoordsRef.current = { x: nextX, y: nextY };
    modalRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    modalRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleFormAction = () => {
    startTransition(async () => {
      const config = { patternType, logoOverlay };
      localStorage.setItem(`qr-style-${editingTableId || 'new'}`, JSON.stringify(config));
      if (editingTableId && onStyleConfigured) {
        onStyleConfigured(editingTableId, config);
      }
      await onSave();
    });
  };

  return {
    patternType,
    setPatternType,
    logoOverlay,
    setLogoOverlay,
    qrImage,
    isDragging,
    isPending,
    modalRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleFormAction,
  };
};