'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { useInventory } from '@/features/menu-builder/hooks/inventory/useInventory';
import { useCrudModal } from '@/shared/hooks/useCrudModal';
import { inventoryItemSchema, INITIAL_INVENTORY_FORM } from '@/features/menu-builder/schemas/inventory.schema';
import { useAppActionState } from '@/shared/hooks/useAppActionState';
import toast from 'react-hot-toast';
import type {
  InventoryHistoryEntry,
  InventoryItem,
  InventoryUnit,
  UseInventoryTabReturn,
} from '@/features/menu-builder/types/inventory.types';
import type { InventoryFormValues } from '@/features/menu-builder/schemas/inventory.schema';
import {
  createInventoryHistoryEntry,
  loadInventoryHistory,
  saveInventoryHistory,
  toDateTimeLocalValue,
} from './inventoryHistory';

const buildCurrentDateTime = () => toDateTimeLocalValue(new Date());

export const useInventoryTab = (): UseInventoryTabReturn => {
  const { t } = useTranslation();
  const restaurantId = useActiveRestaurantId();
  const { inventoryItems, isLoading, createItem, updateItem, deleteItem } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [auditAt, setAuditAt] = useState(buildCurrentDateTime);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [historyByItem, setHistoryByItem] = useState<Record<string, InventoryHistoryEntry[]>>({});
  const [hydratedRestaurantId, setHydratedRestaurantId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const crud = useCrudModal<InventoryFormValues>({
    initialFormData: INITIAL_INVENTORY_FORM,
    createItem: (data) => createItem(data),
    updateItem: (params) => updateItem({ id: params.id, ...params.data }),
    deleteItem: (id) => deleteItem(id),
  });

  useEffect(() => {
    setHistoryByItem(loadInventoryHistory(restaurantId));
    setHydratedRestaurantId(restaurantId);
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId === null || hydratedRestaurantId !== restaurantId) {
      return;
    }

    saveInventoryHistory(restaurantId, historyByItem);
  }, [historyByItem, restaurantId, hydratedRestaurantId]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) {
      return inventoryItems;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return inventoryItems.filter((item: InventoryItem) => item.name.toLowerCase().includes(lowerQuery));
  }, [inventoryItems, searchQuery]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedItemId(null);
      return;
    }

    const selectedExists = selectedItemId ? filteredItems.some((item) => item.id === selectedItemId) : false;
    if (!selectedExists) {
      setSelectedItemId(filteredItems[0].id);
    }
  }, [filteredItems, selectedItemId]);

  const selectedItemHistory = useMemo(() => {
    if (!selectedItemId) {
      return [];
    }

    return [...(historyByItem[selectedItemId] ?? [])];
  }, [historyByItem, selectedItemId]);

  const totalHistoryEntries = useMemo(() => {
    return Object.values(historyByItem).reduce((count, entries) => count + entries.length, 0);
  }, [historyByItem]);

  const lastAuditByItem = useMemo(() => {
    return Object.entries(historyByItem).reduce<Record<string, string>>((accumulator, [itemId, entries]) => {
      if (entries[0]?.recordedAt) {
        accumulator[itemId] = entries[0].recordedAt;
      }

      return accumulator;
    }, {});
  }, [historyByItem]);

  const lastAuditAt = useMemo(() => {
    const allEntries = Object.values(historyByItem).reduce<InventoryHistoryEntry[]>(
      (accumulator, entries) => accumulator.concat(entries),
      []
    );
    if (allEntries.length === 0) {
      return null;
    }

    return allEntries.reduce((latest, entry) => {
      if (!latest) {
        return entry;
      }

      return new Date(entry.recordedAt).getTime() > new Date(latest.recordedAt).getTime() ? entry : latest;
    }, null as InventoryHistoryEntry | null)?.recordedAt ?? null;
  }, [historyByItem]);

  const lowStockItems = useMemo(() => inventoryItems.filter((item) => item.stock <= 2).length, [inventoryItems]);

  const appendHistoryEntry = (entry: InventoryHistoryEntry) => {
    setHistoryByItem((current) => {
      const nextHistory = {
        ...current,
        [entry.itemId]: [entry, ...(current[entry.itemId] ?? [])],
      };

      return nextHistory;
    });
  };

  const handleStockBlur = async (id: string, value: string) => {
    const qty = value === '' ? 0 : parseFloat(value);
    if (Number.isNaN(qty)) {
      return;
    }

    const result = inventoryItemSchema.shape.stock.safeParse(qty);
    if (!result.success) {
      const firstErrorMessage = result.error.issues[0]?.message;
      toast.error(t(firstErrorMessage));
      return;
    }

    const currentItem = inventoryItems.find((item) => item.id === id);
    if (!currentItem || currentItem.stock === qty) {
      return;
    }

    try {
      await updateItem({ id, stock: qty });
      appendHistoryEntry(
        createInventoryHistoryEntry({
          item: currentItem,
          previousStock: currentItem.stock,
          nextStock: qty,
          action: 'adjusted',
          auditAt,
          note: t('inventory.history.adjusted'),
        })
      );
    } catch {
      toast.error(t('inventory.notifications.error'));
    }
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
    if (!crud.deleteId || restaurantId === null) {
      return;
    }

    const deletingId = crud.deleteId;
    const itemToDelete = inventoryItems.find((item) => item.id === crud.deleteId);
    try {
      if (itemToDelete) {
        await crud.confirmDelete();
        appendHistoryEntry(
          createInventoryHistoryEntry({
            item: itemToDelete,
            previousStock: itemToDelete.stock,
            nextStock: itemToDelete.stock,
            action: 'deleted',
            auditAt,
            note: t('inventory.history.deleted'),
          })
        );
      } else {
        await crud.confirmDelete();
      }
      toast.success(t('inventory.notifications.success'));

      if (selectedItemId === deletingId) {
        setSelectedItemId(null);
      }
    } catch {
      toast.error(t('inventory.notifications.error'));
    }
  };

  const [formState, formAction, isPending] = useAppActionState(
    async (formData) => {
      const name = (formData.get('name') as string).trim();
      const stockRaw = formData.get('stock');
      const stock = stockRaw ? parseFloat(stockRaw.toString()) : 0;
      const unit = formData.get('unit') as InventoryUnit;

      const validatedData = inventoryItemSchema.parse({
        name,
        stock: Number.isNaN(stock) ? 0 : stock,
        unit,
      });

      if (crud.editingId) {
        const previousItem = inventoryItems.find((item) => item.id === crud.editingId) ?? null;
        const updatedItem = await updateItem({ id: crud.editingId, ...validatedData });

        if (previousItem) {
          const hasChanged = previousItem.name !== updatedItem.name
            || previousItem.unit !== updatedItem.unit
            || previousItem.stock !== updatedItem.stock;

          if (hasChanged) {
            const action: 'updated' | 'adjusted' = previousItem.stock !== updatedItem.stock ? 'adjusted' : 'updated';
            appendHistoryEntry(
              createInventoryHistoryEntry({
                item: updatedItem,
                previousStock: previousItem.stock,
                nextStock: updatedItem.stock,
                action,
                auditAt,
                note: t(`inventory.history.${action}`),
              })
            );
          }
        }
      } else {
        const createdItem = await createItem(validatedData);
        appendHistoryEntry(
          createInventoryHistoryEntry({
            item: createdItem,
            previousStock: 0,
            nextStock: createdItem.stock,
            action: 'created',
            auditAt,
            note: t('inventory.history.created'),
          })
        );
        setSelectedItemId(createdItem.id);
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
    auditAt,
    setAuditAt,
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
    selectedItemId,
    setSelectedItemId,
    selectedItemHistory,
    totalItems: inventoryItems.length,
    totalHistoryEntries,
    lastAuditAt,
    lowStockItems,
    lastAuditByItem,
  };
};