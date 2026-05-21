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
  unit: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
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