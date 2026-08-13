/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useDishesList, useDishesLookups } from './useDishesQueries';
import { menuApi } from '@/features/menu-builder/api/menu.api';
import { dishesApi } from '@/features/menu-builder/api/dishes.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@/features/menu-builder/api/menu.api', () => ({
  menuApi: {
    getFullMenu: jest.fn(),
  },
}));

jest.mock('@/features/menu-builder/api/dishes.api', () => ({
  dishesApi: {
    getAllergensLookup: jest.fn(),
    getTagsLookup: jest.fn(),
  },
}));

jest.mock('@/shared/hooks/useActiveRestaurantId', () => ({
  useActiveRestaurantId: () => 1,
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('useDishesQueries', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('useDishesList should fetch dishes', async () => {
    const mockMenu = { categories: [{ dishes: [{ id: 'dish1', name: 'Pizza' }] }] };
    (menuApi.getFullMenu as jest.Mock).mockResolvedValue(mockMenu);

    const { result } = renderHook(() => useDishesList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 'dish1', name: 'Pizza' }]);
  });

  it('useDishesLookups should fetch lookups for tags', async () => {
    const mockTags = ['Spicy', 'Vegan'];
    (dishesApi.getTagsLookup as jest.Mock).mockResolvedValue(mockTags);

    const { result } = renderHook(() => useDishesLookups('tags'), { wrapper });

    await waitFor(() => expect(result.current.items).toEqual(mockTags));
  });
});
