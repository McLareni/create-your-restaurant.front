import type { Dish } from '@/features/menu-builder/types/dishes.types';

export type ComboPriceType = 'FIXED' | 'DISCOUNT';

export interface ComboDishRelation {
  id: string;
  comboId: string;
  dishId: string;
}

export interface Combo {
  id: string;
  restaurantId: number;
  name: string;
  priceType: ComboPriceType;
  priceValue: number;
  dishes: ComboDishRelation[];
  createdAt: string;
  updatedAt: string;
}

export interface ComboDishSelect {
  id: string;
  name: string;
  price: number;
}

export interface CreateComboDTO {
  name: string;
  priceType: ComboPriceType;
  priceValue: number;
  dishes: { id: string }[];
}

export interface ComboCardProps {
  combo: Combo;
  allDishes: Dish[];
  onEdit: (combo: Combo) => void;
  onDelete: (id: string) => void;
}

export interface ComboFormState {
  name: string;
  priceType: ComboPriceType;
  priceValue: number;
}

export type ComboFormValues = CreateComboDTO;

export interface UseCombosManagementReturn {
  t: (key: string) => string;
  combos: Combo[];
  allDishes: Dish[];
  isDishesLoading: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  priceType: ComboPriceType;
  setPriceType: (type: ComboPriceType) => void;
  selectedDishes: ComboDishSelect[];
  errors: Record<string, string>;
  openCreateModal: () => void;
  openEditModal: (combo: Combo) => void;
  toggleDishSelection: (dish: Dish) => void;
  removeDishFromCombo: (dishId: string) => void;
  handleConfirmDelete: () => Promise<void> | void;
  formAction: (payload: FormData) => void;
  editingCombo: Combo | null;
  modalSessionKey: string;
}

export interface ComboModalProps {
  state: UseCombosManagementReturn;
}