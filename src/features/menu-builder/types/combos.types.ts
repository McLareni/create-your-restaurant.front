import { Dish } from '@/features/menu-builder/types/dishes.types';

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
  dishIds: string[];
}

export interface ComboCardProps {
  combo: Combo;
  allDishes: Dish[];
  onEdit: (combo: Combo) => void;
  onDelete: (id: string) => void;
}

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
  name: string;
  setName: (name: string) => void;
  priceType: ComboPriceType;
  setPriceType: (type: ComboPriceType) => void;
  priceValue: number;
  setPriceValue: (value: number) => void;
  selectedDishes: ComboDishSelect[];
  errors: Record<string, string>;
  openCreateModal: () => void;
  openEditModal: (combo: Combo) => void;
  handleAddDish: (dishId: string) => void;
  handleToggleDish: (dish: ComboDishSelect, checked: boolean) => void;
  handleSave: () => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
  editingCombo: Combo | null;
}

export interface ComboModalProps {
  state: UseCombosManagementReturn;
}