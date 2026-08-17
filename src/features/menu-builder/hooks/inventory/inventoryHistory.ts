import type { InventoryHistoryEntry, InventoryItem, InventoryHistoryAction } from '@/features/menu-builder/types/inventory.types';

const STORAGE_PREFIX = 'inventory-history-v2';

const pad = (value: number) => String(value).padStart(2, '0');

const createHistoryId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `inv-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const toDateTimeLocalValue = (date: Date) => {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const parseDateTimeValue = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const formatInventoryDateTime = (value: string) => {
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parseDateTimeValue(value));
};

export const buildInventoryHistoryKey = (restaurantId: number) => `${STORAGE_PREFIX}:${restaurantId}`;

export const loadInventoryHistory = (restaurantId: number | null): Record<string, InventoryHistoryEntry[]> => {
  if (restaurantId === null) {
    return {};
  }

  const raw = localStorage.getItem(buildInventoryHistoryKey(restaurantId));
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, InventoryHistoryEntry[]> | null;
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
};

export const saveInventoryHistory = (restaurantId: number | null, historyByItem: Record<string, InventoryHistoryEntry[]>) => {
  if (restaurantId === null) {
    return;
  }

  localStorage.setItem(buildInventoryHistoryKey(restaurantId), JSON.stringify(historyByItem));
};

export const createInventoryHistoryEntry = (params: {
  item: InventoryItem;
  previousStock: number;
  nextStock: number;
  action: InventoryHistoryAction;
  auditAt: string;
  note?: string;
}) : InventoryHistoryEntry => {
  const recordedAt = parseDateTimeValue(params.auditAt).toISOString();

  return {
    id: createHistoryId(),
    itemId: params.item.id,
    restaurantId: params.item.restaurantId,
    itemName: params.item.name,
    action: params.action,
    previousStock: params.previousStock,
    nextStock: params.nextStock,
    delta: params.nextStock - params.previousStock,
    recordedAt,
    recordedBy: 'Поточна сесія',
    note: params.note,
  };
};
