'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { useInventory } from '@/features/menu-builder/hooks/inventory/useInventory';
import { useCrudModal } from '@/shared/hooks/useCrudModal';
import { inventoryItemSchema, INITIAL_INVENTORY_FORM } from '@/features/menu-builder/schemas/inventory.schema';
import { useAppActionState } from '@/shared/hooks/useAppActionState';
import toast from 'react-hot-toast';
import type { InventoryItem, InventoryUnit, UseInventoryTabReturn } from '@/features/menu-builder/types/inventory.types';
import type { InventoryFormValues } from '@/features/menu-builder/schemas/inventory.schema';

export const useInventoryTab = (): UseInventoryTabReturn => {
  const { t } = useTranslation();
  const restaurantId = useActiveRestaurantId();
  const { inventoryItems, isLoading, createItem, updateItem, deleteItem } = useInventory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const crud = useCrudModal<InventoryFormValues>({
    initialFormData: INITIAL_INVENTORY_FORM,
    createItem: (data) => createItem(data),
    updateItem: (params) => updateItem({ id: params.id, ...params.data }),
    deleteItem: (id) => deleteItem(id),
  });

  const filteredItems = useMemo(() => {
    if (!searchQuery) return inventoryItems;
    const lowerQuery = searchQuery.toLowerCase();
    return inventoryItems.filter((item: InventoryItem) =>
      item.name.toLowerCase().includes(lowerQuery)
    );
  }, [inventoryItems, searchQuery]);

  const handleStockBlur = (id: string, value: string) => {
    const qty = value === '' ? 0 : parseFloat(value);
    if (isNaN(qty)) return;

    const result = inventoryItemSchema.shape.stock.safeParse(qty);
    if (!result.success) {
      const firstErrorMessage = result.error.issues[0]?.message;
      toast.error(t(firstErrorMessage));
      return;
    }
    void updateItem({ id, stock: qty });
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
    crud.openEditModal(item.id, { name: item.name, stock: item.stock, unit: item.unit });
  };

  const openCreateModal = () => {
    setEditingItem(null);
    crud.openCreateModal();
  };

  const handleDeleteConfirm = async () => {
    if (crud.deleteId && restaurantId) {
      try {
        await crud.confirmDelete();
        toast.success(t('inventory.notifications.success'));
      } catch {
        toast.error(t('inventory.notifications.error'));
      }
    }
  };

  const [formState, formAction, isPending] = useAppActionState(
    async (formData) => {
      const name = (formData.get('name') as string).trim();
      const stockRaw = formData.get('stock');
      const stock = stockRaw ? parseFloat(stockRaw.toString()) : 0;
      const unit = (formData.get('unit') as InventoryUnit);

      const validatedData = inventoryItemSchema.parse({
        name,
        stock: isNaN(stock) ? 0 : stock,
        unit,
      });

      if (crud.editingId) {
        await updateItem({ id: crud.editingId, ...validatedData });
      } else {
        await createItem(validatedData);
      }
    },
    {
      t,
      successMessage: t('inventory.notifications.success'),
      onSuccess: () => crud.setIsModalOpen(false),
    }
  );

  return {
    t,
    searchQuery,
    setSearchQuery,
    isModalOpen: crud.isModalOpen,
    setIsModalOpen: crud.setIsModalOpen,
    editingId: crud.editingId,
    editingItem,
    deleteId: crud.deleteId,
    setDeleteId: crud.setDeleteId,
    validationErrors: formState?.errors || {},
    filteredItems,
    isLoading: isLoading || restaurantId === null || isPending || crud.isSubmitting,
    handleStockBlur,
    startEdit,
    openCreateModal,
    handleDeleteConfirm,
    formAction,
  };
};