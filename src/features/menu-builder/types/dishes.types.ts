export type ProductionZone = 'HOT_KITCHEN' | 'COLD_KITCHEN' | 'BAR' | 'SUSHI' | 'HOOKAH';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  cookingTime: string;
  calories: string;
  isVegan: boolean;
  isSpicy: boolean;
  isLactoseFree: boolean;
  badge: string;
  allergens: string[];
  // НОВІ ПОЛЯ ДЛЯ ІНВЕНТАРИЗАЦІЇ
  isAvailable: boolean;
  stockQuantity: number | null; // null = безліміт
  productionZone: ProductionZone | null;
}

export type CreateDishDTO = Omit<Dish, 'id'>;
export type UpdateDishDTO = Partial<CreateDishDTO>;