import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api/staff.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { StaffMember, CreateStaffDTO, UpdateStaffDTO, CustomStaffRole } from '../types/staff.types';
import toast from 'react-hot-toast';

export const useStaff = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const { data: staff = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ['staffList', restaurantId],
    queryFn: () => staffApi.getStaff(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: roles = [], isLoading: isRolesLoading } = useQuery({
    queryKey: ['staffRoles', restaurantId],
    queryFn: () => staffApi.getRoles(restaurantId!),
    enabled: !!restaurantId,
  });

  const createStaffMutation = useMutation<StaffMember, Error, CreateStaffDTO>({
    mutationFn: (data: CreateStaffDTO) => staffApi.createStaff(restaurantId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
      toast.success(t('staff.notifications.createSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('staff.notifications.createError'));
    }
  });

  const updateStaffMutation = useMutation<StaffMember, Error, { id: string; data: UpdateStaffDTO }>({
    mutationFn: ({ id, data }) => staffApi.updateStaff(restaurantId!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    }
  });

  const uploadStaffPhotoMutation = useMutation<StaffMember, Error, { staffId: string; file: File }>({
    mutationFn: ({ staffId, file }) => staffApi.uploadStaffPhoto(restaurantId!, staffId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    }
  });

  const deleteStaffMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => staffApi.deleteStaff(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] });
    }
  });

  const createRoleMutation = useMutation<CustomStaffRole, Error, string>({
    mutationFn: (name: string) => staffApi.createRole(restaurantId!, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffRoles', restaurantId] });
    }
  });

  const deleteRoleMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => staffApi.deleteRole(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffRoles', restaurantId] });
    }
  });

  return {
    staff,
    roles,
    isLoading: isStaffLoading || isRolesLoading || restaurantId === null,
    createStaff: createStaffMutation.mutate,
    createStaffAsync: createStaffMutation.mutateAsync,
    updateStaff: updateStaffMutation.mutate,
    updateStaffAsync: updateStaffMutation.mutateAsync,
    deleteStaff: deleteStaffMutation.mutate,
    uploadStaffPhoto: uploadStaffPhotoMutation.mutate,
    uploadStaffPhotoAsync: uploadStaffPhotoMutation.mutateAsync,
    createRole: createRoleMutation.mutateAsync,
    deleteRole: deleteRoleMutation.mutateAsync,
  };
};