'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-brand-espresso/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-brand-mocha dark:border dark:border-brand-gray/20 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-brand-gray/20 dark:border-brand-gray/10 px-6 py-4">
          <h3 className="text-lg font-semibold text-brand-espresso dark:text-brand-cream">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-brand-gray transition-colors hover:bg-brand-gray/10 dark:hover:bg-brand-gray/20 dark:hover:text-brand-cream outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};