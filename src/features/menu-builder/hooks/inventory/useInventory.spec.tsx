/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useInventory } from './useInventory';
import { inventoryApi } from '@/features/menu-builder/api/inventory.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@/features/menu-builder/api/inventory.api', () => ({
  inventoryApi: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/shared/hooks/useActiveRestaurantId', () => ({
  useActiveRestaurantId: () => 1,
}));

describe('useInventory', () => {
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

  it('should fetch inventory items', async () => {
    const mockItems = [{ id: 'inv1', name: 'Tomato', unit: 'kg' }];
    (inventoryApi.getAll as jest.Mock).mockResolvedValue(mockItems);

    const { result } = renderHook(() => useInventory(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.inventoryItems).toEqual(mockItems);
  });

  it('should call createItem', async () => {
    (inventoryApi.getAll as jest.Mock).mockResolvedValue([]);
    (inventoryApi.create as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useInventory(), { wrapper });

    await act(async () => {
      await result.current.createItem({ name: 'Cheese', stock: 0, unit: 'kg' });
    });

    expect(inventoryApi.create).toHaveBeenCalledWith({ name: 'Cheese', stock: 0, unit: 'kg' });
  });

  it('should call updateItem', async () => {
    (inventoryApi.getAll as jest.Mock).mockResolvedValue([{ id: 'inv1', name: 'Tomato', unit: 'kg' }]);
    (inventoryApi.update as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useInventory(), { wrapper });

    await act(async () => {
      await result.current.updateItem({ id: 'inv1', name: 'Tomatoes', unit: 'kg' });
    });

    expect(inventoryApi.update).toHaveBeenCalledWith({ id: 'inv1', name: 'Tomatoes', unit: 'kg' });
  });
});
