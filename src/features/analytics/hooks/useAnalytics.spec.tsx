/** @jest-environment jsdom */
import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { analyticsApi } from '@/features/analytics/api/analytics.api';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

jest.mock('@/features/analytics/api/analytics.api', () => ({
  analyticsApi: {
    getSummary: jest.fn(),
  },
}));

jest.mock('@/shared/store/useAccessStore', () => ({
  useAccessStore: jest.fn(),
}));

jest.mock('@/shared/store/useRestaurantStore', () => ({
  useRestaurantStore: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useAnalytics', () => {
  const mockHasModule = jest.fn();
  const mockActiveRestaurant = { id: 1 };
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAccessStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({ hasModule: mockHasModule });
    });
    (useRestaurantStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({ activeRestaurant: mockActiveRestaurant });
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  it('should initialize correctly', () => {
    mockHasModule.mockReturnValue(true);
    
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.hasModule).toBe(true);
    expect(result.current.startDate).toBe('');
    expect(result.current.endDate).toBe('');
    expect(result.current.maxRevenueInChart).toBe(1); // Default max
  });

  it('should calculate max values correctly when data is present', () => {
    mockHasModule.mockReturnValue(true);
    const mockSummary = {
      chartData: [{ date: '01.01', revenue: 100 }, { date: '02.01', revenue: 500 }],
      topDishes: [{ name: 'Dish 1', count: 10, revenue: 100 }, { name: 'Dish 2', count: 50, revenue: 500 }],
      peakHours: [{ hour: '12:00', ordersCount: 5 }, { hour: '13:00', ordersCount: 15 }],
      waiterPerformance: [{ name: 'John', completedOrders: 20 }, { name: 'Jane', completedOrders: 40 }],
    };

    (useQuery as jest.Mock).mockReturnValue({
      data: mockSummary,
      isLoading: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useAnalytics());

    expect(result.current.maxRevenueInChart).toBe(500);
    expect(result.current.maxDishCount).toBe(50);
    expect(result.current.maxPeakHourOrders).toBe(15);
    expect(result.current.maxWaiterOrders).toBe(40);
  });

  it('should format dates and pass them to query correctly', () => {
    mockHasModule.mockReturnValue(true);
    
    renderHook(() => useAnalytics());
    
    // Check if useQuery was called with correct parameters
    const useQueryCall = (useQuery as jest.Mock).mock.calls[0][0];
    
    expect(useQueryCall.queryKey).toEqual(['analytics', 'summary', 1, '', '']);
    expect(useQueryCall.enabled).toBe(true);
  });
});
