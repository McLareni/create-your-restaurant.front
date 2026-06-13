import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';

export interface IngredientItem {
  name: string;
  quantity: number;
  unit: string;
  inventoryItemId: string | null;
}

export interface ModifierGroupLookup {
  id: string;
  name: string;
}

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  weight: number | null;
  cookingTime: number | null;
  calories: number | null;
  badge: string;
  isAvailable: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  isLactoseFree: boolean;
  allergens: string[];
  tags: string[];
  modifierIds: string[];
  sortOrder?: number;
  ingredients: IngredientItem[];
  images?: { id: string; url: string }[];
  imageUrl?: string | null;
}

export interface UseDishModalProps {
  createDishAsync: (params: { categoryId: string; data: DishFormValues }) => Promise<Dish>;
  updateDishAsync: (params: { id: string; data: DishFormValues }) => Promise<Dish>;
}

export interface IngredientsTabProps {
  dishForm: DishFormValues;
  setDishForm: Dispatch<SetStateAction<DishFormValues>>;
}

export interface CharacteristicsTabProps {
  dishForm: DishFormValues;
  setDishForm: Dispatch<SetStateAction<DishFormValues>>;
}

export interface UseDishModalReturn {
  isDishModalOpen: boolean;
  setIsDishModalOpen: (open: boolean) => void;
  dishForm: DishFormValues;
  setDishForm: Dispatch<SetStateAction<DishFormValues>>;
  formErrors: Record<string, string>;
  editingDish: Dish | null;
  dishImageUrls: string[];
  activeDishImageIndex: number;
  isSaving: boolean;
  activeTab: 'general' | 'characteristics' | 'ingredients' | 'modifiers' | 'media';
  setActiveTab: (tab: 'general' | 'characteristics' | 'ingredients' | 'modifiers' | 'media') => void;
  handleLocalImageUploadWrapper: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePrevDishImage: () => void;
  handleNextDishImage: () => void;
  handleSelectDishImage: (index: number) => void;
  handleOpenDishModal: (categoryId: string, dish?: Dish | null) => void;
  handleSaveDish: () => Promise<void>;
  modifierGroups: ModifierGroupLookup[];
}

export interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish?: Dish | null;
  state: UseDishModalReturn;
}

export interface DishLivePreviewProps {
  form: DishFormValues;
  imageUrl?: string | null;
}