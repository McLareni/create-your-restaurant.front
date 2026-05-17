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
}

export type CreateDishDTO = Omit<Dish, 'id'>;
export type UpdateDishDTO = Partial<CreateDishDTO>;