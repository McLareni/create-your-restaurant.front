'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/features/staff/api/staff.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';
import type { ApiErrorResponse } from '@/features/staff/types/staff.types';

export const useStaffOps = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurantId = useRestaurantStore((state) => state.activeRestaurant?.id);
  const restaurantId = activeRestaurantId ? Number(activeRestaurantId) : null;

  const clockInMutation = useMutation({
    mutationFn: (pinCode: string) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.clockIn(restaurantId, pinCode);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(`${t('staff.ops.welcome')}, ${data.firstName}!`);
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorResponse;
      toast.error(err.message || t('auth.errors.defaultError'));
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: (pinCode: string) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffApi.clockOut(restaurantId, pinCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.ops.clockOutSuccess'));
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorResponse;
      toast.error(err.message || t('auth.errors.defaultError'));
    },
  });

  const authorizeVoidMutation = useMutation({
    mutationFn: ({ pinCode, orderId }: { pinCode: string; orderId: string }) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      if (!pinCode || pinCode.trim().length < 4) {
        throw new Error(t('staff.errors.passwordLength'));
      }
      return staffApi.authorizeVoid(restaurantId, pinCode, orderId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] });
      toast.success(`${t('staff.ops.voidSuccess')} ${data.voidedBy}`);
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorResponse;
      toast.error(err.message || t('staff.ops.voidError'));
    },
  });

  return {
    clockIn: clockInMutation.mutateAsync,
    isClockingIn: clockInMutation.isPending,
    clockOut: clockOutMutation.mutateAsync,
    isClockingOut: clockOutMutation.isPending,
    authorizeVoid: authorizeVoidMutation.mutateAsync,
    isAuthorizingVoid: authorizeVoidMutation.isPending,
  };
};