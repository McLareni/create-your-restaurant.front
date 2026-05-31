'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { useCombos } from './useCombos';
import { useCrudModal } from '@/shared/hooks/useCrudModal';
import { CreateComboDTO, Combo } from '../../types/combos.types';
import { INITIAL_COMBO_FORM } from '../../schemas/combos.schema';

export const useCombosTab = () => {
  const { t } = useTranslation();
  const { combos, isLoading, createCombo, updateCombo, deleteCombo } = useCombos();

  const crud = useCrudModal<Combo, CreateComboDTO>({
    initialFormData: INITIAL_COMBO_FORM,
    createItem: createCombo,
    updateItem: ({ id, data }) => updateCombo({ id, data }),
    deleteItem: deleteCombo,
  });

  return {
    t,
    combos,
    isLoading,
    isModalOpen: crud.isModalOpen,
    setIsModalOpen: crud.setIsModalOpen,
    formData: crud.formData,
    deleteId: crud.deleteId,
    setDeleteId: crud.setDeleteId,
    openCreateModal: crud.openCreateModal,
    openEditModal: (combo: Combo) => crud.openEditModal(combo, (item) => ({
      name: item.name,
      priceType: item.priceType,
      priceValue: item.priceValue,
      dishes: item.dishes,
    })),
    handleSave: crud.handleSave,
    handleDeleteConfirm: crud.confirmDelete,
  };
};