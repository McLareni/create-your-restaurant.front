import type { InventoryFormValues } from '../schemas/inventory.schema';

export type InventoryUnit = 'kg' | 'g' | 'l' | 'ml' | 'pcs';

export interface InventoryItem {
  id: string;
  restaurantId: number;
  name: string;
  stock: number;
  unit: InventoryUnit;
  createdAt: string;
  updatedAt: string;
  lastAuditedAt?: string;
  lastAuditBy?: string;
}

export type CreateInventoryItemDTO = InventoryFormValues;

export type InventoryHistoryAction = 'created' | 'updated' | 'adjusted' | 'deleted';

export interface InventoryHistoryEntry {
  id: string;
  itemId: string;
  restaurantId: number;
  itemName: string;
  action: InventoryHistoryAction;
  previousStock: number;
  nextStock: number;
  delta: number;
  recordedAt: string;
  recordedBy: string;
  note?: string;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface UpdateInventoryItemDTO {
  id: string;
  name?: string;
  stock?: number;
  unit?: InventoryUnit;
}

export interface UseInventoryTabReturn {
  t: (key: string) => string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  auditAt: string;
  setAuditAt: (value: string) => void;
  filteredItems: InventoryItem[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingId: string | null;
  editingItem: InventoryItem | null;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  validationErrors: Record<string, string>;
  isLoading: boolean;
  handleStockBlur: (id: string, value: string) => void;
  startEdit: (item: InventoryItem) => void;
  openCreateModal: () => void;
  handleDeleteConfirm: () => void;
  formAction: (payload: FormData) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedItemHistory: InventoryHistoryEntry[];
  totalItems: number;
  totalHistoryEntries: number;
  lastAuditAt: string | null;
  lowStockItems: number;
  lastAuditByItem: Record<string, string>;
}