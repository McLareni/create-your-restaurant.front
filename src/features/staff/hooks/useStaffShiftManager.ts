'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/features/staff/api/staff.api';
import type { ClockInResponse, WaiterZReport, ShiftMode } from '@/features/staff/types/staff.types';

export const useStaffShiftManager = (restaurantId: number) => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<ShiftMode>('SELECT');
  const [zReport, setZReport] = useState<WaiterZReport | null>(null);
  const [activeShift, setActiveShift] = useState<{ startTime: string; waiterName: string } | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    if (!activeShift?.startTime) {
      return;
    }

    const start = new Date(activeShift.startTime).getTime();
    if (isNaN(start)) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, now - start);

      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeShift]);

  const clockInMutation = useMutation({
    mutationFn: async (pinCode: string) => staffApi.clockIn(restaurantId, pinCode),
    onSuccess: (data: ClockInResponse) => {
      setActiveShift({ startTime: new Date().toISOString(), waiterName: data.firstName });
      setMode('SELECT');
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async (pinCode: string) => staffApi.clockOut(restaurantId, pinCode),
    onSuccess: (data: WaiterZReport) => {
      setZReport(data);
      setActiveShift(null);
      setElapsedTime('00:00:00');
      setMode('SELECT');
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    },
  });

  return {
    mode,
    setMode,
    zReport,
    setZReport,
    activeShift,
    elapsedTime,
    isClockingIn: clockInMutation.isPending,
    isClockingOut: clockOutMutation.isPending,
    handleClockInConfirm: clockInMutation.mutate,
    handleClockOutConfirm: clockOutMutation.mutate,
  };
};