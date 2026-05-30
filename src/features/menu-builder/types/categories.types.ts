import { Dish } from './dishes.types';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export type CreateCategoryDTO = Omit<Category, 'id' | 'sortOrder'>;
export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;

export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  catName: string;
  setCatName: (name: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export interface DeleteCategoryTarget {
  type: 'category';
  id: string;
}

export interface SortableCategoryProps {
  category: any;
  categoryDishes: Dish[];
  onEditCategory: (category: any) => void;
  onDeleteCategory: (target: DeleteCategoryTarget) => void;
  onAddDish: (categoryId: string) => void;
  onEditDish: (categoryId: string, dish: Dish) => void;
  onDeleteCategoryDish: (target: { type: 'dish'; id: string }) => void;
  t: (key: string) => string;
}