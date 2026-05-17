import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api/staff.api';
import { CreateStaffDTO, UpdateStaffDTO } from '../types/staff.types';

export const useStaff = () => {
  const queryClient = useQueryClient();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateStaffDTO) => staffApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffDTO }) => staffApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  return {
    staff,
    isLoading,
    createStaff: createMutation.mutate,
    updateStaff: updateMutation.mutate,
    deleteStaff: deleteMutation.mutate,
  };
};