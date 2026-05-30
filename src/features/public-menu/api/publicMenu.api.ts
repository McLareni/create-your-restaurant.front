import { apiClient } from '@/shared/api/client';

export interface PublicMenuDishVariant {
  id: string;
  name: string;
  price: number;
  sku?: string | null;
}

export interface PublicMenuDish {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  images?: Array<{ id: string; url: string }>;
  weight?: number | null;
  cookingTime?: number | null;
  calories?: number | null;
  isVegan: boolean;
  isSpicy: boolean;
  isLactoseFree: boolean;
  badge: string;
  allergens: string[];
  tags: string[];
  variants: PublicMenuDishVariant[];
}

export interface PublicMenuCategory {
  id: string;
  name: string;
  sortOrder: number;
  dishes: PublicMenuDish[];
}

export interface PublicMenuResponse {
  restaurantId: number;
  categories: PublicMenuCategory[];
}

export interface CreateOrderInput {
  tableId: string;
  type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  items: Array<{
    dishId: string;
    quantity: number;
  }>;
}

export const publicMenuApi = {
  // Забираємо дубльовані префікси /api/proxy, оскільки apiClient додає їх автоматично
  getMenu: (slug: string) => 
    apiClient.get<PublicMenuResponse>(`/menu/slug/${slug}`),

  checkTableExists: (restaurantId: number, tableId: string) =>
    apiClient.get<{ exists: boolean }>(`/restaurants/${restaurantId}/tables/${tableId}/exists`),

  createOrder: (restaurantId: number, data: CreateOrderInput) =>
    apiClient.post(`/restaurants/${restaurantId}/orders/public`, data),
};