import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { analyticsApi } from '../api/analytics.api';

export const useAnalytics = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const hasModule = useAccessStore((state) => state.hasModule);
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const { data: summary, isLoading } = useQuery({
    queryKey: ['analytics-summary', restaurantId],
    queryFn: () => analyticsApi.getSummary(restaurantId!),
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

  return {
    t,
    hasModule: hasModule('analytics'),
    summary,
    isLoading,
    maxRevenueInChart,
    maxDishCount,
    handleNavigateToMarketplace,
  };
};