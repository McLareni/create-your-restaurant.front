'use client';

import { ReactNode, useEffect, useState } from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string; // Додано для кастомної ширини модалки
}

const DraggableContent = ({ title, children, onClose, coordinates, className }: any) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'draggable-modal-handler',
  });

  // Застосовуємо трансформацію. Плавний transition тільки коли відпускаємо модалку
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
      {/* Шапка модалки — ТІЛЬКИ ВОНА служить зоною для перетягування */}
      <div 
        {...attributes} 
        {...listeners}
        className={`flex items-center justify-between border-b border-brand-gray/20 dark:border-brand-gray/10 px-6 py-4 cursor-grab active:cursor-grabbing ${isDragging ? 'bg-brand-cream/50 dark:bg-brand-gray/10 rounded-t-2xl' : ''}`}
      >
        <div className="flex items-center gap-3">
          <GripHorizontal className="h-5 w-5 text-brand-gray/50" />
          <h3 className="text-lg font-semibold text-brand-espresso dark:text-brand-cream select-none">{title}</h3>
        </div>
        
        {/* stopPropagation запобігає перетягуванню при кліку на хрестик */}
        <button 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={onClose}
          className="rounded-full p-2 text-brand-gray transition-colors hover:bg-brand-gray/10 dark:hover:bg-brand-gray/20 dark:hover:text-brand-cream outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Сам контент модалки. Курсор стандартний, перетягування не працює */}
      <div className="p-6 cursor-default">
        {children}
      </div>
    </div>
  );
};

export const Modal = (props: ModalProps) => {
  const { isOpen, onClose } = props;
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCoordinates({ x: 0, y: 0 }); // Скидаємо позицію модалки по центру при відкритті
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Захист від випадкових мікро-зсувів: перетягування почнеться, лише якщо протягнути мишкою 5 пікселів
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
      {/* Темний фон для закриття по кліку */}
      <div 
        className="absolute inset-0 bg-brand-espresso/40 dark:bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto" 
        onClick={onClose}
      />
      
      {/* Контекст перетягування */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
         <DraggableContent {...props} coordinates={coordinates} />
      </DndContext>
    </div>
  );
};