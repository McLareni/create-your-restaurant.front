'use client';

import { useState, useEffect } from 'react';
import { useStaffMutations } from '@/features/staff/hooks/useStaffMutations';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';
import type { WaiterZReport, ShiftMode } from '@/features/staff/types/staff.types';

export const useStaffShiftManager = (restaurantId: number) => {
  const { t } = useTranslation();
  const mutations = useStaffMutations();

  const [mode, setMode] = useState<ShiftMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`gustio_shift_mode_${restaurantId}`);
      return (saved as ShiftMode) || 'SELECT';
    }
    return 'SELECT';
  });

  const [zReport, setZReport] = useState<WaiterZReport | null>(null);

  const [activeShift, setActiveShift] = useState<{ startTime: string; waiterName: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`gustio_active_shift_${restaurantId}`);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    localStorage.setItem(`gustio_shift_mode_${restaurantId}`, mode);
  }, [mode, restaurantId]);

  useEffect(() => {
    if (activeShift) {
      localStorage.setItem(`gustio_active_shift_${restaurantId}`, JSON.stringify(activeShift));
    } else {
      localStorage.removeItem(`gustio_active_shift_${restaurantId}`);
    }
  }, [activeShift, restaurantId]);

  useEffect(() => {
    if (!activeShift?.startTime) return;

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

  const handleClockInConfirm = async (pinCode: string) => {
    try {
      const data = await mutations.clockInAsync(pinCode);
      setActiveShift({ startTime: new Date().toISOString(), waiterName: data.firstName });
      setMode('SELECT');
      toast.success(`${t('staff.ops.welcome')}, ${data.firstName}!`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || t('auth.errors.defaultError'));
    }
  };

  const handleClockOutConfirm = async (pinCode: string) => {
    try {
      const data = await mutations.clockOutAsync(pinCode);
      setZReport(data);
      setActiveShift(null);
      setElapsedTime('00:00:00');
      setMode('SELECT');
      toast.success(t('staff.ops.clockOutSuccess'));
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || t('auth.errors.defaultError'));
    }
  };

  return {
    mode,
    setMode,
    zReport,
    setZReport,
    activeShift,
    elapsedTime,
    isClockingIn: mutations.isClockingIn,
    isClockingOut: mutations.isClockingOut,
    handleClockInConfirm,
    handleClockOutConfirm,
  };
};