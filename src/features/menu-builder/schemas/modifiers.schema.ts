import { z } from 'zod';

export const modifierOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'menu.constructor.modifiers.errors.nameMin'),
  price: z.number().min(0, 'menu.constructor.modifiers.errors.valueMin'),
  isAvailable: z.boolean().default(true)
});

export const modifierGroupSchema = z.object({
  name: z.string().min(2, 'menu.constructor.modifiers.errors.nameMin'),
  isRequired: z.boolean().default(false),
  minSelections: z.number().min(0).default(0),
  maxSelections: z.number().nullable().optional(),
  options: z.array(modifierOptionSchema).default([])
});

export type ModifierFormValues = z.infer<typeof modifierGroupSchema>;

export const INITIAL_GROUP_FORM = { 
  name: '', 
  isRequired: false, 
  minSelections: '', 
  maxSelections: '' 
};

export const INITIAL_OPTION_FORM = { 
  name: '', 
  price: '', 
  isAvailable: true 
};