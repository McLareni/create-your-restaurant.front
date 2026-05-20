'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { X, GripHorizontal } from 'lucide-react';

interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  panelId: string;
}

export const FloatingPanel = ({ isOpen, onClose, title, children, className, panelId }: PanelProps) => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panelStartRef = useRef({ x: 0, y: 0 });
  const currentCoordsRef = useRef({ x: 0, y: 0 });

  const hasWidthConstraint = className?.includes('max-w-') || className?.includes('w-');
  const defaultWidthClass = hasWidthConstraint ? '' : 'w-full max-w-lg';

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(`panel-pos-${panelId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCoordinates(parsed);
        currentCoordsRef.current = parsed;
      } else {
        const panelWidth = 720;
        const x = (window.innerWidth - panelWidth) / 2;
        const y = (window.innerHeight - 550) / 2;
        const initialPos = { x: Math.max(20, x), y: Math.max(20, y) };
        setCoordinates(initialPos);
        currentCoordsRef.current = initialPos;
      }
      setTimeout(() => setIsInitialized(true), 30);
    } else {
      setIsInitialized(false);
    }
  }, [isOpen, panelId, className]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('select')) {
      return;
    }

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panelStartRef.current = { ...currentCoordsRef.current };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const nextCoords = {
      x: panelStartRef.current.x + dx,
      y: panelStartRef.current.y + dy
    };

    currentCoordsRef.current = nextCoords;
    setCoordinates(nextCoords);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    localStorage.setItem(`panel-pos-${panelId}`, JSON.stringify(currentCoordsRef.current));
  };

  if (!isOpen) return null;

  const style = {
    transform: `translate3d(${coordinates.x}px, ${coordinates.y}px, 0)`,
    transition: isDraggingRef.current ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none">
      <div 
        style={style} 
        className={`absolute top-0 left-0 bg-white/95 dark:bg-brand-mocha/95 backdrop-blur-md shadow-2xl rounded-2xl border border-brand-gray/20 dark:border-brand-gray/30 flex flex-col pointer-events-auto select-text transition-opacity ${defaultWidthClass} ${
          isInitialized ? 'animate-in fade-in zoom-in-98 duration-150 opacity-100' : 'opacity-0'
        } ${className || ''}`}
      >
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`flex items-center justify-between px-5 py-3.5 border-b border-brand-gray/10 dark:border-brand-gray/20 cursor-grab active:cursor-grabbing bg-brand-cream/30 dark:bg-brand-espresso/30 rounded-t-2xl select-none touch-none ${
            isDraggingRef.current ? 'bg-brand-cream/60 dark:bg-brand-espresso/50' : ''
          }`}
        >
          <div className="flex items-center gap-2.5">
            <GripHorizontal className="h-4 w-4 text-brand-copper" />
            <h3 className="text-sm font-bold text-brand-espresso dark:text-brand-cream tracking-tight">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-gray hover:text-brand-copper hover:bg-brand-cream dark:hover:bg-brand-gray/20 transition-all outline-none"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};