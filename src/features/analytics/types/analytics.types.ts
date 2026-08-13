export type TopDishStat = {
  name: string;
  count: number;
  revenue: number;
};

export type DayChartStat = {
  date: string;
  revenue: number;
};

export type OrderTypeStat = {
  type: string;
  revenue: number;
  count: number;
};

export type PeakHourStat = {
  hour: string;
  ordersCount: number;
};

export type WaiterPerformanceStat = {
  waiterId: number;
  name: string;
  completedOrders: number;
  revenueGenerated: number;
};

export type AnalyticsSummary = {
  totalRevenue: number;
  totalOrders: number;
  averageCheck: number;
  topDishes: TopDishStat[];
  chartData: DayChartStat[];
  ordersByType: OrderTypeStat[];
  peakHours: PeakHourStat[];
  waiterPerformance: WaiterPerformanceStat[];
};