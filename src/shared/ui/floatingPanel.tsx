'use client';

import React, { useRef, useState, useEffect } from 'react';
import { usePanelPositionStore } from '@/shared/store/usePanelPositionStore';
import { X, GripHorizontal } from 'lucide-react';
import type { DraggableFloatingPanelProps as PanelProps } from '@/shared/types/ui.types';

interface ExtendedPanelProps extends PanelProps {
  contentClassName?: string;
}

export const FloatingPanel = ({
  panelId,
  isOpen,
  onClose,
  title,
  children,
  className = '',
  contentClassName = 'overflow-y-auto custom-scrollbar p-4',
}: ExtendedPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const savedPosition = usePanelPositionStore((state) => state.positions[panelId]);
  const setGlobalPosition = usePanelPositionStore((state) => state.setPosition);
  const setActiveDraggingPanelId = usePanelPositionStore((state) => state.setActiveDraggingPanelId);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const hasPosition = (isMounted && !!savedPosition) || (isDragging && !!dragPos);
  const currentPos = isDragging && dragPos ? dragPos : (savedPosition || { x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.close-panel-btn') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('button') ||
      target.closest('textarea')
    ) return;
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();

    setIsDragging(true);
    setActiveDraggingPanelId(panelId);
    dragStart.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setDragPos({ x: rect.left, y: rect.top });
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const boundedX = Math.max(0, Math.min(e.clientX - dragStart.current.x, window.innerWidth - 200));
    const boundedY = Math.max(0, Math.min(e.clientY - dragStart.current.y, window.innerHeight - 150));
    setDragPos({ x: boundedX, y: boundedY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    setActiveDraggingPanelId(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (dragPos) {
      setGlobalPosition(panelId, dragPos.x, dragPos.y);
    }
    setDragPos(null);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none">
      <div
        ref={panelRef}
        style={hasPosition ? {
          transform: `translate3d(${currentPos.x}px, ${currentPos.y}px, 0)`,
        } : undefined}
        className={`absolute pointer-events-auto bg-bg-surface border border-solid border-border-main/80 rounded-2xl shadow-xl flex flex-col min-w-96 max-w-lg transition-shadow duration-200 ${
          isMounted ? 'animate-in fade-in zoom-in-95 duration-200 ease-out' : 'opacity-0 scale-95'
        } ${
          hasPosition ? '' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        } ${isDragging ? 'shadow-2xl ring-1 ring-brand-emerald/20' : ''} ${className}`}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="h-12 border-b border-solid border-border-main/60 px-4 flex items-center justify-between cursor-move bg-bg-main/30 rounded-t-2xl shrink-0 touch-none select-none active:bg-bg-main/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className={`h-4 w-4 transition-colors ${isDragging ? 'text-brand-emerald' : 'text-text-muted/50'}`} />
            <span className="text-sm font-bold tracking-tight text-text-main">
              {title}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="close-panel-btn p-1.5 rounded-xl text-text-muted hover:bg-red-500/5 hover:text-red-500 transition-colors cursor-pointer border-0 bg-transparent outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className={`flex-1 select-text ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};