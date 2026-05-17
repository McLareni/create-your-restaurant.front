import { useState, useEffect } from 'react';
import { ModifierGroup, CreateModifierDTO } from '../types/modifiers.types';
import { modifiersApi } from '../api/modifiers.api';

export const useModifiers = () => {
  const [modifiers, setModifiers] = useState<ModifierGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchModifiers = async () => {
    setIsLoading(true);
    const data = await modifiersApi.getAll();
    setModifiers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchModifiers();
  }, []);

  const createModifier = async (data: CreateModifierDTO) => {
    await modifiersApi.create(data);
    await fetchModifiers();
  };

  const updateModifier = async (id: string, data: CreateModifierDTO) => {
    await modifiersApi.update(id, data);
    await fetchModifiers();
  };

  const deleteModifier = async (id: string) => {
    await modifiersApi.delete(id);
    await fetchModifiers();
  };

  return { modifiers, isLoading, createModifier, updateModifier, deleteModifier };
};