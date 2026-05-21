import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';

export const useAllergens = () => {
  const queryClient = useQueryClient();

  const { data: allergens = [] } = useQuery({
    queryKey: ['allergens-lookup-list'],
    queryFn: () => dishesApi.getAllergensLookup()
  });

  const createAllergen = useMutation<string, Error, string>({
    mutationFn: async (name: string) => {
      return name;
    },
    onSuccess: (name) => {
      queryClient.setQueryData<string[]>(['allergens-lookup-list'], (old = []) => {
        if (old.includes(name)) return old;
        return [...old, name];
      });
    }
  });

  const deleteAllergen = useMutation<void, Error, string>({
    mutationFn: (name: string) => dishesApi.deleteAllergenLookup(name),
    onSuccess: (_, name) => {
      queryClient.setQueryData<string[]>(['allergens-lookup-list'], (old = []) => {
        return old.filter(a => a !== name);
      });
    }
  });

  return {
    allergens,
    createAllergen: createAllergen.mutate,
    deleteAllergen: deleteAllergen.mutate
  };
};