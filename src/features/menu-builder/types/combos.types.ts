export interface ComboDish {
  id: string;
  name: string;
  price: number;
}

export interface Combo {
  id: string;
  name: string;
  priceType: 'FIXED' | 'DISCOUNT';
  priceValue: number;
  dishes: ComboDish[];
}

export type CreateComboDTO = Omit<Combo, 'id'>;
export type UpdateComboDTO = Partial<CreateComboDTO>;