'use client';

import { useState } from 'react';

interface UseCrudModalProps<F> {
  initialFormData: F;
  createItem: (data: F) => Promise<unknown> | void;
  updateItem: (params: { id: string; data: F }) => Promise<unknown> | void;
  deleteItem: (id: string) => Promise<unknown> | void;
}

export const useCrudModal = <F>({
  initialFormData,
  createItem,
  updateItem,
  deleteItem,
}: UseCrudModalProps<F>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<F>(initialFormData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (id: string, currentData: F) => {
    setEditingId(id);
    setFormData(currentData);
    setIsModalOpen(true);
  };

  const handleSave = async (directData?: F) => {
    setIsSubmitting(true);
    try {
      const dataToSave = directData !== undefined ? directData : formData;
      if (editingId) {
        await updateItem({ id: editingId, data: dataToSave });
      } else {
        await createItem(dataToSave);
      }
      setIsModalOpen(false);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteItem(deleteId);
        setDeleteId(null);
      } catch (error) {
        throw error;
      }
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    isSubmitting,
    openCreateModal,
    openEditModal,
    handleSave,
    confirmDelete,
  };
};