import { ModifierGroup, CreateModifierDTO, UpdateModifierDTO } from '../types/modifiers.types';

let mockModifiers: ModifierGroup[] = [
  {
    id: '1',
    name: 'Оберіть розмір піци',
    type: 'GROUP',
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: 'o1', name: 'Мала 30см', price: 0 },
      { id: 'o2', name: 'Велика 40см', price: 50 }
    ]
  },
  {
    id: '2',
    name: 'Без цибулі',
    type: 'SINGLE',
    minSelect: 0,
    maxSelect: 1,
    options: [
      { id: 'o3', name: 'Без цибулі', price: 0 }
    ]
  }
];

export const modifiersApi = {
  getAll: async (): Promise<ModifierGroup[]> => {
    return [...mockModifiers];
  },

  create: async (data: CreateModifierDTO): Promise<ModifierGroup> => {
    const newMod: ModifierGroup = { id: Date.now().toString(), ...data };
    mockModifiers.push(newMod);
    return newMod;
  },

  update: async (id: string, data: UpdateModifierDTO): Promise<ModifierGroup> => {
    const index = mockModifiers.findIndex(m => m.id === id);
    if (index !== -1) mockModifiers[index] = { ...mockModifiers[index], ...data };
    return mockModifiers[index];
  },

  delete: async (id: string): Promise<void> => {
    mockModifiers = mockModifiers.filter(m => m.id !== id);
  }
};