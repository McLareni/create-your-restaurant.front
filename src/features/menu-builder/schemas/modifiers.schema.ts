import { z } from 'zod';

export const modifierOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .trim()
    .min(1, 'menu.constructor.modifiers.errors.nameMin')
    .max(100, 'menu.constructor.modifiers.errors.nameMax'),
  price: z.number()
    .min(0, 'menu.constructor.modifiers.errors.valueMin')
    .max(100000, 'menu.constructor.modifiers.errors.priceMax'),
  isAvailable: z.boolean().default(true),
});

export const modifierGroupSchema = z
  .object({
    name: z.string()
      .trim()
      .min(2, 'menu.constructor.modifiers.errors.nameMin')
      .max(100, 'menu.constructor.modifiers.errors.nameMax'),
    isRequired: z.boolean().default(false),
    minSelections: z.number().min(0).max(100).default(0),
    maxSelections: z.number().min(1).max(100).nullable().optional(),
    options: z.array(modifierOptionSchema).default([]),
  })
  .refine(
    (data) => {
      if (data.maxSelections !== null && data.maxSelections !== undefined) {
        return data.minSelections <= data.maxSelections;
      }
      return true;
    },
    {
      message: 'menu.constructor.modifiers.errors.minSelectionsExceedsMax',
      path: ['maxSelections'],
    }
  )
  .refine(
    (data) => {
      if (data.isRequired) {
        return data.minSelections >= 1;
      }
      return true;
    },
    {
      message: 'menu.constructor.modifiers.errors.minSelectionsRequiredWhenMandatory',
      path: ['minSelections'],
    }
  );

export type ModifierFormValues = z.infer<typeof modifierGroupSchema>;

export const INITIAL_GROUP_FORM = {
  name: '',
  isRequired: false,
  minSelections: '0',
  maxSelections: '',
};

export const INITIAL_OPTION_FORM = {
  name: '',
  price: '0',
  isAvailable: true,
};