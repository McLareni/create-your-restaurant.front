/** @jest-environment jsdom */
import { renderHook, waitFor } from '@testing-library/react';
import { useLiveMonitor } from './useLiveMonitor';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { liveMonitorApi } from '@/features/live-monitor/api/liveMonitor.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useSocketStore } from '@/shared/store/useSocketStore';
import React from 'react';

// Mock dependencies
jest.mock('@/features/live-monitor/api/liveMonitor.api');
jest.mock('@/shared/store/useRestaurantStore');
jest.mock('@/shared/store/useSocketStore');
jest.mock('react-hot-toast');
jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('useLiveMonitor', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    jest.clearAllMocks();

    (useRestaurantStore as unknown as jest.Mock).mockImplementation((selector) => 
      selector({ activeRestaurant: { id: 1, name: 'Test Restaurant' } })
    );

    (useSocketStore as unknown as jest.Mock).mockReturnValue({
      socket: {
        on: jest.fn(),
        off: jest.fn(),
      },
      isConnected: true,
      connect: jest.fn(),
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch tables with active orders', async () => {
    const mockData = {
      restaurantId: 1,
      generatedAt: '2026-08-12T10:00:00Z',
      tables: [
        {
          id: 'table1',
          number: 1,
          status: 'ACTIVE',
          isWaiterCallActive: false,
          activeOrders: [],
        },
      ],
    };
    (liveMonitorApi.getTablesWithActiveOrders as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLiveMonitor(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tables).toEqual(mockData.tables);
    expect(result.current.generatedAt).toEqual(mockData.generatedAt);
  });

  it('should resolve waiter call', async () => {
    (liveMonitorApi.resolveWaiterCall as jest.Mock).mockResolvedValue({});
    (liveMonitorApi.getTablesWithActiveOrders as jest.Mock).mockResolvedValue({ tables: [] });

    const { result } = renderHook(() => useLiveMonitor(), { wrapper });

    result.current.resolveWaiterCall('table1');

    await waitFor(() => {
      expect(liveMonitorApi.resolveWaiterCall).toHaveBeenCalledWith(1, 'table1');
    });
  });

  it('should fetch history orders', async () => {
    const mockHistory = {
      orders: [
        {
          id: 'order1',
          status: 'COMPLETED',
        },
      ],
    };
    (liveMonitorApi.getHistory as jest.Mock).mockResolvedValue(mockHistory);

    const { result } = renderHook(() => useLiveMonitor('2026-08-12'), { wrapper });

    await waitFor(() => {
      expect(result.current.isHistoryLoading).toBe(false);
    });

    expect(result.current.historyOrders).toEqual(mockHistory.orders);
    expect(liveMonitorApi.getHistory).toHaveBeenCalledWith(1, '2026-08-12');
  });

  it('should update order status', async () => {
    (liveMonitorApi.updateOrderStatus as jest.Mock).mockResolvedValue({});
    (liveMonitorApi.getTablesWithActiveOrders as jest.Mock).mockResolvedValue({ tables: [] });

    const { result } = renderHook(() => useLiveMonitor(), { wrapper });

    result.current.updateOrderStatus('order1', 'COMPLETED');

    await waitFor(() => {
      expect(liveMonitorApi.updateOrderStatus).toHaveBeenCalledWith(1, 'order1', 'COMPLETED');
    });
  });
});
