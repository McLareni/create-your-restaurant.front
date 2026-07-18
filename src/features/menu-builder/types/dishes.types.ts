import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import type { DishFormValues } from '@/features/menu-builder/schemas/dishes.schema';

export interface ModifierGroupLookup {
  id: string;
  name: string;
}

export interface IngredientItem {
  name: string;
  quantity: number;
  unit: string;
  inventoryItemId: string | null;
}

export interface CharacteristicObject {
  id?: string;
  name: string;
}

export interface GalleryItem {
  url: string;
  file?: File;
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
  onOpenSidePanel: (type: 'allergens' | 'tags') => void;
  isSidePanelOpen: boolean;
  activeType: 'allergens' | 'tags';
}

export interface UseDishMediaGalleryReturn {
  dishImageUrls: string[];
  dishPhotoFiles: File[];
  activeDishImageIndex: number;
  setDishPhotoFiles: Dispatch<SetStateAction<File[]>>;
  handleLocalImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePrevDishImage: () => void;
  handleNextDishImage: () => void;
  handleSelectDishImage: (index: number) => void;
  handleRemoveImage: (index: number) => void;
  setAsMainImage: (index: number) => void;
  clearGallery: () => void;
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
  formAction: (payload: FormData) => void;
  handleRemoveImage: (index: number) => void;
  handleSetAsMainImage: (index: number) => void;
  modifierGroups: ModifierGroupLookup[];
  modalSessionKey: string;
}

export interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  state: UseDishModalReturn;
}