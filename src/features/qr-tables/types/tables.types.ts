export interface Table {
  id: string;
  tableNumber: string;
  type: string;
  isActive: boolean;
  qrUrl: string;
}

export type TableStatus = 'ACTIVE' | 'INACTIVE' | 'RESERVED';

export interface BackendTable {
  id: string;
  restaurantId: number;
  number: number;
  status: TableStatus;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  canAcceptOrders?: boolean;
}

export type CreateTableDTO = Omit<Table, 'id' | 'qrUrl'>;
export type UpdateTableDTO = Partial<CreateTableDTO>;