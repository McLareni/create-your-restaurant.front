import { useState, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Category } from '../types/categories.types';
import { categoriesApi } from '../api/categories.api';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    const data = await categoriesApi.getAll();
    setCategories(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (name: string) => {
    await categoriesApi.create({ name });
    await fetchCategories();
  };

  const updateCategory = async (id: string, name: string) => {
    await categoriesApi.update(id, { name });
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    await categoriesApi.delete(id);
    await fetchCategories();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((item) => item.id === active.id);
      const newIndex = categories.findIndex((item) => item.id === over.id);
      
      const newArray = arrayMove(categories, oldIndex, newIndex).map(
        (item, index) => ({ ...item, sortOrder: index })
      );
      
      setCategories(newArray);
      await categoriesApi.reorder(newArray);
    }
  };

  return {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    handleDragEnd
  };
};