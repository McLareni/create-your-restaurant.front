export interface Zone {
  id: string;
  name: string;
  restaurantId: number;
}

export interface Table {
  id: string;
  tableNumber: string;
  type: string;
  isActive: boolean;
  qrUrl: string;
  zoneId?: string | null;
  zone?: Zone | null;
}

export type TableStatus = 'ACTIVE' | 'INACTIVE' | 'RESERVED';

export interface BackendTable {
  id: string;
  restaurantId: number;
  number: number;
  status: TableStatus;
  type: string;
  zoneId?: string | null;
  zone?: Zone | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTableDTO {
  tableNumber: string;
  type: string;
  isActive: boolean;
  zoneId?: string | null;
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