'use client';

import { useEffect, useState } from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
// 🔄 ВИПРАВЛЕНО: Використовуємо локальний відносний шлях для залізобетонного резолву типів компилятором
import { ModalProps, DraggableContentProps } from '../types/ui.types';

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
      className={`relative w-full max-w-lg rounded-2xl bg-white dark:bg-brand-mocha dark:border dark:border-brand-gray/20 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto ${className || ''}`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className={`flex items-center justify-between border-b border-brand-gray/20 dark:border-brand-gray/10 px-6 py-4 cursor-grab active:cursor-grabbing ${isDragging ? 'bg-brand-cream/50 dark:bg-brand-gray/10 rounded-t-2xl' : ''}`}
      >
        <div className="flex items-center gap-3">
          <GripHorizontal className="h-5 w-5 text-brand-gray/50" />
          <h3 className="text-lg font-semibold text-brand-espresso dark:text-brand-cream select-none">{title}</h3>
        </div>
        
        <button 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={onClose}
          className="rounded-full p-2 text-brand-gray transition-colors hover:bg-brand-gray/10 dark:hover:bg-brand-gray/20 dark:hover:text-brand-cream outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-6 cursor-default">
        {children}
      </div>
    </div>
  );
};

export const Modal = (props: ModalProps) => {
  const { isOpen, onClose } = props;
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // 💡 ВИПРАВЛЕНО: Замість useEffect скидаємо координати під час рендеру. 
  // Це запобігає каскадним ререндарам та усуває попередження лінтера.
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
        className="absolute inset-0 bg-brand-espresso/40 dark:bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto" 
        onClick={onClose}
      />
      
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <DraggableContent {...props} coordinates={coordinates} />
      </DndContext>
    </div>
  );
};