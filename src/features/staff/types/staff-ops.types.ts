export interface ClockInResponse {
  status: string;
  firstName: string;
}

export interface WaiterZReport {
  waiterId: number;
  waiterName: string;
  shiftStart: string;
  shiftEnd: string;
  totalHours: number;
  totalOrdersClosed: number;
  totalSalesVolume: number;
  baseHourlyEarnings: number;
  percentageEarnings: number;
  finalTotalEarnings: number;
}

export interface AuthorizeVoidResponse {
  success: boolean;
  voidedBy: string;
}