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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateItem({ id: editingId, data: formData });
      } else {
        await createItem(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('CRUD operation failed:', error);
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
        console.error('Delete operation failed:', error);
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