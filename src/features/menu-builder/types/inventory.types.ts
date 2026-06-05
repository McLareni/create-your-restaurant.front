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

export interface InventoryFormValues {
  name: string;
  stock: number;
  unit: InventoryUnit;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}