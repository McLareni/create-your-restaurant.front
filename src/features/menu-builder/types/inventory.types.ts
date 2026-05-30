import { z } from 'zod';
import { inventoryItemSchema } from '../schemas/inventory.schema';

export interface InventoryItem {
  id: string;
  restaurantId: number;
  name: string;
  stock: number;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pcs';
  createdAt: string;
  updatedAt: string;
}

export type CreateInventoryItemDTO = z.infer<typeof inventoryItemSchema>;

export type UpdateInventoryItemDTO = {
  id: string;
  name?: string;
  stock?: number;
  unit?: 'kg' | 'g' | 'l' | 'ml' | 'pcs';
};