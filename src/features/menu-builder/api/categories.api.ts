import { Category, CreateCategoryDTO } from '../types/categories.types';

let mockCategories: Category[] = [
  { id: '1', name: 'Гарячі закуски', sortOrder: 0 },
  { id: '2', name: 'Салати', sortOrder: 1 },
  { id: '3', name: 'Піца', sortOrder: 2 },
];

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const newCat: Category = {
      id: Date.now().toString(),
      name: data.name,
      sortOrder: mockCategories.length,
    };
    mockCategories.push(newCat);
    return newCat;
  },

  update: async (id: string, data: CreateCategoryDTO): Promise<Category> => {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCategories[index] = { ...mockCategories[index], ...data };
    }
    return mockCategories[index];
  },

  delete: async (id: string): Promise<void> => {
    mockCategories = mockCategories.filter(c => c.id !== id);
  },

  reorder: async (items: Category[]): Promise<void> => {
    mockCategories = items;
  }
};