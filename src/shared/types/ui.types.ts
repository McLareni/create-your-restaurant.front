import { ReactNode } from 'react';

export interface Coordinates {
  x: number;
  y: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export interface DraggableContentProps extends Omit<ModalProps, 'isOpen'> {
  coordinates: Coordinates;
}