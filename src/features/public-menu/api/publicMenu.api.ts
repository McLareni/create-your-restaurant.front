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

  callWaiter: (restaurantId: number, tableId: string) =>
    apiClient.post<{ message: string; tableId: string }>(
      `/restaurants/${restaurantId}/orders/public/tables/${tableId}/call-waiter`,
    ),

  findOrderByCode: (
    restaurantId: number,
    tableId: string,
    code: string,
  ) =>
    apiClient.get<{ orderId: string }>(
      `/restaurants/${restaurantId}/orders/public/tables/${tableId}/by-code/${encodeURIComponent(code)}`,
    ),

  getOrderById: (
    restaurantId: number,
    tableId: string,
    orderId: string,
  ) =>
    apiClient.get<PublicOrderResponse>(
      `/restaurants/${restaurantId}/orders/public/tables/${tableId}/${orderId}`,
    ),
};