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
  type: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: LiveMonitorOrderItem[];
};

export type LiveMonitorTable = {
  id: string;
  number: number;
  type: string;
  status: string;
  isWaiterCallActive: boolean;
  waiterCallRequestedAt: string | null;
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
