import { apiClient } from '@/shared/api/client';
import {
  PublicMenuResponse,
  CreateOrderInput,
  PublicOrderResponse,
} from '../types/publicMenu.types';

export const publicMenuApi = {
  getMenu: (slug: string) => 
    apiClient.get<PublicMenuResponse>(`/menu/slug/${slug}`),

  checkTableExists: (restaurantId: number, tableId: string) =>
    apiClient.get<{ exists: boolean }>(`/restaurants/${restaurantId}/dining-table/${tableId}/exists`),

  createOrder: (restaurantId: number, data: CreateOrderInput) =>
    apiClient.post<PublicOrderResponse>(`/restaurants/${restaurantId}/orders/public`, data),

  appendItemsToOrder: (
    restaurantId: number,
    orderId: string,
    data: Pick<CreateOrderInput, 'items'>,
  ) =>
    apiClient.post<PublicOrderResponse>(
      `/restaurants/${restaurantId}/orders/public/${orderId}/items`,
      data,
    ),
};