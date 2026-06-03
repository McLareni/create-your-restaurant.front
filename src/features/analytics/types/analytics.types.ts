export interface TopDishStat {
  name: string;
  count: number;
  revenue: number;
}

export interface DayChartStat {
  date: string;
  revenue: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageCheck: number;
  topDishes: TopDishStat[];
  chartData: DayChartStat[];
}