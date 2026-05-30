import { DishFormValues } from '../schemas/dishes.schema';

export type ProductionZone = 'HOT_KITCHEN' | 'COLD_KITCHEN' | 'BAR' | 'SUSHI' | 'HOOKAH';

export interface DishVariant {
  id?: string;
  name: string;
  price: number;
  sku?: string;
}

export interface IngredientItem {
  name: string;
  quantity: number;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pcs';
  inventoryItemId?: string | null;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  images?: Array<{ id: string; url: string }>;
  sku?: string;
  price: number;
  variants: DishVariant[];
  taxRate: number;
  weight: number | null;
  cookingTime: number | null;
  calories: number | null;
  isVegan: boolean;
  isSpicy: boolean;
  isLactoseFree: boolean;
  badge: string;
  allergens: string[];
  tags: string[];
  isAvailable: boolean;
  stockQuantity: number | null;
  productionZone: ProductionZone | null;
  modifierIds: string[];
  ingredients: IngredientItem[];
  upsellDishIds: string[];
}

export type CreateDishDTO = Omit<Dish, 'id' | 'stockQuantity' | 'productionZone'>;
export type UpdateDishDTO = Partial<CreateDishDTO>;

export interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  handleLocalImageUploadWrapper: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrls: string[];
  activeImageIndex: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
  handleAddVariant: () => void;
  handleRemoveVariant: (index: number) => void;
  handleVariantChange: (index: number, field: string, value: any) => void;
  activeTab: 'general' | 'pricing' | 'characteristics' | 'ingredients' | 'modifiers' | 'upsell' | 'media';
  setActiveTab: (tab: 'general' | 'pricing' | 'characteristics' | 'ingredients' | 'modifiers' | 'upsell' | 'media') => void;
  modifierGroups: any[];
  currentDishId?: string;
  isLoading?: boolean;
  errors: Record<string, string>;
}

export interface DishCardProps {
  dish: Dish;
  categoryId: string;
  onEdit: (categoryId: string, dish: Dish) => void;
  onDelete: (dishId: string) => void;
  isOverlay?: boolean;
}

export interface DishLivePreviewProps {
  form: DishFormValues;
  imageUrl?: string;
}

export interface CharacteristicsTabProps {
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
}

export interface IngredientsTabProps {
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
}

export interface UpsellTabProps {
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
  currentDishId?: string;
}