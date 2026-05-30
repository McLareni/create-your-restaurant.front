import { useState } from 'react';

export const useCategoryModal = (createCategory: any, updateCategory: any) => {
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catName, setCatName] = useState('');

  const handleOpenCategoryModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setCatName(category.name);
    } else {
      setEditingCategory(null);
      setCatName('');
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!catName.trim()) return;
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, name: catName });
    } else {
      createCategory(catName);
    }
    setIsCatModalOpen(false);
  };

  return {
    isCatModalOpen,
    setIsCatModalOpen,
    editingCategory,
    catName,
    setCatName,
    handleOpenCategoryModal,
    handleSaveCategory,
  };
};