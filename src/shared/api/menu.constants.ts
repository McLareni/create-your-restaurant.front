export const DISH_MODAL_TABS = ['pricing', 'characteristics', 'ingredients', 'modifiers', 'media'] as const;

export const DISH_BADGES = ['NONE', 'NEW', 'HIT', 'CHEF_CHOICE', 'TOP_RATED'] as const;

export const COMBO_PRICE_TYPES = ['FIXED', 'DISCOUNT'] as const;

export const SYSTEM_ROLES = ['OWNER', 'STAFF', 'CUSTOMER'] as const;

export type SystemRole = (typeof SYSTEM_ROLES)[number];

export const PERMISSIONS = {
  STAFF_READ: 'staff:read',
  STAFF_CREATE: 'staff:create',
  STAFF_UPDATE: 'staff:update',
  STAFF_DELETE: 'staff:delete',
  STAFF_ROLES: 'staff:roles',
  MENU_READ: 'menu:read',
  MENU_CREATE: 'menu:create',
  MENU_UPDATE: 'menu:update',
  MENU_DELETE: 'menu:delete',
  TABLES_READ: 'tables:read',
  TABLES_MANAGE: 'tables:manage',
  LIVE_READ: 'live-calls:read',
  LIVE_RESOLVE: 'live-calls:resolve',
  INVENTORY_READ: 'inventory:read',
  INVENTORY_MANAGE: 'inventory:manage',
  POS_READ: 'pos:read',
  POS_MANAGE: 'pos:manage',
  ANALYTICS_READ: 'analytics:read',
  ORDERS_READ: 'orders:read',
  ORDERS_MANAGE: 'orders:manage',
  FEEDBACK_MANAGE: 'feedback:manage',
  VISUAL_MANAGE: 'visual:manage',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];