import { create } from 'zustand';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { getApiBaseUrl } from '@/shared/api/base-url';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (restaurantId: number) => Promise<void>;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  isConnecting: false,
  connect: async (restaurantId: number) => {
    if (get().socket || get().isConnecting) return;

    set({ isConnecting: true });

    try {
      const response = await fetch('/api/auth/socket-session', { method: 'GET', cache: 'no-store' });
      if (!response.ok) {
        set({ isConnecting: false });
        return;
      }

      const { token } = await response.json() as { token?: string };
      if (!token) {
        set({ isConnecting: false });
        return;
      }

      const socketUrl = getApiBaseUrl();
      const socket = io(`${socketUrl}/live-monitor`, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        withCredentials: true,
        auth: { restaurantId, token },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 8000,
      });

      socket.on('connect', () => set({ isConnected: true }));
      socket.on('disconnect', () => set({ isConnected: false }));

      set({ socket, isConnecting: false });
    } catch {
      set({ isConnected: false, isConnecting: false });
    }
  },
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, isConnected: false, isConnecting: false });
    }
  }
}));