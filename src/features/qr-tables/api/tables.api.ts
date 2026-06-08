import { apiClient } from '@/shared/api/client';
import {
  Table,
  CreateTableDTO,
  UpdateTableDTO,
  BackendTable,
  TableStatus,
} from '@/features/qr-tables/types/tables.types';

type TableEnvelope = {
  table: BackendTable;
};

const toStatus = (isActive: boolean): TableStatus =>
  isActive ? 'ACTIVE' : 'INACTIVE';

const getPublicMenuBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
  }
  return 'http://localhost:3000';
};

const toUiTable = (
  restaurantId: number,
  table: BackendTable,
  restaurantSlug?: string,
): Table => {
  void restaurantId;
  const baseUrl = getPublicMenuBaseUrl();
  return {
    id: table.id,
    tableNumber: String(table.number),
    type: table.type,
    isActive: table.status === 'ACTIVE',
    qrUrl: restaurantSlug
      ? `${baseUrl}/menu/${encodeURIComponent(restaurantSlug)}/${table.id}`
      : '',
  };
};

const toBackendPayload = (data: CreateTableDTO) => ({
  number: Number(data.tableNumber),
  type: data.type.trim(),
  status: toStatus(data.isActive),
});

const toBackendPatchPayload = (data: UpdateTableDTO) => {
  const payload: {
    number?: number;
    type?: string;
    status?: TableStatus;
  } = {};

  if (data.tableNumber !== undefined) {
    payload.number = Number(data.tableNumber);
  }
  if (data.type !== undefined) {
    payload.type = data.type.trim();
  }
  if (data.isActive !== undefined) {
    payload.status = toStatus(data.isActive);
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
};