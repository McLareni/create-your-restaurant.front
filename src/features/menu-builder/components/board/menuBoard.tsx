'use client';

import React from 'react';
import { ConfirmModal } from '@/shared/ui';
import { Plus, LayoutList } from 'lucide-react';
import { DndContext, pointerWithin, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCategory } from '@/features/menu-builder/components/board/sortableCategory';
import { CategoryModal } from '@/features/menu-builder/components/board/categoryModal';
import { DishModal } from '@/features/menu-builder/components/board/dishModal';
import { DishCard } from '@/features/menu-builder/components/board/dishCard';
import { useMenuBoard } from '@/features/menu-builder/hooks/board/useMenuBoard';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { FullCategory } from '@/features/menu-builder/types/menu-board.types';

export const MenuBoard = () => {
  const board = useMenuBoard();

  if (board.isLoading) {
    return (
      <div className="flex flex-col gap-4 py-2 w-full animate-pulse">
        <div className="h-16 w-full rounded-xl bg-bg-element/50 border border-neutral-200 dark:border-neutral-800" />
        <div className="h-48 w-full rounded-xl bg-bg-element/30 border border-neutral-200/40 dark:border-neutral-800/40 mt-4" />
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
      <div className="relative min-h-[400px] pb-6 flex flex-col w-full px-0 select-none text-text-main overflow-hidden">
        <div className="sticky top-0 z-30 flex items-center justify-between mb-4 bg-bg-surface/80 backdrop-blur-md py-3 border-b border-neutral-200 dark:border-neutral-800 -mx-6 px-6">
          <div>
            <h2 className="text-xl font-bold text-text-main tracking-tight flex items-center gap-2">
              {board.t('menu.constructor.categories.title')}
            </h2>
          </div>
          <button 
            type="button"
            onClick={() => board.categoryModal.handleOpenCategoryModal(undefined)} 
            className="h-10 px-4 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-brand-emerald/10 cursor-pointer select-none transition-all outline-none"
          >
            <Plus className="h-4 w-4" />
            {board.t('menu.constructor.categories.addBtn')}
          </button>
        </div>

        {board.categories.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 mt-4 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-bg-element/10 text-center shadow-3xs animate-in fade-in duration-200">
            <div className="h-14 w-14 bg-brand-emerald/10 rounded-full flex items-center justify-center mb-4">
              <LayoutList className="h-6 w-6 text-brand-emerald" />
            </div>
            <h3 className="text-lg font-bold text-text-main mb-1">
              {board.t('menu.constructor.categories.emptyTitle')}
            </h3>
            <p className="text-xs text-text-muted max-w-sm mb-5">
              {board.t('menu.constructor.categories.emptyDesc')}
            </p>
            <button 
              type="button"
              onClick={() => board.categoryModal.handleOpenCategoryModal(undefined)} 
              className="h-10 px-6 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10 select-none flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              {board.t('menu.constructor.categories.addBtn')}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <SortableContext items={board.categories.map((c: FullCategory) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-4 w-full">
                {board.categories.map((category: FullCategory) => (
                  <SortableCategory
                    key={category.id} 
                    category={category} 
                    categoryDishes={category.dishes || []}
                    onEditCategory={board.categoryModal.handleOpenCategoryModal} 
                    onDeleteCategory={board.setDeleteTarget}
                    onAddDish={(catId) => board.dishModal.handleOpenDishModal(catId, null)} 
                    onEditDish={board.dishModal.handleOpenDishModal}
                    onDeleteCategoryDish={board.setDeleteTarget} 
                    t={board.t}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )}

        <DragOverlay adjustScale={false}>
          {board.activeId && board.activeType === 'Dish' && board.activeDishData ? (
            <div className="opacity-95 scale-[1.02] -rotate-1 cursor-grabbing shadow-2xl w-60 pointer-events-none block z-50">
              <DishCard 
                dish={board.activeDishData as Dish} 
                categoryId="" 
                onEdit={() => {}} 
                onDelete={() => {}} 
                isOverlay={true} 
              />
            </div>
          ) : null}
        </DragOverlay>

        <CategoryModal 
          isOpen={board.categoryModal.isCatModalOpen} 
          onClose={() => board.categoryModal.setIsCatModalOpen(false)} 
          isEditing={!!board.categoryModal.editingCategory}
          catName={board.categoryModal.catName}
          setCatName={board.categoryModal.setCatName}
          onSave={board.categoryModal.handleSaveCategory}
          error={board.categoryModal.error}
        />
        
        <DishModal 
          isOpen={board.dishModal.isDishModalOpen} 
          onClose={() => board.dishModal.setIsDishModalOpen(false)} 
          dish={board.dishModal.editingDish}
          state={board.dishModal}
        />
      
        <ConfirmModal 
          isOpen={!!board.deleteTarget} 
          onClose={() => board.setDeleteTarget(null)} 
          onConfirm={board.handleConfirmDelete} 
          description={board.deleteTarget?.type === 'category' 
            ? board.t('menu.constructor.categories.deleteConfirm') 
            : board.t('menu.constructor.dishes.deleteConfirm')} 
        />
      </div>
    </DndContext>
  );
};