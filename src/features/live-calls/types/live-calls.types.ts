export interface LiveCallItem {
  id: string;
  tableId: string;
  tableNumber: number;
  type: 'WAITER' | 'BILL';
  createdAt: string;
}

export interface TriggerCallPayload {
  tableId: string;
  type: 'WAITER' | 'BILL';
}