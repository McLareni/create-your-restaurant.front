import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api/staff.api';
import { useUserStore } from '@/shared/store/useUserStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import toast from 'react-hot-toast';

export const useStaff = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const restaurantId = user?.restaurants?.[0]?.id || 1;

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staffList', restaurantId],
    queryFn: () => staffApi.getStaff(Number(restaurantId)),
    enabled: !!restaurantId,
  });

  const createStaffMutation = useMutation({
    mutationFn: (data: any) => staffApi.createStaff(Number(restaurantId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.createSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.createError'));
    }
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => staffApi.updateStaff(Number(restaurantId), id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.updateSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.updateError'));
    }
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(Number(restaurantId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.deleteSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.deleteError'));
    }
  });

  const uploadStaffPhotoMutation = useMutation({
    mutationFn: ({ staffId, file }: { staffId: string; file: File }) =>
      staffApi.uploadStaffPhoto(Number(restaurantId), staffId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.updateError'));
    }
  });

  return {
    staff,
    isLoading,
    createStaff: createStaffMutation.mutate,
    createStaffAsync: createStaffMutation.mutateAsync,
    updateStaff: updateStaffMutation.mutate,
    updateStaffAsync: updateStaffMutation.mutateAsync,
    deleteStaff: deleteStaffMutation.mutate,
    uploadStaffPhoto: uploadStaffPhotoMutation.mutate,
    uploadStaffPhotoAsync: uploadStaffPhotoMutation.mutateAsync,
  };
};