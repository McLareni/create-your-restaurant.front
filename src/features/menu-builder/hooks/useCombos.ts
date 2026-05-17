import { useState, useEffect } from 'react';
import { Combo, CreateComboDTO } from '../types/combos.types';
import { combosApi } from '../api/combos.api';

export const useCombos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCombos = async () => {
    setIsLoading(true);
    const data = await combosApi.getAll();
    setCombos(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchCombos(); }, []);

  const createCombo = async (data: CreateComboDTO) => {
    await combosApi.create(data);
    await fetchCombos();
  };

  const updateCombo = async (id: string, data: CreateComboDTO) => {
    await combosApi.update(id, data);
    await fetchCombos();
  };

  const deleteCombo = async (id: string) => {
    await combosApi.delete(id);
    await fetchCombos();
  };

  return { combos, isLoading, createCombo, updateCombo, deleteCombo };
};