/** @jest-environment jsdom */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLiveCalls } from './useLiveCalls';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { liveCallsApi } from '../api/live-calls.api';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import toast from 'react-hot-toast';

jest.mock('../api/live-calls.api');
jest.mock('react-hot-toast');
jest.mock('@/shared/store/useSocketStore', () => ({
  useSocketStore: jest.fn((selector) => selector({
    socket: { on: jest.fn(), off: jest.fn() },
    connect: jest.fn(),
  })),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('useLiveCalls hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    jest.clearAllMocks();

    useAccessStore.setState({ activeModules: ['live-calls'] });
    useRestaurantStore.setState({ activeRestaurant: { id: 1 } as any });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch active calls if module is enabled', async () => {
    const mockCalls = [
      { id: 'uuid-1', tableId: 'uuid-1', tableNumber: 5, type: 'WAITER', createdAt: '2026-08-12' },
    ];
    (liveCallsApi.getActiveCalls as jest.Mock).mockResolvedValue(mockCalls);

    const { result } = renderHook(() => useLiveCalls(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.calls).toEqual(mockCalls);
    expect(liveCallsApi.getActiveCalls).toHaveBeenCalledWith(1);
  });

  it('should not fetch calls if module is disabled', async () => {
    useAccessStore.setState({ activeModules: [] });

    const { result } = renderHook(() => useLiveCalls(), { wrapper });

    expect(liveCallsApi.getActiveCalls).not.toHaveBeenCalled();
    expect(result.current.hasModule).toBe(false);
  });

  it('should dismiss a call and update cache', async () => {
    const mockCalls = [
      { id: 'uuid-1', tableId: 'uuid-1', tableNumber: 5, type: 'WAITER', createdAt: '2026-08-12' },
      { id: 'uuid-2', tableId: 'uuid-2', tableNumber: 6, type: 'BILL', createdAt: '2026-08-12' },
    ];
    (liveCallsApi.getActiveCalls as jest.Mock).mockResolvedValue(mockCalls);
    (liveCallsApi.dismissCall as jest.Mock).mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() => useLiveCalls(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.calls).toHaveLength(2);

    await act(async () => {
      await result.current.handleDismiss('uuid-1');
    });

    expect(liveCallsApi.dismissCall).toHaveBeenCalledWith(1, 'uuid-1');

    await waitFor(() => {
      expect(result.current.calls).toHaveLength(1);
      expect(result.current.calls[0].id).toBe('uuid-2');
    });
  });

  it('should show error toast on dismiss failure', async () => {
    const mockCalls = [
      { id: 'uuid-1', tableId: 'uuid-1', tableNumber: 5, type: 'WAITER', createdAt: '2026-08-12' },
    ];
    (liveCallsApi.getActiveCalls as jest.Mock).mockResolvedValue(mockCalls);
    (liveCallsApi.dismissCall as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useLiveCalls(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      try {
        await result.current.handleDismiss('uuid-1');
      } catch (e) {
        // expected
      }
    });

    expect(toast.error).toHaveBeenCalled();
  });
});
