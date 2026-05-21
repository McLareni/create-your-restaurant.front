export interface ModifierOption {
  id?: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number | null;
  options: ModifierOption[];
}

export type CreateModifierDTO = Omit<ModifierGroup, 'id'>;
export type UpdateModifierDTO = Partial<CreateModifierDTO>;