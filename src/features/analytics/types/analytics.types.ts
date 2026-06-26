export type TopDishStat = {
  name: string;
  count: number;
  revenue: number;
};

export type DayChartStat = {
  date: string;
  revenue: number;
};

export type AnalyticsSummary = {
  totalRevenue: number;
  totalOrders: number;
  averageCheck: number;
  topDishes: TopDishStat[];
  chartData: DayChartStat[];
};