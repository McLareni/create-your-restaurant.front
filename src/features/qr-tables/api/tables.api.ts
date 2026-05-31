// src/features/qr-tables/api/tables.api.ts
import { apiClient } from '@/shared/api/client';
import {
  Table,
  CreateTableDTO,
  UpdateTableDTO,
  BackendTable,
  TableStatus,
  Zone,
} from '../types/tables.types';

type TableEnvelope = {
  table: BackendTable;
};

const toStatus = (isActive: boolean): TableStatus =>
  isActive ? 'ACTIVE' : 'INACTIVE';

const getPublicMenuBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

const toUiTable = (
  restaurantId: number,
  table: BackendTable,
  restaurantSlug?: string,
): Table => ({
  id: table.id,
  tableNumber: String(table.number),
  type: table.type,
  isActive: table.status === 'ACTIVE',
  zoneId: table.zoneId,
  zone: table.zone,
  qrUrl: restaurantSlug
    ? `${getPublicMenuBaseUrl()}/menu/${encodeURIComponent(restaurantSlug)}/${table.id}`
    : '',
});

const toBackendPayload = (data: CreateTableDTO) => ({
  number: Number(data.tableNumber),
  type: data.type,
  status: toStatus(data.isActive),
  zoneId: data.zoneId,
});

const toBackendPatchPayload = (data: UpdateTableDTO) => {
  const payload: { number?: number; type?: string; status?: TableStatus; zoneId?: string | null } = {};

  if (data.tableNumber !== undefined) {
    payload.number = Number(data.tableNumber);
  }
  if (data.type !== undefined) {
    payload.type = data.type;
  }
  if (data.isActive !== undefined) {
    payload.status = toStatus(data.isActive);
  }
  if (data.zoneId !== undefined) {
    payload.zoneId = data.zoneId;
  }

  return payload;
};

export const tablesApi = {
  getAll: async (restaurantId: number, restaurantSlug?: string): Promise<Table[]> => {
    const response = await apiClient.get<BackendTable[]>(`/restaurants/${restaurantId}/dining-table`);
    return response.map((table) => toUiTable(restaurantId, table, restaurantSlug));
  },

  create: async (restaurantId: number, data: CreateTableDTO, restaurantSlug?: string): Promise<Table> => {
    const response = await apiClient.post<BackendTable | TableEnvelope>(
      `/restaurants/${restaurantId}/dining-table`,
      toBackendPayload(data),
    );
    const table = 'table' in response ? response.table : response;
    return toUiTable(restaurantId, table, restaurantSlug);
  },

  update: async (restaurantId: number, id: string, data: UpdateTableDTO, restaurantSlug?: string): Promise<Table> => {
    const response = await apiClient.patch<BackendTable | TableEnvelope>(
      `/restaurants/${restaurantId}/dining-table/${id}`,
      toBackendPatchPayload(data),
    );
    const table = 'table' in response ? response.table : response;
    return toUiTable(restaurantId, table, restaurantSlug);
  },

  delete: async (restaurantId: number, id: string): Promise<void> => {
    await apiClient.delete(`/restaurants/${restaurantId}/dining-table/${id}`);
  },

  getAllZones: async (restaurantId: number): Promise<Zone[]> => {
    return apiClient.get<Zone[]>(`/restaurants/${restaurantId}/dining-table/zones`);
  },

  createZone: async (restaurantId: number, name: string): Promise<Zone> => {
    return apiClient.post<Zone>(`/restaurants/${restaurantId}/dining-table/zones`, { name });
  },
};