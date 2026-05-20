import { z } from 'zod';
import { createComboSchema, comboDishSchema } from '../schemas/combos.schema';

export type ComboDish = z.infer<typeof comboDishSchema>;
export type CreateComboDTO = z.infer<typeof createComboSchema>;
export type UpdateComboDTO = Partial<CreateComboDTO>;

export interface Combo {
  id: string;
  restaurantId: number;
  name: string;
  priceType: 'FIXED' | 'DISCOUNT';
  priceValue: number;
  dishes: ComboDish[];
  createdAt: string;
}