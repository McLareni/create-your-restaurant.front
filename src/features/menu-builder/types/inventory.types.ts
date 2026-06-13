import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { z } from 'zod';
import { inventoryItemSchema } from '@/features/menu-builder/schemas/inventory.schema';

export type InventoryUnit = 'kg' | 'g' | 'l' | 'ml' | 'pcs';

export interface InventoryItem {
  id: string;
  restaurantId: number;
  name: string;
  stock: number;
  unit: InventoryUnit;
  createdAt: string;
  updatedAt: string;
}

export type CreateInventoryItemDTO = z.infer<typeof inventoryItemSchema>;

export type InventoryFormValues = CreateInventoryItemDTO;

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
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredItems: InventoryItem[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  formData: InventoryFormValues;
  setFormData: Dispatch<SetStateAction<InventoryFormValues>>;
  validationErrors: Record<string, string>;
  editingId: string | null;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  openCreateModal: () => void;
  startEdit: (item: InventoryItem) => void;
  handleStockBlur: (id: string, value: string) => void;
  handleUnitChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleFormAction: () => void;
  handleDeleteConfirm: () => void;
}