import { Table, CreateTableDTO, UpdateTableDTO } from '../types/tables.types';
import { nanoid } from 'nanoid';

let mockTables: Table[] = [
  { id: '1', tableNumber: '1', type: 'Основний зал', isActive: true, qrUrl: 'https://mock.gastro.com/table/1' },
  { id: '2', tableNumber: '2', type: 'Основний зал', isActive: true, qrUrl: 'https://mock.gastro.com/table/2' },
  { id: '3', tableNumber: 'Бар 1', type: 'Бар', isActive: false, qrUrl: 'https://mock.gastro.com/table/3' },
];

export const tablesApi = {
  getAll: async (): Promise<Table[]> => {
    return [...mockTables];
  },

  create: async (data: CreateTableDTO, restaurantSlug: string): Promise<Table> => {
    const id = nanoid(10);
    const newTable: Table = {
      id,
      ...data,
      qrUrl: `https://${restaurantSlug}.gastro.com/table/${id}`,
    };
    mockTables.push(newTable);
    return newTable;
  },

  update: async (id: string, data: UpdateTableDTO): Promise<Table> => {
    const index = mockTables.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTables[index] = { ...mockTables[index], ...data };
    }
    return mockTables[index];
  },

  delete: async (id: string): Promise<void> => {
    mockTables = mockTables.filter(t => t.id !== id);
  }
};