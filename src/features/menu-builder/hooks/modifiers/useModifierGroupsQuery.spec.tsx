/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useModifierGroupsQuery } from './useModifierGroupsQuery';
import { modifiersApi } from '@/features/menu-builder/api/modifiers.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@/features/menu-builder/api/modifiers.api', () => ({
  modifiersApi: {
    getGroups: jest.fn(),
  },
}));

jest.mock('@/shared/hooks/useActiveRestaurantId', () => ({
  useActiveRestaurantId: () => 1,
}));

describe('useModifierGroupsQuery', () => {
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

  it('should fetch modifier groups', async () => {
    const mockGroups = [{ id: 'group1', name: 'Size', options: [] }];
    (modifiersApi.getGroups as jest.Mock).mockResolvedValue(mockGroups);

    const { result } = renderHook(() => useModifierGroupsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockGroups);
  });
});
