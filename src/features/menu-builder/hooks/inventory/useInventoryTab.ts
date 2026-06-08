'use client';

import { useState, useMemo, useTransition, ChangeEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useInventory } from '@/features/menu-builder/hooks/inventory/useInventory';
import { inventoryItemSchema } from '@/features/menu-builder/schemas/inventory.schema';
import { ZodError } from 'zod';
import toast from 'react-hot-toast';

// Імпортуємо інтерфейси з єдиного файлу типів
import type { 
  InventoryItem, 
  InventoryFormValues, 
  ApiErrorResponse, 
  InventoryUnit, 
  UseInventoryTabReturn 
} from '@/features/menu-builder/types/inventory.types';

export const useInventoryTab = (): UseInventoryTabReturn => {
  const { t } = useTranslation();
  const { inventoryItems, isLoading, createItem, updateItem, deleteItem } = useInventory();
  
  // Безпечний селектор примітиву для Zustand стору
  const restaurantId = useRestaurantStore((state) => 
    state.activeRestaurant?.id ? Number(state.activeRestaurant.id) : null
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<InventoryFormValues>({ name: '', stock: 0, unit: 'kg' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  const filteredItems = useMemo(() => {
    if (!searchQuery) return inventoryItems;
    const lowerQuery = searchQuery.toLowerCase();
    return inventoryItems.filter((item: InventoryItem) =>
      item.name.toLowerCase().includes(lowerQuery)
    );
  }, [inventoryItems, searchQuery]);

  const handleStockBlur = (id: string, value: string) => {
    const qty = value === '' ? 0 : parseFloat(value);
    if (!isNaN(qty)) {
      updateItem({ id, stock: qty });
    }
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setValidationErrors({});
    setFormData({ name: item.name, stock: item.stock, unit: item.unit });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setValidationErrors({});
    setFormData({ name: '', stock: 0, unit: 'kg' });
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId && restaurantId) {
      startTransition(async () => {
        try {
          await deleteItem(deleteId);
          toast.success(t('common.success'));
        } catch {
          toast.error(t('auth.errors.defaultError'));
        } finally {
          setDeleteId(null);
        }
      });
    }
  };

  const handleFormAction = () => {
    setValidationErrors({});
    startTransition(async () => {
      try {
        const validatedData = inventoryItemSchema.parse({
          name: formData.name,
          stock: Number(formData.stock),
          unit: formData.unit,
        });

        const mutationOptions = {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', stock: 0, unit: 'kg' });
            toast.success(t('common.success'));
          },
          // ВИПРАВЛЕНО: Замість 'any' використовуємо строго типізований інтерфейс помилки з бекенду NestJS
          onError: (err: unknown) => {
            const errorWrapper = err as ApiErrorResponse;
            const apiError = errorWrapper?.response?.data?.message || t('auth.errors.defaultError');
            toast.error(apiError);
          },
        };

        if (editingId) {
          updateItem({ id: editingId, ...validatedData }, mutationOptions);
        } else {
          createItem(validatedData, mutationOptions);
        }
      } catch (error) {
        if (error instanceof ZodError) {
          const errorsMap: Record<string, string> = {};
          error.issues.forEach((issue) => {
            if (issue.path[0]) {
              errorsMap[issue.path[0].toString()] = t(issue.message);
            }
          });
          setValidationErrors(errorsMap);
        }
      }
    });
  };

  // ВИПРАВЛЕНО: Явно типізуємо подію і приводимо рядок до суворого літерального типу InventoryUnit
  const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, unit: e.target.value as InventoryUnit });
  };

  return {
    t,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingId,
    deleteId,
    setDeleteId,
    formData,
    setFormData,
    validationErrors,
    filteredItems,
    isLoading: isLoading || restaurantId === null,
    handleStockBlur,
    startEdit,
    openCreateModal,
    handleDeleteConfirm,
    handleFormAction,
    handleUnitChange,
  };
};