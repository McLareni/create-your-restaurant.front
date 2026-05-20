import { z } from 'zod';

export const modifierOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'menu.constructor.modifiers.modal.option.nameLabel'),
  price: z.number().min(0, 'menu.constructor.modifiers.modal.option.priceLabel'),
  isAvailable: z.boolean().default(true)
});

export const modifierGroupSchema = z.object({
  name: z.string().min(2, 'menu.constructor.modifiers.modal.group.nameLabel'),
  isRequired: z.boolean().default(false),
  minSelections: z.number().min(0).default(0),
  maxSelections: z.number().nullable().optional(),
  options: z.array(modifierOptionSchema).default([])
});

export type ModifierFormValues = z.infer<typeof modifierGroupSchema>;