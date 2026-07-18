'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PanelPosition {
  x: number;
  y: number;
}

interface PanelPositionState {
  positions: Record<string, PanelPosition>;
  activeDraggingPanelId: string | null;
  setPosition: (panelId: string, x: number, y: number) => void;
  setActiveDraggingPanelId: (panelId: string | null) => void;
}

export const usePanelPositionStore = create<PanelPositionState>()(
  persist(
    (set) => ({
      positions: {},
      activeDraggingPanelId: null,
      setPosition: (panelId, x, y) =>
        set((state) => ({
          positions: {
            ...state.positions,
            [panelId]: { x, y },
          },
        })),
      setActiveDraggingPanelId: (panelId) =>
        set({ activeDraggingPanelId: panelId }),
    }),
    {
      name: 'gustio-panel-positions',
      partialize: (state) => ({ positions: state.positions }),
    }
  )
);