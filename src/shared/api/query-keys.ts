export const QUERY_KEYS = {
  inventory: (restaurantId: number | null) => ['inventory', restaurantId] as const,
  fullMenu: (restaurantId: number | null) => ['fullMenu', restaurantId] as const,
  combos: (restaurantId: number | null) => ['combos', restaurantId] as const,
  dishesListAll: (restaurantId: number | null) => ['dishes-list-all', restaurantId] as const,
  modifierGroups: (restaurantId: number | null) => ['modifierGroups', restaurantId] as const,
  dishesLookup: (restaurantId: number | null, type?: 'allergens' | 'tags') => 
    type ? ['dishes-lookup', restaurantId, type] as const : ['dishes-lookup', restaurantId] as const,
  staffList: (restaurantId: number | null) => ['staffList', restaurantId] as const,
  staffRoles: (restaurantId: number | null) => ['staffRoles', restaurantId] as const,
  orders: (restaurantId: number | null) => ['orders', restaurantId] as const,
} as const;