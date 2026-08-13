import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { useAvailableDishesList } from '@/features/menu-builder/hooks/dishes/useDishesQueries';
import { useCrudModal } from '@/shared/hooks/useCrudModal';
import { createComboSchema } from '@/features/menu-builder/schemas/combos.schema';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import { combosApi } from '@/features/menu-builder/api/combos.api';
import { useAppActionState } from '@/shared/hooks/useAppActionState';
import type { Combo, ComboDishSelect, CreateComboDTO, ComboPriceType, ComboFormState, UseCombosManagementReturn } from '@/features/menu-builder/types/combos.types';
import type { Dish } from '@/features/menu-builder/types/dishes.types';

const INITIAL_COMBO_FORM: ComboFormState = { name: '', priceType: 'FIXED', priceValue: 0 };

export const useCombosManagement = (): UseCombosManagementReturn => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useActiveRestaurantId();
  const [selectedDishes, setSelectedDishes] = useState<ComboDishSelect[]>([]);
  const [priceType, setPriceType] = useState<ComboPriceType>('FIXED');
  const [modalSessionKey, setModalSessionKey] = useState<string>('session-init');

  const { data: combos = [], isLoading: isCombosLoading } = useQuery<Combo[]>({
    queryKey: QUERY_KEYS.combos(restaurantId),
    queryFn: () => combosApi.getAll(),
    enabled: !!restaurantId,
  });

  const { dishes: availableDishes, isLoading: isDishesLoading } = useAvailableDishesList();

  const createComboMutation = useMutation({
    mutationFn: (data: CreateComboDTO) => combosApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.combos(restaurantId) });
      toast.success(t('menu.constructor.combos.notifications.createSuccess'));
    },
  });

  const updateComboMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateComboDTO }) => combosApi.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.combos(restaurantId) });
      toast.success(t('menu.constructor.combos.notifications.updateSuccess'));
    },
  });

  const deleteComboMutation = useMutation({
    mutationFn: (id: string) => combosApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.combos(restaurantId) });
      toast.success(t('menu.constructor.combos.notifications.deleteSuccess'));
    },
  });

  const crud = useCrudModal<ComboFormState>({
    initialFormData: INITIAL_COMBO_FORM,
    createItem: () => {},
    updateItem: () => {},
    deleteItem: async (id) => {
      await deleteComboMutation.mutateAsync(id);
    },
  });

  const openCreateModal = () => {
    setSelectedDishes([]);
    setPriceType('FIXED');
    setModalSessionKey(`combo-new-${Date.now()}`);
    crud.openCreateModal();
  };

  const openEditModal = (combo: Combo) => {
    const initialDishes: ComboDishSelect[] = combo.dishes.map((d) => {
      const found = availableDishes.find((dish) => dish.id === d.dishId);
      return { id: d.dishId, name: found?.name || '', price: found?.price || 0 };
    });
    setSelectedDishes(initialDishes);
    setPriceType(combo.priceType);
    setModalSessionKey(`combo-edit-${combo.id}-${Date.now()}`);
    crud.openEditModal(combo.id, { name: combo.name, priceType: combo.priceType, priceValue: combo.priceValue });
  };

  const toggleDishSelection = (dish: Dish) => {
    setSelectedDishes((prev) => {
      const exists = prev.some((d) => d.id === dish.id);
      if (exists) return prev.filter((d) => d.id !== dish.id);
      return [...prev, { id: dish.id, name: dish.name, price: dish.price }];
    });
  };

  const removeDishFromCombo = (dishId: string) => {
    setSelectedDishes((prev) => prev.filter((d) => d.id !== dishId));
  };

  const [formState, formAction, isPending] = useAppActionState(
    async (formData) => {
      const name = (formData.get('name') as string).trim();
      const currentPriceType = (formData.get('priceType') as ComboPriceType);
      const priceValueRaw = formData.get('priceValue');
      const priceValue = priceValueRaw ? parseFloat(priceValueRaw.toString()) : 0;
      const selectedDishesJson = formData.get('selectedDishesData') as string;
      const parsedDishes = selectedDishesJson ? JSON.parse(selectedDishesJson) : [];

      const rawPayload = {
        name,
        priceType: currentPriceType,
        priceValue: isNaN(priceValue) ? 0 : priceValue,
        dishes: parsedDishes.map((d: ComboDishSelect) => ({ id: d.id })),
      };

      const validatedPayload = createComboSchema.parse(rawPayload);

      if (crud.editingId) {
        await updateComboMutation.mutateAsync({ id: crud.editingId, data: validatedPayload as CreateComboDTO });
      } else {
        await createComboMutation.mutateAsync(validatedPayload as CreateComboDTO);
      }
    },
    {
      t,
      onSuccess: () => crud.setIsModalOpen(false),
    }
  );

  const isMutationPending = isCombosLoading || isDishesLoading || deleteComboMutation.isPending || isPending;

  return {
    t,
    combos,
    allDishes: availableDishes,
    isDishesLoading,
    isLoading: isMutationPending || restaurantId === null,
    isSubmitting: isMutationPending,
    isModalOpen: crud.isModalOpen,
    setIsModalOpen: crud.setIsModalOpen,
    deleteId: crud.deleteId,
    setDeleteId: crud.setDeleteId,
    priceType,
    setPriceType,
    selectedDishes,
    errors: formState?.errors || {},
    openCreateModal,
    openEditModal,
    toggleDishSelection,
    removeDishFromCombo,
    handleConfirmDelete: async () => {
      await crud.confirmDelete();
    },
    formAction,
    editingCombo: combos.find((c) => c.id === crud.editingId) || null,
    modalSessionKey,
  };
};