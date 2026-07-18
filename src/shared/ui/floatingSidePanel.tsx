'use client';

import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { usePanelPositionStore } from '@/shared/store/usePanelPositionStore';

interface FloatingSidePanelProps {
  id: string;
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  targetSelector: string;
  targetPanelId?: string;
  side?: 'left' | 'right';
  children: ReactNode;
  className?: string;
  width?: number;
  gap?: number;
}

export const FloatingSidePanel = ({
  id,
  isOpen,
  targetSelector,
  targetPanelId,
  side = 'left',
  children,
  className = '',
  width = 320,
  gap = 12,
}: FloatingSidePanelProps) => {
  const activeDraggingPanelId = usePanelPositionStore((state) => state.activeDraggingPanelId);
  const isDragging = targetPanelId ? activeDraggingPanelId === targetPanelId : false;

  useEffect(() => {
    if (!isOpen) return;

    let animationFrameId: number;
    const sidePanel = document.getElementById(id);
    const mainModal = document.querySelector(targetSelector) as HTMLElement | null;

    if (!mainModal || !sidePanel) return;

    const syncLayout = () => {
      if (mainModal && sidePanel) {
        const rect = mainModal.getBoundingClientRect();
        let leftPos = side === 'left' ? rect.left - width - gap : rect.right + gap;
        
        if (side === 'left' && leftPos < 0) {
          leftPos = rect.right + gap + width <= window.innerWidth ? rect.right + gap : gap;
        } else if (side === 'right' && leftPos + width > window.innerWidth) {
          leftPos = rect.left - width - gap > 0 ? rect.left - width - gap : window.innerWidth - width - gap;
        }
        
        sidePanel.style.position = 'fixed';
        sidePanel.style.top = `${rect.top}px`;
        sidePanel.style.left = `${leftPos}px`;
        sidePanel.style.height = `${rect.height}px`;
        sidePanel.style.width = `${width}px`;
        sidePanel.style.transform = 'none';
      }
    };

    const handleScheduleSync = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(syncLayout);
    };

    syncLayout();
    window.addEventListener('resize', handleScheduleSync, { passive: true });
    window.addEventListener('scroll', handleScheduleSync, { passive: true });

    const resizeObserver = new ResizeObserver(handleScheduleSync);
    const mutationObserver = new MutationObserver(handleScheduleSync);

    resizeObserver.observe(mainModal);
    mutationObserver.observe(mainModal, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleScheduleSync);
      window.removeEventListener('scroll', handleScheduleSync);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isOpen, id, targetSelector, side, width, gap]);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      className={`fixed z-50 bg-bg-surface border border-solid border-border-main shadow-xl flex flex-col overflow-hidden rounded-2xl pointer-events-auto transition-all duration-200 ${
        isDragging ? 'ring-1 ring-brand-emerald/20 shadow-2xl' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};