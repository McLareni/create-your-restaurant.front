import { Dish, CreateDishDTO, UpdateDishDTO } from '../types/dishes.types';

let mockDishes: Dish[] = [
  {
    id: '1',
    name: 'Піца Маргарита',
    description: 'Класична італійська піца з беконом, пармезаном та вершковим соусом.',
    price: 250,
    weight: '450 г',
    cookingTime: '15',
    calories: '850',
    isVegan: false,
    isSpicy: false,
    isLactoseFree: false,
    badge: 'HIT',
    allergens: ['gluten', 'lactose'],
    isAvailable: true,
    stockQuantity: null,
    productionZone: 'HOT_KITCHEN'
  }
];

export const dishesApi = {
  getAll: async (): Promise<Dish[]> => {
    return [...mockDishes];
  },

  create: async (data: CreateDishDTO): Promise<Dish> => {
    const newDish: Dish = {
      id: Date.now().toString(),
      ...data,
    };
    mockDishes.push(newDish);
    return newDish;
  },

  update: async (id: string, data: UpdateDishDTO): Promise<Dish> => {
    const index = mockDishes.findIndex(d => d.id === id);
    if (index !== -1) {
      mockDishes[index] = { ...mockDishes[index], ...data };
    }
    return mockDishes[index];
  },

  delete: async (id: string): Promise<void> => {
    mockDishes = mockDishes.filter(d => d.id !== id);
  },

  bulkUpdatePrices: async (updates: { id: string; price: number }[]): Promise<void> => {
    updates.forEach(update => {
      const index = mockDishes.findIndex(d => d.id === update.id);
      if (index !== -1) {
        mockDishes[index].price = update.price;
      }
    });
  }
};