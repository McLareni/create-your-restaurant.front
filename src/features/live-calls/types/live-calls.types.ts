export interface LiveCallItem {
  id: string;
  tableId: string;
  tableNumber: number;
  type: 'WAITER' | 'BILL';
  paymentMethod?: 'CASH' | 'CARD' | null;
  createdAt: string;
}

export interface TriggerCallPayload {
  tableId: string;
  type: 'WAITER' | 'BILL';
  paymentMethod?: 'CASH' | 'CARD';
}