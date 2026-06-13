'use client';

import { useEffect, useState } from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import type { ModalProps, DraggableContentProps } from '@/shared/types/ui.types';

const DraggableContent = ({ title, children, onClose, coordinates, className }: DraggableContentProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'draggable-modal-handler',
  });

  const style = {
    transform: `translate3d(${coordinates.x + (transform?.x || 0)}px, ${coordinates.y + (transform?.y || 0)}px, 0)`,
    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative w-full max-w-lg rounded-3xl bg-bg-surface border border-solid border-border-main shadow-md flex flex-col pointer-events-auto ${className || ''}`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className={`flex items-center justify-between border-b border-solid border-border-main px-6 py-4 cursor-grab active:cursor-grabbing rounded-t-3xl transition-colors ${
          isDragging ? 'bg-bg-element/70' : 'bg-bg-element/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <GripHorizontal className="h-5 w-5 text-text-muted/40" />
          <h3 className="text-base font-bold text-text-main select-none">{title}</h3>
        </div>
        
        <button 
          type="button"
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={onClose}
          className="rounded-xl p-1.5 text-text-muted transition-colors hover:bg-bg-element hover:text-text-main outline-none cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-6 cursor-default text-text-main">
        {children}
      </div>
    </div>
  );
};

export const Modal = (props: ModalProps) => {
  const { isOpen, onClose } = props;
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    setCoordinates({ x: 0, y: 0 });
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setCoordinates((prev) => ({
      x: prev.x + event.delta.x,
      y: prev.y + event.delta.y,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-xs transition-opacity pointer-events-auto" 
        onClick={onClose}
      />
      
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <DraggableContent {...props} coordinates={coordinates} />
      </DndContext>
    </div>
  );
};