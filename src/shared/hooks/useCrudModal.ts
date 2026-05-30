import { useState } from 'react';

interface UseCrudModalProps<T, F> {
  initialFormData: F;
  createItem: (data: F) => Promise<any> | void;
  updateItem: (params: { id: string; data: any }) => Promise<any> | void;
  deleteItem: (id: string) => Promise<any> | void;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateItem({ id: editingItem.id, data: formData });
      } else {
        await createItem(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      // Помилка прокидається в компонент для локального відображення або обробляється в react-hot-toast всередині мутації
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
    editingItem,
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