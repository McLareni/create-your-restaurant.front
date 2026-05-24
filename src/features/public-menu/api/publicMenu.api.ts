import { apiClient } from '@/shared/api/client';

export interface PublicMenuImage {
  id: string;
  url: string;
}

export interface PublicMenuDish {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  images?: PublicMenuImage[];
  imageUrl?: string | null;
  tags?: string[];
}

export interface PublicMenuCategory {
  id: string;
  name: string;
  sortOrder: number;
  dishes: PublicMenuDish[];
}

export interface PublicMenuResponse {
  restaurantId: number;
  slug?: string;
  categories: PublicMenuCategory[];
}

export interface PublicOrderItem {
  dishId: string;
  quantity: number;
}

export interface CreatePublicOrderPayload {
  tableId: string;
  type: 'DINE_IN';
  items: PublicOrderItem[];
}

export const publicMenuApi = {
  getMenu: async (restaurantSlug: string) => {
    return apiClient.get<PublicMenuResponse>(`/menu/slug/${restaurantSlug}`);
  },

  checkTableExists: async (restaurantId: number, tableId: string) => {
    const response = await apiClient.get<{ exists: boolean }>(
      `/restaurants/${restaurantId}/tables/${tableId}/exists`,
    );
    return response.exists;
  },

  createOrder: async (restaurantId: number, payload: CreatePublicOrderPayload) => {
    return apiClient.post<{ message: string }>(
      `/restaurants/${restaurantId}/orders/public`,
      payload,
    );
  },
};
