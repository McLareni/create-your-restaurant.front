/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useCombosManagement } from './useCombosManagement';
import { combosApi } from '@/features/menu-builder/api/combos.api';
import toast from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@/features/menu-builder/api/combos.api', () => ({
  combosApi: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/shared/hooks/useActiveRestaurantId', () => ({
  useActiveRestaurantId: () => 1,
}));

jest.mock('@/features/menu-builder/hooks/dishes/useDishesQueries', () => ({
  useAvailableDishesList: () => ({
    dishes: [{ id: 'dish1', name: 'Pizza', price: 100 }],
    isLoading: false,
  }),
}));

jest.mock('@/shared/hooks/useAppActionState', () => ({
  useAppActionState: (actionFn: any) => {
    return [
      { errors: {} },
      async (formData: FormData) => {
        await actionFn(formData);
      },
      false,
    ];
  },
}));

describe('useCombosManagement', () => {
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

  it('should initialize correctly', async () => {
    (combosApi.getAll as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useCombosManagement(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.combos).toEqual([]);
    expect(result.current.allDishes.length).toBe(1);
    expect(result.current.isModalOpen).toBe(false);
  });

  it('should open create modal', async () => {
    (combosApi.getAll as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useCombosManagement(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.openCreateModal();
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.selectedDishes).toEqual([]);
  });

  it('should open edit modal', async () => {
    const mockCombo = { id: 'combo1', name: 'Combo 1', priceType: 'FIXED', priceValue: 150, dishes: [{ dishId: 'dish1' }] };
    (combosApi.getAll as jest.Mock).mockResolvedValue([mockCombo]);

    const { result } = renderHook(() => useCombosManagement(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.openEditModal(mockCombo as any);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.selectedDishes.length).toBe(1);
    expect(result.current.selectedDishes[0].name).toBe('Pizza');
  });

  it('should toggle dish selection', async () => {
    (combosApi.getAll as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useCombosManagement(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.toggleDishSelection({ id: 'dish1', name: 'Pizza', price: 100 } as any);
    });

    expect(result.current.selectedDishes.length).toBe(1);
    expect(result.current.selectedDishes[0].name).toBe('Pizza');

    act(() => {
      result.current.toggleDishSelection({ id: 'dish1', name: 'Pizza', price: 100 } as any);
    });

    expect(result.current.selectedDishes.length).toBe(0);
  });
});
