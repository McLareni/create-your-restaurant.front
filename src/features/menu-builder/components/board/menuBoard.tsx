'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, ConfirmModal } from '@/shared/ui';
import { Plus, LayoutList } from 'lucide-react';
import { DndContext, pointerWithin, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCategory } from './sortableCategory';
import { CategoryModal } from './categoryModal';
import { DishModal } from './dishModal';
import { DishCard } from './dishCard';
import { useMenuBoard } from '../../hooks/useMenuBoard';
import { Dish } from '../../types/dishes.types';

export const MenuBoard = () => {
  const { t } = useTranslation();
  const board = useMenuBoard();

  if (board.isMenuLoading || board.isModifiersLoading) {
    return (
      <div className="flex flex-col gap-3 py-1 w-full">
        <div className="h-12 w-full rounded-lg bg-brand-gray/10 animate-pulse"></div>
        <div className="h-36 w-full rounded-lg bg-brand-gray/5 animate-pulse mt-2"></div>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={board.sensors} 
      collisionDetection={pointerWithin} 
      onDragStart={board.handleDragStart} 
      onDragOver={board.handleDragOver} 
      onDragEnd={board.handleDragEnd}
    >
      <div className="relative min-h-100 pb-6 flex flex-col w-full px-0">
        <div className="sticky top-0 z-30 flex items-center justify-between mb-4 bg-brand-cream/70 dark:bg-brand-mocha/70 backdrop-blur-md py-2.5 border-b border-brand-gray/10 -mx-6 px-6">
          <div>
            <h2 className="text-base font-bold text-brand-espresso dark:text-brand-cream tracking-tight flex items-center gap-2">
              {t('menu.constructor.categories.title')}
            </h2>
          </div>
          <Button variant="brand" onClick={() => board.handleOpenCategoryModal()} className="h-9 px-4 rounded-md text-xs font-medium shadow-xs" icon={<Plus className="h-3.5 w-3.5" />}>
            {t('menu.constructor.categories.addBtn')}
          </Button>
        </div>

        {board.categories.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 mt-4 rounded-2xl border border-dashed border-brand-gray/20 bg-white/40 dark:bg-brand-mocha/10 text-center">
            <div className="h-14 w-14 bg-brand-cream dark:bg-brand-gray/10 rounded-full flex items-center justify-center mb-4">
              <LayoutList className="h-6 w-6 text-brand-copper" />
            </div>
            <h3 className="text-lg font-bold text-brand-espresso dark:text-brand-cream mb-1">{t('menu.constructor.categories.emptyTitle')}</h3>
            <p className="text-xs text-brand-gray max-w-sm mb-5">{t('menu.constructor.categories.emptyDesc')}</p>
            <Button variant="brand" onClick={() => board.handleOpenCategoryModal()} className="h-10 px-6 text-xs font-semibold shadow-md" icon={<Plus className="h-4 w-4" />}>
              {t('menu.constructor.categories.addBtn')}
            </Button>
          </div>
        ) : (
          <SortableContext items={board.categories.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4 w-full">
              {board.categories.map((category: any) => (
                <SortableCategory
                  key={category.id} 
                  category={category} 
                  categoryDishes={category.dishes || []}
                  onEditCategory={board.handleOpenCategoryModal} 
                  onDeleteCategory={board.setDeleteTarget}
                  onAddDish={board.handleOpenDishModal} 
                  onEditDish={board.handleOpenDishModal}
                  onDeleteDish={board.setDeleteTarget} 
                  t={t}
                />
              ))}
            </div>
          </SortableContext>
        )}

        <DragOverlay adjustScale={true}>
          {board.activeId && board.activeType === 'Dish' && board.activeDishData ? (
            <div className="opacity-90 scale-[1.02] -rotate-1 cursor-grabbing shadow-2xl w-[230px] pointer-events-none block z-50">
              <DishCard dish={board.activeDishData as Dish} categoryId="" onEdit={() => {}} onDelete={() => {}} isOverlay={true} />
            </div>
          ) : null}
        </DragOverlay>

        <CategoryModal isOpen={board.isCatModalOpen} onClose={() => board.setIsCatModalOpen(false)} isEditing={!!board.editingCategory} catName={board.catName} setCatName={board.setCatName} onSave={board.handleSaveCategory} isLoading={board.isMenuLoading} />
        
        <DishModal 
          isOpen={board.isDishModalOpen} 
          onClose={() => board.setIsDishModalOpen(false)} 
          isEditing={!!board.editingDish} 
          dishForm={board.dishForm} 
          setDishForm={board.setDishForm} 
          onSave={board.handleSaveDish} 
          handleImageUpload={board.handleImageUpload} 
          modifierGroups={board.modifierGroups} 
          currentDishId={board.editingDish?.id}
          errors={board.formErrors}
          isLoading={board.isMenuLoading}
        />
        <ConfirmModal isOpen={!!board.deleteTarget} onClose={() => board.setDeleteTarget(null)} onConfirm={board.handleConfirmDelete} description={board.deleteTarget?.type === 'category' ? t('menu.constructor.categories.deleteConfirm') : t('menu.constructor.dishes.deleteConfirm')} />
      </div>
    </DndContext>
  );
};