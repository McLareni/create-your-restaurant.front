import { Dish } from './dishes.types';

export interface FullCategory {
  id: string;
  name: string;
  sortOrder: number;
  dishes: Dish[];
}

export interface FullMenuResponse {
  restaurantId: number;
  categories: FullCategory[];
}

export interface ReorderItem {
  id: string;
  sortOrder: number;
}

export interface DragActiveData {
  type: 'Category' | 'Dish';
  dish?: Dish;
  categoryId?: string;
}