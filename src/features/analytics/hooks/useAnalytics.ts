'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { analyticsApi } from '@/features/analytics/api/analytics.api';

// Need to update the query keys locally since we modified the API
const analyticsQueryKeys = {
  summary: (restaurantId: number | null, startDate: string, endDate: string) => 
    ['analytics', 'summary', restaurantId, startDate, endDate] as const,
};

export const useAnalytics = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const hasModule = useAccessStore((state) => state.hasModule);
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: summary, isLoading, refetch } = useQuery({
    queryKey: analyticsQueryKeys.summary(restaurantId, startDate, endDate),
    queryFn: () => analyticsApi.getSummary(restaurantId!, startDate || undefined, endDate || undefined),
    enabled: hasModule('analytics') && !!restaurantId,
  });

  const handleNavigateToMarketplace = () => {
    router.push('/dashboard/marketplace');
  };

  const maxRevenueInChart = summary?.chartData?.length
    ? Math.max(...summary.chartData.map((d) => d.revenue), 1)
    : 1;

  const maxDishCount = summary?.topDishes?.length
    ? Math.max(...summary.topDishes.map((d) => d.count), 1)
    : 1;

  const maxPeakHourOrders = summary?.peakHours?.length
    ? Math.max(...summary.peakHours.map((p) => p.ordersCount), 1)
    : 1;

  const maxWaiterOrders = summary?.waiterPerformance?.length
    ? Math.max(...summary.waiterPerformance.map((w) => w.completedOrders), 1)
    : 1;

  return {
    t,
    hasModule: hasModule('analytics'),
    summary,
    isLoading,
    maxRevenueInChart,
    maxDishCount,
    maxPeakHourOrders,
    maxWaiterOrders,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    refetch,
    handleNavigateToMarketplace,
  };
};