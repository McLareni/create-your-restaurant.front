import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffOpsApi } from '@/features/staff/api/staffOps.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

interface ApiErrorResponse {
  message?: string;
}

export const useStaffOps = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const clockInMutation = useMutation({
    mutationFn: (pinCode: string) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffOpsApi.clockIn(restaurantId, pinCode);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(`${t('staff.ops.welcome')}, ${data.firstName}!`);
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorResponse;
      toast.error(err.message || t('auth.errors.defaultError'));
    }
  });

  const clockOutMutation = useMutation({
    mutationFn: (pinCode: string) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffOpsApi.clockOut(restaurantId, pinCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.ops.clockOutSuccess'));
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorResponse;
      toast.error(err.message || t('auth.errors.defaultError'));
    }
  });

  const authorizeVoidMutation = useMutation({
    mutationFn: ({ pinCode, orderId }: { pinCode: string; orderId: string }) => {
      if (!restaurantId) throw new Error(t('auth.errors.defaultError'));
      return staffOpsApi.authorizeVoid(restaurantId, pinCode, orderId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] });
      toast.success(`${t('staff.ops.voidSuccess')} ${data.voidedBy}`);
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorResponse;
      toast.error(err.message || t('staff.ops.voidError'));
    }
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