import { apiClient } from '@/shared/api/client';
import {
  Table,
  CreateTableDTO,
  UpdateTableDTO,
  BackendTable,
  TableStatus,
} from '../types/tables.types';

type TableEnvelope = {
  table: BackendTable;
};

const toStatus = (isActive: boolean): TableStatus =>
  isActive ? 'ACTIVE' : 'INACTIVE';

const toUiTable = (restaurantId: number, table: BackendTable): Table => ({
  id: table.id,
  tableNumber: String(table.number),
  type: table.type,
  isActive: table.status === 'ACTIVE',
  // Backend does not return a QR payload yet, so we encode a stable validation URL.
  qrUrl: `${process.env.NEXT_PUBLIC_API_URL}/restaurants/${restaurantId}/tables/${table.id}/exists`,
});

const toBackendPayload = (data: CreateTableDTO) => ({
  number: Number(data.tableNumber),
  type: data.type,
  status: toStatus(data.isActive),
});

const toBackendPatchPayload = (data: UpdateTableDTO) => {
  const payload: { number?: number; type?: string; status?: TableStatus } = {};

  if (data.tableNumber !== undefined) {
    payload.number = Number(data.tableNumber);
  }
  if (data.type !== undefined) {
    payload.type = data.type;
  }
  if (data.isActive !== undefined) {
    payload.status = toStatus(data.isActive);
  }

  return payload;
};

export const tablesApi = {
  getAll: async (restaurantId: number): Promise<Table[]> => {
    const response = await apiClient.get<BackendTable[]>(
      `/restaurants/${restaurantId}/tables`,
    );
    return response.map((table) => toUiTable(restaurantId, table));
  },

  create: async (restaurantId: number, data: CreateTableDTO): Promise<Table> => {
    const response = await apiClient.post<BackendTable | TableEnvelope>(
      `/restaurants/${restaurantId}/tables`,
      toBackendPayload(data),
    );
    const table = 'table' in response ? response.table : response;
    return toUiTable(restaurantId, table);
  },

  update: async (restaurantId: number, id: string, data: UpdateTableDTO): Promise<Table> => {
    const response = await apiClient.patch<BackendTable | TableEnvelope>(
      `/restaurants/${restaurantId}/tables/${id}`,
      toBackendPatchPayload(data),
    );
    const table = 'table' in response ? response.table : response;
    return toUiTable(restaurantId, table);
  },

  delete: async (restaurantId: number, id: string): Promise<void> => {
    await apiClient.delete(`/restaurants/${restaurantId}/tables/${id}`);
  }
};