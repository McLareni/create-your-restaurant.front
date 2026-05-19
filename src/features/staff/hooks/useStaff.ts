import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api/staff.api';
import { useUserStore } from '@/shared/store/useUserStore';

export const useStaff = () => {
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] }),
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => staffApi.updateStaff(Number(restaurantId), id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] }),
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(Number(restaurantId), id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staffList', restaurantId] }),
  });

  return {
    staff,
    isLoading,
    createStaff: createStaffMutation.mutate,
    updateStaff: updateStaffMutation.mutate,
    deleteStaff: deleteStaffMutation.mutate,
  };
};