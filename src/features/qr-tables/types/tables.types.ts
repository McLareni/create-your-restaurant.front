export interface Table {
  id: string;
  tableNumber: string;
  type: string;
  isActive: boolean;
  qrUrl: string;
}

export type CreateTableDTO = Omit<Table, 'id' | 'qrUrl'>;
export type UpdateTableDTO = Partial<CreateTableDTO>;