'use client';

import React, { useState } from 'react';
import { Plus, LayoutList } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DragOverlay } from '@dnd-kit/core';
import { ConfirmModal, EmptyState } from '@/shared/ui';
import { MenuDndProvider, useMenuDnd } from '@/features/menu-builder/providers/MenuDndProvider';
import { SortableCategory } from '@/features/menu-builder/components/board/components/sortableCategory';
import { CategoryModal } from '@/features/menu-builder/components/board/modals/categoryModal';
import { DishModal } from '@/features/menu-builder/components/board/modals/dish-modal/dishModal';
import { DishCard } from '@/features/menu-builder/components/board/components/dishCard';
import { DishDetailsModal } from '@/features/menu-builder/components/board/modals/DishDetailsModal';
import { useMenuBoard } from '@/features/menu-builder/hooks/board/useMenuBoard';
import { usePermissions } from '@/shared/hooks/usePermissions';
import type { Dish } from '@/features/menu-builder/types/dishes.types';
import type { FullCategory } from '@/features/menu-builder/types/menu-board.types';

const MenuBoardContent = () => {
  const board = useMenuBoard();
  const dnd = useMenuDnd();
  const { canCreateMenu, canEditMenu, canDeleteMenu } = usePermissions();
  const [viewingDish, setViewingDish] = useState<Dish | null>(null);

  if (board.isLoading) {
    return (
      <div className="flex flex-col gap-4 py-2 w-full animate-pulse">
        <div className="h-16 w-full rounded-xl bg-bg-element/50 border border-neutral-200 dark:border-neutral-800" />
        <div className="h-48 w-full rounded-xl bg-bg-element/30 border border-neutral-200/40 dark:border-neutral-800/40 mt-4" />
      </div>
    );
  }

  return (
    <div className="relative min-h-100 pb-6 flex flex-col w-full px-0 select-none text-text-main overflow-hidden">
      <div className="sticky top-0 z-30 flex items-center justify-between mb-4 bg-bg-surface/80 backdrop-blur-md py-3 border-b border-neutral-200 dark:border-neutral-800 -mx-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-text-main tracking-tight flex items-center gap-2">
            {board.t('menu.constructor.categories.title')}
          </h2>
        </div>
        {canCreateMenu && (
          <button 
            type="button"
            onClick={() => board.categoryModal.handleOpenCategoryModal(undefined)} 
            className="h-10 px-4 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-brand-emerald/10 cursor-pointer transition-all active:scale-98 select-none tracking-wide"
          >
            <Plus className="h-4 w-4" />
            {board.t('menu.constructor.categories.addBtn')}
          </button>
        )}
      </div>

      {board.categories.length === 0 ? (
        <EmptyState
          icon={<LayoutList className="h-6 w-6 text-brand-emerald" />}
          title={board.t('menu.constructor.categories.emptyTitle')}
          description={board.t('menu.constructor.categories.emptyDesc')}
          actionLabel={canCreateMenu ? board.t('menu.constructor.categories.addBtn') : undefined}
          onAction={canCreateMenu ? () => board.categoryModal.handleOpenCategoryModal(undefined) : undefined}
        />
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
                  onViewDish={(dish) => setViewingDish(dish)}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      )}

      <DragOverlay adjustScale={false}>
        {dnd.activeId && dnd.activeType === 'Dish' && dnd.activeDishData ? (
          <div className="opacity-95 scale-[1.02] -rotate-1 cursor-grabbing shadow-2xl w-60 pointer-events-none block z-50">
            <DishCard 
              dish={dnd.activeDishData as Dish} 
              categoryId="" 
              onEdit={() => {}} 
              onDelete={() => {}} 
              onView={() => {}}
              isOverlay={true} 
              isLiveDnd={true}
              canEdit={canEditMenu}
              canDelete={canDeleteMenu}
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
        isLoading={board.isLoading}
      />
      
      <DishModal 
        key={board.dishModal.editingDish?.id || 'new-dish'}
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

      {viewingDish && (
        <DishDetailsModal 
          isOpen={!!viewingDish}
          onClose={() => setViewingDish(null)}
          dish={viewingDish}
        />
      )}
    </div>
  );
};

export const MenuBoard = () => {
  return (
    <MenuDndProvider>
      <MenuBoardContent />
    </MenuDndProvider>
  );
};