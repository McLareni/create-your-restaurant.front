import { z } from 'zod';

export const AVAILABLE_UNITS = ['kg', 'g', 'l', 'ml', 'pcs'] as const;

export const inventoryItemSchema = z.object({
  name: z.string().min(1, 'inventory.errors.nameRequired'),
  stock: z.number().min(0, 'inventory.errors.stockNegative'),
  unit: z.enum(AVAILABLE_UNITS, {
    message: 'inventory.errors.unitRequired',
  }),
});

export type InventoryFormValues = z.infer<typeof inventoryItemSchema>;

export const INITIAL_INVENTORY_FORM: InventoryFormValues = {
  name: '',
  stock: 0,
  unit: 'kg',
};