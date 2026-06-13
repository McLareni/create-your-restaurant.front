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
  styleVersion?: number;
}

export interface QrPrintSectionProps {
  tables: Table[];
  selectedIds: string[];
}

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  url: string;
  patternType: 'dots' | 'squares' | 'lines';
  logoOverlay: boolean;
  logoUrl?: string | null;
  isDark?: boolean;
}

export interface QrGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  errorMsg?: string;
  onDelete?: () => void;
  onPrint?: () => void;
  formData: CreateTableDTO;
  handleFormDataChange: (fields: Partial<CreateTableDTO>) => void;
  tables: Table[];
  filteredTypes: string[];
  showTypeSuggestions: boolean;
  setShowTypeSuggestions: (show: boolean) => void;
  editingTableId: string | null;
  onStyleConfigured?: (tableId: string, config: { patternType: string; logoOverlay: boolean }) => void;
}

export interface UseQrGeneratorModalProps {
  isOpen: boolean;
  editingTableId: string | null;
  formData: CreateTableDTO;
  tables: Table[];
  onSave: () => Promise<void>;
  onStyleConfigured?: (tableId: string, config: { patternType: string; logoOverlay: boolean }) => void;
}