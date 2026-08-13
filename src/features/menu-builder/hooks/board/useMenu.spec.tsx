/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useMenu } from './useMenu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { menuApi } from '@/features/menu-builder/api/menu.api';
import toast from 'react-hot-toast';

jest.mock('@/features/menu-builder/api/menu.api', () => ({
  menuApi: {
    getFullMenu: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
    createDish: jest.fn(),
    updateDish: jest.fn(),
    deleteDish: jest.fn(),
    reorderCategories: jest.fn(),
    reorderDishes: jest.fn(),
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

describe('useMenu', () => {
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

  const mockMenuData = {
    restaurantId: 1,
    categories: [
      { id: 'cat1', name: 'Pizza', sortOrder: 0, dishes: [] },
    ],
  };

  it('should fetch menu data', async () => {
    (menuApi.getFullMenu as jest.Mock).mockResolvedValue(mockMenuData);

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories).toEqual(mockMenuData.categories);
  });

  it('should create category and show success toast', async () => {
    (menuApi.getFullMenu as jest.Mock).mockResolvedValue(mockMenuData);
    (menuApi.createCategory as jest.Mock).mockResolvedValue({ id: 'cat2', name: 'Burgers' });

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.createCategory('Burgers');
    });

    await waitFor(() => {
      expect(menuApi.createCategory).toHaveBeenCalledWith({ name: 'Burgers', sortOrder: 1 });
      expect(toast.success).toHaveBeenCalledWith('menu.constructor.categories.notifications.createSuccess');
    });
  });

  it('should update category and show success toast', async () => {
    (menuApi.getFullMenu as jest.Mock).mockResolvedValue(mockMenuData);
    (menuApi.updateCategory as jest.Mock).mockResolvedValue({ id: 'cat1', name: 'Pizzas' });

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateCategory({ id: 'cat1', name: 'Pizzas' });
    });

    await waitFor(() => {
      expect(menuApi.updateCategory).toHaveBeenCalledWith('cat1', { name: 'Pizzas' });
      expect(toast.success).toHaveBeenCalledWith('menu.constructor.categories.notifications.updateSuccess');
    });
  });

  it('should delete dish and show success toast', async () => {
    (menuApi.getFullMenu as jest.Mock).mockResolvedValue(mockMenuData);
    (menuApi.deleteDish as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useMenu(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.deleteDish('dish1');
    });

    await waitFor(() => {
      expect(menuApi.deleteDish).toHaveBeenCalledWith('dish1');
      expect(toast.success).toHaveBeenCalledWith('menu.constructor.dishes.notifications.deleteSuccess');
    });
  });
});
