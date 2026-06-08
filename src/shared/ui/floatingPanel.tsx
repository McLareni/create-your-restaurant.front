'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface FloatingPanelProps {
  panelId: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FloatingPanel = ({
  panelId,
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: FloatingPanelProps) => {
  const [coordinates, setCoordinates] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`panel-coords-${panelId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return { x: 0, y: 0 };
        }
      }
    }
    return { x: 0, y: 0 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentCoordsRef = useRef(coordinates);

  useEffect(() => {
    currentCoordsRef.current = coordinates;
  }, [coordinates]);

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select')) return;
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - currentCoordsRef.current.x,
      y: e.clientY - currentCoordsRef.current.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const nextX = e.clientX - dragStartRef.current.x;
    const nextY = e.clientY - dragStartRef.current.y;

    setCoordinates({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    localStorage.setItem(`panel-coords-${panelId}`, JSON.stringify(currentCoordsRef.current));
  };

  const style = {
    transform: `translate3d(${coordinates.x}px, ${coordinates.y}px, 0)`,
    transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent pointer-events-none">
      <div
        style={style}
        className={`w-full bg-white dark:bg-brand-mocha rounded-2xl shadow-2xl border border-brand-gray/10 flex flex-col max-h-[90vh] pointer-events-auto transition-shadow ${
          isDragging ? 'shadow-3xl' : ''
        } ${className}`}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`flex items-center justify-between px-5 py-3.5 border-b border-brand-gray/10 dark:border-brand-gray/20 cursor-grab active:cursor-grabbing bg-brand-cream/30 dark:bg-brand-espresso/30 rounded-t-2xl select-none touch-none transition-colors ${
            isDragging ? 'bg-brand-cream/60 dark:bg-brand-espresso/50' : ''
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-brand-espresso dark:text-brand-cream">
              {title}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-brand-gray hover:bg-brand-gray/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};