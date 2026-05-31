import { apiClient } from '@/shared/api/client';
import { PublicMenuResponse, CreateOrderInput } from '../types/publicMenu.types';

export const publicMenuApi = {
  getMenu: (slug: string) => 
    apiClient.get<PublicMenuResponse>(`/menu/slug/${slug}`),

  checkTableExists: (restaurantId: number, tableId: string) =>
    apiClient.get<{ exists: boolean }>(`/restaurants/${restaurantId}/tables/${tableId}/exists`),

  createOrder: (restaurantId: number, data: CreateOrderInput) =>
    apiClient.post(`/restaurants/${restaurantId}/orders/public`, data),
};