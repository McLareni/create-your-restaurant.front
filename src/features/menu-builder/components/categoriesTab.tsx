'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Modal, ConfirmModal, EmptyState } from '@/shared/ui';
import { FolderTree, Plus } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CategoryItem } from './categoryItem';
import { useCategories } from '../hooks/useCategories';
import { Category } from '../types/categories.types';
import { useCrudModal } from '@/shared/hooks/useCrudModal';

export const CategoriesTab = () => {
  const { t } = useTranslation();
  const { categories, createCategory, updateCategory, deleteCategory, handleDragEnd } = useCategories();

  const {
    isModalOpen,
    setIsModalOpen,
    editingItem: editingCategory,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    openCreateModal,
    openEditModal,
    handleSave,
    confirmDelete,
  } = useCrudModal<Category, { name: string }>({
    initialFormData: { name: '' },
    createItem: createCategory,
    updateItem: updateCategory,
    deleteItem: deleteCategory,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onSave = () => {
    if (!formData.name.trim()) return;
    handleSave();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20">
        <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">{t('menu.constructor.categories.title')}</h2>
        <Button variant="brand" icon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>
          {t('menu.constructor.categories.addBtn')}
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={<FolderTree />}
          title={t('menu.constructor.categories.emptyTitle')}
          description={t('menu.constructor.categories.emptyDesc')}
          actionLabel={t('menu.constructor.categories.addBtn')}
          onAction={openCreateModal}
        />
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categories} strategy={verticalListSortingStrategy}>
              <div className="group">
                {categories.map((cat) => (
                  <CategoryItem 
                    key={cat.id} 
                    category={cat} 
                    onEdit={(item) => openEditModal(item, (i) => ({ name: i.name }))} 
                    onDelete={setDeleteId} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? t('menu.constructor.categories.modal.editTitle') : t('menu.constructor.categories.modal.createTitle')}>
        <div className="flex flex-col gap-6">
          <Input id="catName" label={t('menu.constructor.categories.modal.nameLabel')} placeholder={t('menu.constructor.categories.modal.namePlaceholder')} value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} autoFocus />
          <div className="flex justify-end gap-3 pt-2 border-t border-brand-gray/10 dark:border-brand-gray/20 mt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t('menu.constructor.categories.modal.cancel')}</Button>
            <Button variant="brand" onClick={onSave} disabled={!formData.name.trim()}>{t('menu.constructor.categories.modal.save')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} description={t('menu.constructor.categories.deleteConfirm')} />
    </div>
  );
};