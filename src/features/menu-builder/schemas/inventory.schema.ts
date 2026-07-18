import { z } from 'zod';

export const AVAILABLE_UNITS = ['kg', 'g', 'l', 'ml', 'pcs'] as const;

export const inventoryItemSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'inventory.errors.nameRequired')
    .max(100, 'inventory.errors.nameTooLong'),
  stock: z.number()
    .min(0, 'inventory.errors.stockNegative')
    .max(999999, 'inventory.errors.stockOverflow'),
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