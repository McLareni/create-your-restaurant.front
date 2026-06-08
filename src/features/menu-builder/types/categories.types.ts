import { Dish } from './dishes.types';

export interface CategoryData {
  id: string;
  name: string;
  sortOrder: number;
}

export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  catName: string;
  setCatName: (name: string) => void;
  onSave: () => void;
  error?: string | null;
  isLoading?: boolean;
}

export interface DeleteCategoryTarget {
  type: 'category';
  id: string;
}

export interface SortableCategoryProps {
  category: CategoryData;
  categoryDishes: Dish[];
  onEditCategory: (category: CategoryData) => void;
  onDeleteCategory: (target: DeleteCategoryTarget) => void;
  onAddDish: (categoryId: string) => void;
  onEditDish: (categoryId: string, dish: Dish) => void;
  onDeleteCategoryDish: (target: { type: 'dish'; id: string }) => void;
  t: (key: string) => string;
}