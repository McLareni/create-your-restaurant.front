'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, ConfirmModal } from '@/shared/ui';
import { Plus, LayoutList } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useMenu } from '../../hooks/useMenu';
import { useModifiers } from '../../hooks/useModifiers';
import { SortableCategory } from './sortableCategory';
import { CategoryModal } from './categoryModal';
import { DishModal } from './dishModal';

const INITIAL_DISH_FORM = {
  name: '', description: '', price: 0, weight: '', cookingTime: '', calories: '',
  isVegan: false, isSpicy: false, isLactoseFree: false, badge: 'NONE', allergens: [], image: '', modifierGroupIds: []
};

export const MenuBoard = () => {
  const { t } = useTranslation();
  const { 
    categories, isLoading: isMenuLoading, 
    createCategory, updateCategory, deleteCategory, 
    createDish, updateDish, deleteDish, reorderCategories, reorderDishes
  } = useMenu();
  
  const { groups: modifierGroups, isLoading: isModifiersLoading } = useModifiers();

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catName, setCatName] = useState('');

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<any>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [dishForm, setDishForm] = useState<any>(INITIAL_DISH_FORM);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'dish'; id: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'Category' && overType === 'Category') {
      const oldIndex = categories.findIndex((c: any) => c.id === active.id);
      const newIndex = categories.findIndex((c: any) => c.id === over.id);
      const newArray = arrayMove(categories, oldIndex, newIndex).map(
        (item: any, index: number) => ({ ...item, sortOrder: index })
      );
      reorderCategories(newArray);
    }

    if (activeType === 'Dish' && overType === 'Dish') {
      const categoryId = active.data.current?.categoryId;
      if (categoryId === over.data.current?.categoryId) {
        const category = categories.find((c: any) => c.id === categoryId);
        if (category) {
          const oldIndex = category.dishes.findIndex((d: any) => d.id === active.id);
          const newIndex = category.dishes.findIndex((d: any) => d.id === over.id);
          const newArray = arrayMove(category.dishes, oldIndex, newIndex);
          reorderDishes({ categoryId, items: newArray });
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDishForm({ ...dishForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isMenuLoading || isModifiersLoading) {
    return (
      <div className="flex flex-col gap-4 py-2 w-full">
        <div className="h-16 w-full rounded-xl bg-brand-gray/10 animate-pulse"></div>
        <div className="h-48 w-full rounded-xl bg-brand-gray/5 animate-pulse mt-4"></div>
        <div className="h-32 w-full rounded-xl bg-brand-gray/5 animate-pulse"></div>
      </div>
    );
  }

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

  const handleOpenDishModal = (categoryId: string, dish?: any) => {
    setActiveCategoryId(categoryId);
    if (dish) {
      setEditingDish(dish);
      setDishForm({
        name: dish.name, description: dish.description || '', price: dish.price,
        weight: dish.weight || '', cookingTime: dish.cookingTime || '', calories: dish.calories || '',
        isVegan: dish.isVegan, isSpicy: dish.isSpicy, isLactoseFree: dish.isLactoseFree,
        badge: dish.badge || 'NONE', allergens: dish.allergens || [], image: dish.image || '',
        modifierGroupIds: dish.modifiers?.map((m: any) => m.modifierGroupId) || []
      });
    } else {
      setEditingDish(null);
      setDishForm(INITIAL_DISH_FORM);
    }
    setIsDishModalOpen(true);
  };

  const handleSaveDish = () => {
    if (!dishForm.name.trim() || !dishForm.price) return;
    const { image, ...dataToSend } = dishForm;
    const formattedData = {
      ...dataToSend,
      price: parseFloat(dishForm.price),
      weight: dishForm.weight ? parseFloat(dishForm.weight) : undefined,
      cookingTime: dishForm.cookingTime ? parseInt(dishForm.cookingTime) : undefined,
      calories: dishForm.calories ? parseInt(dishForm.calories) : undefined,
      modifierGroupIds: dishForm.modifierGroupIds
    };

    if (editingDish) {
      updateDish({ id: editingDish.id, data: formattedData });
    } else {
      createDish({ categoryId: activeCategoryId, data: formattedData });
    }
    setIsDishModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') {
      deleteCategory(deleteTarget.id);
    } else {
      deleteDish(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="relative min-h-125 pb-10 flex flex-col">
        
        <div className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-brand-cream/80 dark:bg-brand-espresso/80 backdrop-blur-md py-3 border-b border-brand-gray/10 -mx-2 px-2 sm:-mx-6 sm:px-6">
          <div className="mb-3 sm:mb-0">
            <h2 className="text-xl font-bold text-brand-espresso dark:text-brand-cream tracking-tight flex items-center gap-2">
              {t('menu.constructor.categories.title')}
            </h2>
          </div>
          <Button 
            variant="brand" 
            onClick={() => handleOpenCategoryModal()}
            className="h-10 px-5 rounded-lg text-sm shadow-md hover:shadow-lg transition-shadow"
            icon={<Plus className="h-4 w-4" />}
          >
            {t('menu.constructor.categories.addBtn')}
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 mt-10 rounded-3xl border-2 border-dashed border-brand-gray/20 bg-white/50 dark:bg-brand-mocha/20 text-center">
            <div className="h-20 w-20 bg-brand-cream dark:bg-brand-gray/10 rounded-full flex items-center justify-center mb-6">
              <LayoutList className="h-10 w-10 text-brand-copper" />
            </div>
            <h3 className="text-2xl font-bold text-brand-espresso dark:text-brand-cream mb-2">Ваше меню поки порожнє</h3>
            <p className="text-brand-gray max-w-md mb-8">
              Почніть із створення першої категорії (наприклад, "Піца" або "Напої"), а потім додайте до неї свої найкращі страви.
            </p>
            <Button 
              variant="brand" 
              onClick={() => handleOpenCategoryModal()}
              className="h-12 px-8 text-base shadow-lg"
              icon={<Plus className="h-5 w-5" />}
            >
              Створити першу категорію
            </Button>
          </div>
        ) : (
          <SortableContext items={categories.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4">
              {categories.map((category: any) => (
                <SortableCategory 
                  key={category.id}
                  category={category}
                  categoryDishes={category.dishes || []}
                  onEditCategory={handleOpenCategoryModal}
                  onDeleteCategory={setDeleteTarget}
                  onAddDish={handleOpenDishModal}
                  onEditDish={handleOpenDishModal}
                  onDeleteDish={setDeleteTarget}
                  t={t}
                />
              ))}
            </div>
          </SortableContext>
        )}

        <CategoryModal 
          isOpen={isCatModalOpen} 
          onClose={() => setIsCatModalOpen(false)} 
          isEditing={!!editingCategory} 
          catName={catName} 
          setCatName={setCatName} 
          onSave={handleSaveCategory} 
        />

        <DishModal 
          isOpen={isDishModalOpen} 
          onClose={() => setIsDishModalOpen(false)} 
          isEditing={!!editingDish} 
          dishForm={dishForm} 
          setDishForm={setDishForm} 
          onSave={handleSaveDish} 
          handleImageUpload={handleImageUpload}
          modifierGroups={modifierGroups}
        />

        <ConfirmModal 
          isOpen={!!deleteTarget} 
          onClose={() => setDeleteTarget(null)} 
          onConfirm={handleConfirmDelete} 
          description={deleteTarget?.type === 'category' ? t('menu.constructor.categories.deleteConfirm') : t('menu.constructor.dishes.deleteConfirm')}
        />
      </div>
    </DndContext>
  );
};