import { useState, useEffect } from 'react';
import { Dish, CreateDishDTO } from '../types/dishes.types';
import { dishesApi } from '../api/dishes.api';

export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDishes = async () => {
    setIsLoading(true);
    const data = await dishesApi.getAll();
    setDishes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const createDish = async (data: CreateDishDTO) => {
    await dishesApi.create(data);
    await fetchDishes();
  };

  const updateDish = async (id: string, data: CreateDishDTO) => {
    await dishesApi.update(id, data);
    await fetchDishes();
  };

  const deleteDish = async (id: string) => {
    await dishesApi.delete(id);
    await fetchDishes();
  };

  return {
    dishes,
    isLoading,
    createDish,
    updateDish,
    deleteDish
  };
};