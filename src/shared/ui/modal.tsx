'use client';

import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { ModalProps } from '@/shared/types/ui.types';

interface SharedSlotModalProps extends ModalProps {
  footer?: ReactNode;
}

interface DraggableSlotContentProps extends Omit<SharedSlotModalProps, 'isOpen'> {
  coordinates: { x: number; y: number };
}

const DraggableSlotContent = ({ title, children, footer, onClose, coordinates, className }: DraggableSlotContentProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'draggable-shared-modal-handler',
  });

  const style = {
    transform: `translate3d(${coordinates.x + (transform?.x || 0)}px, ${coordinates.y + (transform?.y || 0)}px, 0)`,
    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full rounded-3xl bg-bg-surface border border-solid border-border-main shadow-md flex flex-col pointer-events-auto overflow-hidden min-h-0 h-auto ${
        className && className.includes('max-w-') ? '' : 'max-w-md'
      } ${className}`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`flex items-center justify-between border-b border-solid border-border-main px-6 py-4 cursor-grab active:cursor-grabbing transition-colors shrink-0 ${
          isDragging ? 'bg-bg-element/70' : 'bg-bg-element/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <GripHorizontal className="h-5 w-5 text-text-muted/40 shrink-0 stroke-[2.5]" />
          <h3 className="text-base font-bold text-text-main select-none">{title}</h3>
        </div>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="rounded-xl p-1.5 text-text-muted hover:bg-bg-element transition-colors border-0 bg-transparent outline-none cursor-pointer flex items-center justify-center shrink-0"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
      <div className="p-6 cursor-default text-text-main flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        {children}
      </div>
      {footer && (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-solid border-border-main/60 bg-bg-element/10 shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
};

const ModalInner = (props: SharedSlotModalProps) => {
  const { isOpen, onClose } = props;
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const activeModals = document.querySelectorAll('[role="dialog"], .fixed.inset-0.z-50');
      if (activeModals.length <= 1) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setCoordinates((prev) => ({
      x: prev.x + event.delta.x,
      y: prev.y + event.delta.y,
    }));
  };

  return (
    <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none select-none animate-fade-in">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-xs transition-opacity pointer-events-auto cursor-pointer" onClick={onClose} />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <DraggableSlotContent {...props} coordinates={coordinates} />
      </DndContext>
    </div>
  );
};

export const Modal = (props: SharedSlotModalProps) => {
  if (!props.isOpen) return null;
  return <ModalInner {...props} />;
};