import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi } from '../api/dishes.api';

export const useDishTags = () => {
  const queryClient = useQueryClient();

  const { data: tags = [] } = useQuery({
    queryKey: ['dish-tags-lookup-list'],
    queryFn: () => dishesApi.getTagsLookup()
  });

  const createTag = useMutation({
    mutationFn: async (name: string) => {
      return name;
    },
    onSuccess: (name) => {
      queryClient.setQueryData(['dish-tags-lookup-list'], (old: string[] = []) => {
        if (old.includes(name)) return old;
        return [...old, name];
      });
    }
  });

  return {
    tags,
    createTag: createTag.mutate
  };
};