import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';

export const useAllergens = () => {
  const queryClient = useQueryClient();

  const { data: allergens = [] } = useQuery({
    queryKey: ['allergens-lookup-list'],
    queryFn: () => dishesApi.getAllergensLookup()
  });

  const createAllergen = useMutation({
    mutationFn: async (name: string) => {
      return name;
    },
    onSuccess: (name) => {
      queryClient.setQueryData(['allergens-lookup-list'], (old: string[] = []) => {
        if (old.includes(name)) return old;
        return [...old, name];
      });
    }
  });

  return {
    allergens,
    createAllergen: createAllergen.mutate
  };
};