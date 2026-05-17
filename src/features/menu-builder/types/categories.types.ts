export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export type CreateCategoryDTO = Omit<Category, 'id' | 'sortOrder'>;
export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;