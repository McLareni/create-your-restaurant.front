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

export interface PanelPosition {
  x: number;
  y: number;
}

export interface SharedPanelPositionState {
  positions: Record<string, PanelPosition>;
  setPosition: (panelId: string, x: number, y: number) => void;
}

export interface DraggableFloatingPanelProps {
  panelId: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  defaultX?: number;
  defaultY?: number;
}