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
  restaurantName?: string;
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

export interface PublicOrderItemSummary {
  id: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PublicOrderSummary {
  id: string;
  status?: string;
  totalAmount: number;
  createdAt?: string;
  items: PublicOrderItemSummary[];
}

export interface PublicOrderResponse {
  message: string;
  order: PublicOrderSummary;
}

export interface PublicMenuClientProps {
  restaurantSlug: string;
  tableId?: string;
  orderId?: string;
}

export interface UsePublicMenuClientReturn {
  menuData: PublicMenuResponse | undefined;
  isMenuLoading: boolean;
  isMenuError: boolean;
  isTableLoading: boolean;
  isTableError: boolean;
  tableExists: boolean;
  hasTableId: boolean;
  canUseCart: boolean;
  cart: Record<string, number>;
  totalItems: number;
  totalAmount: number;
  dishesById: Record<string, PublicMenuDish>;
  activeOrder: PublicOrderSummary | null;
  activeOrderId?: string;
  addDish: (dishId: string) => void;
  removeDish: (dishId: string) => void;
  placeOrder: () => void;
  isPlacingOrder: boolean;
}