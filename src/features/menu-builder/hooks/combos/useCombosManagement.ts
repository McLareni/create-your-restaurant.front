'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAvailableDishesList } from '../dishes/useDishesQueries';
import { combosApi } from '../../api/combos.api';
import { createComboSchema } from '../../schemas/combos.schema';
import { Combo, CreateComboDTO } from '../../types/combos.types';
import toast from 'react-hot-toast';

export const useCombosManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

  const { dishes: availableDishes, isLoading: isDishesLoading } = useAvailableDishesList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [priceType, setPriceType] = useState<'FIXED' | 'DISCOUNT'>('FIXED');
  const [priceValue, setPriceValue] = useState(0);
  const [selectedDishes, setSelectedDishes] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: combos = [], isLoading: isCombosLoading } = useQuery<Combo[]>({
    queryKey: ['combos', restaurantId],
    queryFn: () => combosApi.getAll(restaurantId!),
    enabled: !!restaurantId,
  });

  const createComboMutation = useMutation({
    mutationFn: (data: CreateComboDTO) => combosApi.create(restaurantId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] });
      setIsModalOpen(false);
      toast.success(t('menu.constructor.combos.notifications.createSuccess'));
    },
    onError: () => toast.error(t('menu.constructor.combos.notifications.createError')),
  });

  const updateComboMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateComboDTO }) => 
      combosApi.update(restaurantId!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] });
      setIsModalOpen(false);
      toast.success(t('menu.constructor.combos.notifications.updateSuccess'));
    },
    onError: () => toast.error(t('menu.constructor.combos.notifications.updateError')),
  });

  const deleteComboMutation = useMutation({
    mutationFn: (id: string) => combosApi.delete(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos', restaurantId] });
      setDeleteId(null);
      toast.success(t('menu.constructor.combos.notifications.deleteSuccess'));
    },
    onError: () => toast.error(t('menu.constructor.combos.notifications.deleteError')),
  });

  const openCreateModal = () => {
    setEditingCombo(null);
    setErrors({});
    setName('');
    setPriceType('FIXED');
    setPriceValue(0);
    setSelectedDishes([]);
    setIsModalOpen(true);
  };

  const openEditModal = (combo: Combo) => {
    setEditingCombo(combo);
    setErrors({});
    setName(combo.name);
    setPriceType(combo.priceType);
    setPriceValue(combo.priceValue);
    setSelectedDishes(combo.dishes.map(d => ({ id: d.id, name: d.name, price: d.price })));
    setIsModalOpen(true);
  };

  const handleAddDish = (dishId: string) => {
    if (!dishId) return;
    const targetDish = availableDishes.find((d: any) => d.id === dishId);
    if (!targetDish) return;
    if (selectedDishes.some((d: any) => d.id === dishId)) return;

    setSelectedDishes(prev => [...prev, { id: targetDish.id, name: targetDish.name, price: targetDish.price }]);
  };

  const handleToggleDish = (dish: any, checked: boolean) => {
    if (!checked) {
      setSelectedDishes(prev => prev.filter(d => d.id !== dish.id));
    }
  };

  const handleSave = async () => {
    const payload: CreateComboDTO = { 
      name: name.trim(), 
      priceType, 
      priceValue: Number(priceValue), 
      dishes: selectedDishes 
    };
    
    const result = createComboSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = t(issue.message);
      });
      setErrors(fieldErrors);
      toast.error(t('errors.formValidation'));
      return;
    }

    setErrors({});
    if (editingCombo) {
      updateComboMutation.mutate({ id: editingCombo.id, data: result.data });
    } else {
      createComboMutation.mutate(result.data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteComboMutation.mutateAsync(deleteId);
    }
  };

  const isMutationPending = createComboMutation.isPending || updateComboMutation.isPending || deleteComboMutation.isPending;

  return {
    t,
    combos,
    allDishes: availableDishes,
    isDishesLoading,
    isLoading: isCombosLoading || isMutationPending || restaurantId === null,
    isSubmitting: isMutationPending,
    isModalOpen,
    setIsModalOpen,
    deleteId,
    setDeleteId,
    name,
    setName,
    priceType,
    setPriceType,
    priceValue,
    setPriceValue,
    selectedDishes,
    errors,
    openCreateModal,
    openEditModal,
    handleAddDish,
    handleToggleDish,
    handleSave,
    handleDeleteConfirm,
  };
};