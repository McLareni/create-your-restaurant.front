'use client';

import { useState, useMemo, FormEvent } from 'react';
import { useInventory } from './useInventory';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { InventoryItem } from '../../types/inventory.types';
import { inventoryItemSchema, InventoryFormValues, INITIAL_INVENTORY_FORM } from '../../schemas/inventory.schema';
import { ZodError } from 'zod';

export const useInventoryTab = () => {
  const { t } = useTranslation();
  const { inventoryItems, isLoading, createItem, updateItem, deleteItem } = useInventory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<InventoryFormValues>(INITIAL_INVENTORY_FORM);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
    setFormData(INITIAL_INVENTORY_FORM);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await deleteItem(deleteId);
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      const validatedData = inventoryItemSchema.parse({
        name: formData.name,
        stock: Number(formData.stock),
        unit: formData.unit,
      });

      if (editingId) {
        updateItem({ id: editingId, ...validatedData });
      } else {
        createItem(validatedData);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(INITIAL_INVENTORY_FORM);
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
    isLoading,
    handleStockBlur,
    startEdit,
    openCreateModal,
    handleDeleteConfirm,
    handleFormSubmit,
  };
};