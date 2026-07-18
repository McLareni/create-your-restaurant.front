'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { drawStyledQr, getQrStyle, saveQrStyle } from '@/features/qr-tables/utils/qrRenderer';
import type { UseQrGeneratorModalProps } from '@/features/qr-tables/types/tables.types';

export const useQrGeneratorModal = ({
  isOpen,
  editingTableId,
  formData,
  tables,
  onSave,
  onStyleConfigured,
}: UseQrGeneratorModalProps) => {
  const [isPending, startTransition] = useTransition();
  const [patternType, setPatternType] = useState<'dots' | 'squares' | 'lines' | 'rounded' | 'diamonds'>(() => getQrStyle(editingTableId || 'new').patternType);
  const [logoOverlay, setLogoOverlay] = useState<boolean>(() => getQrStyle(editingTableId || 'new').logoOverlay);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [qrImage, setQrImage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const restaurantImageUrl = useRestaurantStore((state) => state.activeRestaurant?.imageUrl);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentCoordsRef = useRef({ x: 0, y: 0 });

  const [prevRestaurantImageUrl, setPrevRestaurantImageUrl] = useState(restaurantImageUrl);

  if (restaurantImageUrl !== prevRestaurantImageUrl) {
    setPrevRestaurantImageUrl(restaurantImageUrl);
    setLogoBase64(null);
  }

  useEffect(() => {
    if (!isOpen || !restaurantImageUrl) {
      return;
    }

    let isCurrent = true;
    const fetchLogoAsBase64 = async () => {
      try {
        const res = await fetch(restaurantImageUrl);
        const blob = await res.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        if (isCurrent) {
          setLogoBase64(base64);
        }
      } catch (e) {
        console.error(e);
        if (isCurrent) {
          setLogoBase64(restaurantImageUrl);
        }
      }
    };

    fetchLogoAsBase64();

    return () => {
      isCurrent = false;
    };
  }, [restaurantImageUrl, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let isCurrent = true;

    const generatePreview = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      const mockUrl = `${baseUrl}/menu/preview/${formData.tableNumber || '0'}`;
      const activeTable = tables.find(t => t.id === editingTableId);
      const targetUrl = activeTable?.qrUrl || mockUrl;

      const dataUrl = await drawStyledQr({
        url: targetUrl,
        patternType,
        logoOverlay,
        logoUrl: logoBase64,
      });
      if (isCurrent) {
        setQrImage(dataUrl);
      }
    };

    generatePreview();

    return () => {
      isCurrent = false;
    };
  }, [formData.tableNumber, patternType, logoOverlay, isOpen, editingTableId, tables, logoBase64]);

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

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    modalRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleFormAction = () => {
    startTransition(async () => {
      const config = { patternType, logoOverlay };
      saveQrStyle(editingTableId || 'new', config);
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
    isSidePanelOpen,
    setIsSidePanelOpen,
    qrImage,
    isDragging,
    isPending,
    modalRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleFormAction,
  };
};