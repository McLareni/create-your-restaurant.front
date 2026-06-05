'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useStaffOps } from '@/features/staff/hooks/useStaffOps';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import type { WaiterZReport } from '@/features/staff/types/staff.types';

export const useStaffShiftManager = () => {
  const { clockIn, clockOut, isClockingIn, isClockingOut } = useStaffOps();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const [mode, setMode] = useState<'SELECT' | 'IN' | 'OUT'>('SELECT');
  const [zReport, setZReport] = useState<WaiterZReport | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!restaurantId) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || '', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;
    socket.emit('join-restaurant-terminal', { restaurantId });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-restaurant-terminal', { restaurantId });
        socketRef.current.off();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [restaurantId]);

  const handleClockInConfirm = async (pin: string) => {
    try {
      const result = await clockIn(pin);
      if (socketRef.current && restaurantId) {
        socketRef.current.emit('staff-clock-in', {
          restaurantId,
          waiterName: result.firstName,
          timestamp: new Date().toISOString(),
        });
      }
      setMode('SELECT');
    } catch {}
  };

  const handleClockOutConfirm = async (pin: string) => {
    try {
      const report = await clockOut(pin);
      setZReport(report);
      if (socketRef.current && restaurantId) {
        socketRef.current.emit('staff-clock-out', {
          restaurantId,
          waiterId: report.waiterId,
          waiterName: report.waiterName,
          salesVolume: report.totalSalesVolume,
          timestamp: new Date().toISOString(),
        });
      }
      setMode('SELECT');
    } catch {}
  };

  return {
    mode,
    setMode,
    zReport,
    setZReport,
    isClockingIn,
    isClockingOut,
    handleClockInConfirm,
    handleClockOutConfirm,
  };
};