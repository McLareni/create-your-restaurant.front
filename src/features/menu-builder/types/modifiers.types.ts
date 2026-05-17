export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  type: 'SINGLE' | 'GROUP';
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
}

export type CreateModifierDTO = Omit<ModifierGroup, 'id'>;
export type UpdateModifierDTO = Partial<CreateModifierDTO>;