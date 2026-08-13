/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { usePublicMenuClient } from './usePublicMenuClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { publicMenuApi } from '../api/publicMenu.api';
import toast from 'react-hot-toast';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../api/publicMenu.api', () => ({
  publicMenuApi: {
    getMenu: jest.fn(),
    checkTableExists: jest.fn(),
    getOrderById: jest.fn(),
    createOrder: jest.fn(),
    appendItemsToOrder: jest.fn(),
    callWaiter: jest.fn(),
  },
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('usePublicMenuClient', () => {
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
      {
        id: 'cat1',
        dishes: [
          { id: 'dish1', price: 100, name: 'Pizza' },
          { id: 'dish2', price: 200, name: 'Burger' },
        ],
      },
    ],
  };

  it('should fetch menu data and determine if cart can be used', async () => {
    (publicMenuApi.getMenu as jest.Mock).mockResolvedValue(mockMenuData);
    (publicMenuApi.checkTableExists as jest.Mock).mockResolvedValue({ exists: true });

    const { result } = renderHook(() => usePublicMenuClient('test-slug', 'table-id'), { wrapper });

    await waitFor(() => expect(result.current.isMenuLoading).toBe(false));
    await waitFor(() => expect(result.current.isTableLoading).toBe(false));

    expect(result.current.menuData).toEqual(mockMenuData);
    expect(result.current.tableExists).toBe(true);
    expect(result.current.canUseCart).toBe(true);
    expect(result.current.dishesById).toHaveProperty('dish1');
  });

  it('should not allow cart if table does not exist', async () => {
    (publicMenuApi.getMenu as jest.Mock).mockResolvedValue(mockMenuData);
    (publicMenuApi.checkTableExists as jest.Mock).mockResolvedValue({ exists: false });

    const { result } = renderHook(() => usePublicMenuClient('test-slug', 'table-id'), { wrapper });

    await waitFor(() => expect(result.current.isTableLoading).toBe(false));

    expect(result.current.tableExists).toBe(false);
    expect(result.current.canUseCart).toBe(false);
  });

  it('should handle adding and removing dishes from cart', async () => {
    (publicMenuApi.getMenu as jest.Mock).mockResolvedValue(mockMenuData);

    const { result } = renderHook(() => usePublicMenuClient('test-slug', 'table-id'), { wrapper });

    await waitFor(() => expect(result.current.isMenuLoading).toBe(false));

    act(() => {
      result.current.addDish('dish1');
    });

    expect(result.current.cart).toEqual({ dish1: 1 });
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalAmount).toBe(100);

    act(() => {
      result.current.addDish('dish1');
      result.current.addDish('dish2');
    });

    expect(result.current.cart).toEqual({ dish1: 2, dish2: 1 });
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalAmount).toBe(400);

    act(() => {
      result.current.removeDish('dish1');
    });

    expect(result.current.cart).toEqual({ dish1: 1, dish2: 1 });

    act(() => {
      result.current.removeDish('dish1');
    });

    expect(result.current.cart).toEqual({ dish2: 1 });
  });

  it('should call place order and show success toast', async () => {
    (publicMenuApi.getMenu as jest.Mock).mockResolvedValue(mockMenuData);
    (publicMenuApi.checkTableExists as jest.Mock).mockResolvedValue({ exists: true });
    (publicMenuApi.createOrder as jest.Mock).mockResolvedValue({
      order: { id: 'order-123' },
    });

    const { result } = renderHook(() => usePublicMenuClient('test-slug', 'table-id'), { wrapper });

    await waitFor(() => expect(result.current.isMenuLoading).toBe(false));

    act(() => {
      result.current.addDish('dish1');
    });

    act(() => {
      result.current.placeOrder();
    });

    await waitFor(() => {
      expect(publicMenuApi.createOrder).toHaveBeenCalledWith(1, {
        tableId: 'table-id',
        type: 'DINE_IN',
        items: [{ dishId: 'dish1', quantity: 1 }],
      });
      expect(toast.success).toHaveBeenCalledWith('menu.public.orderSuccessNotification');
      expect(result.current.cart).toEqual({});
    });
  });

  it('should call waiter and show success toast', async () => {
    (publicMenuApi.getMenu as jest.Mock).mockResolvedValue(mockMenuData);
    (publicMenuApi.callWaiter as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => usePublicMenuClient('test-slug', 'table-id'), { wrapper });

    await waitFor(() => expect(result.current.isMenuLoading).toBe(false));

    act(() => {
      result.current.callWaiter('WAITER');
    });

    await waitFor(() => {
      expect(publicMenuApi.callWaiter).toHaveBeenCalledWith(1, 'table-id', 'WAITER');
      expect(toast.success).toHaveBeenCalledWith('menu.public.waiterCallSuccess');
    });
  });

  it('should ask for bill and show success toast', async () => {
    (publicMenuApi.getMenu as jest.Mock).mockResolvedValue(mockMenuData);
    (publicMenuApi.callWaiter as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => usePublicMenuClient('test-slug', 'table-id'), { wrapper });

    await waitFor(() => expect(result.current.isMenuLoading).toBe(false));

    act(() => {
      result.current.callWaiter('BILL');
    });

    await waitFor(() => {
      expect(publicMenuApi.callWaiter).toHaveBeenCalledWith(1, 'table-id', 'BILL');
      expect(toast.success).toHaveBeenCalledWith('menu.public.billRequested');
    });
  });
});
