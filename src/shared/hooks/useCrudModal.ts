import { useState } from 'react';

interface UseCrudModalProps<T, F> {
  initialFormData: F;
  createItem: (data: F) => void;
  updateItem: (params: { id: string; data: any }) => void;
  deleteItem: (id: string) => void;
}

export const useCrudModal = <T extends { id: string }, F>({
  initialFormData,
  createItem,
  updateItem,
  deleteItem,
}: UseCrudModalProps<T, F>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<F>(initialFormData);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (item: T, formDataMapper: (item: T) => F) => {
    setEditingItem(item);
    setFormData(formDataMapper(item));
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      updateItem({ id: editingItem.id, data: formData });
    } else {
      createItem(formData);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteItem(deleteId);
      setDeleteId(null);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    editingItem,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    handleSave,
    confirmDelete,
  };
};