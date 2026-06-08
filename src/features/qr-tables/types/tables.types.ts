export type TableStatus = 'ACTIVE' | 'INACTIVE';

export interface Table {
  id: string;
  tableNumber: string;
  type: string;
  isActive: boolean;
  qrUrl: string;
}

export interface BackendTable {
  id: string;
  restaurantId: number;
  number: number;
  status: TableStatus;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTableDTO {
  tableNumber: string;
  type: string;
  isActive: boolean;
}

export type UpdateTableDTO = Partial<CreateTableDTO>;

export interface TableCardProps {
  table: Table;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (table: Table) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, isActive: boolean) => void;
}

export interface UseTableCardLogicProps {
  table: Table;
  onToggleSelect: (id: string) => void;
  onEdit: (table: Table) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, isActive: boolean) => void;
}

export interface QrPrintSectionProps {
  tables: Table[];
  selectedIds: string[];
  printingDataUrls: Record<string, string>;
}