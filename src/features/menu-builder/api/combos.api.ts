import { Combo, CreateComboDTO, UpdateComboDTO, ComboDish } from '../types/combos.types';

let mockCombos: Combo[] = [
  {
    id: '1',
    name: 'Бургер Меню Велике',
    priceType: 'FIXED',
    priceValue: 250,
    dishes: [
      { id: 'd1', name: 'Бургер Класик', price: 180 },
      { id: 'd2', name: 'Картопля Фрі', price: 60 }
    ]
  }
];

export const mockAvailableDishes: ComboDish[] = [
  { id: 'd1', name: 'Бургер Класик', price: 180 },
  { id: 'd2', name: 'Картопля Фрі', price: 60 },
  { id: 'd3', name: 'Кока-Кола', price: 45 },
  { id: 'd4', name: 'Піца Маргарита', price: 250 },
];

export const combosApi = {
  getAll: async (): Promise<Combo[]> => [...mockCombos],
  
  create: async (data: CreateComboDTO): Promise<Combo> => {
    const newCombo: Combo = { id: Date.now().toString(), ...data };
    mockCombos.push(newCombo);
    return newCombo;
  },

  update: async (id: string, data: UpdateComboDTO): Promise<Combo> => {
    const index = mockCombos.findIndex(c => c.id === id);
    if (index !== -1) mockCombos[index] = { ...mockCombos[index], ...data };
    return mockCombos[index];
  },

  delete: async (id: string): Promise<void> => {
    mockCombos = mockCombos.filter(c => c.id !== id);
  }
};