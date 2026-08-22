export type LiveMonitorOrderItem = {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type LiveMonitorOrder = {
  id: string;
  orderNumber: number;
  type: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'PAID' | 'CANCELED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: LiveMonitorOrderItem[];
  table?: {
    id: string;
    number: number;
    type: string;
    zone?: string | null;
  };
};

export type LiveMonitorTable = {
  id: string;
  number: number;
  type: string;
  status: string;
  isWaiterCallActive: boolean;
  waiterCallRequestedAt: string | null;
  waiterCallType: string | null;
  waiterCallPaymentMethod: 'CASH' | 'CARD' | null;
  zone: string | null;
  activeOrderCount: number;
  activeOrdersTotalAmount: number;
  activeOrders: LiveMonitorOrder[];
};

export type LiveMonitorSnapshot = {
  restaurantId: number;
  generatedAt: string;
  tables: LiveMonitorTable[];
};

export type OrdersChangedPayload = {
  restaurantId: number;
  changeType: 'created' | 'updated' | 'deleted';
  orderId: string;
  emittedAt: string;
  snapshot: LiveMonitorSnapshot;
};