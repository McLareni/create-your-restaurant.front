/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useCategoryModal } from './useCategoryModal';
import { categorySchema } from '@/features/menu-builder/schemas/categories.schema';

describe('useCategoryModal', () => {
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useCategoryModal(mockCreate, mockUpdate));
    expect(result.current.isCatModalOpen).toBe(false);
    expect(result.current.editingCategory).toBeNull();
    expect(result.current.catName).toBe('');
    expect(result.current.error).toBeNull();
  });

  it('should open modal for creation', () => {
    const { result } = renderHook(() => useCategoryModal(mockCreate, mockUpdate));

    act(() => {
      result.current.handleOpenCategoryModal();
    });

    expect(result.current.isCatModalOpen).toBe(true);
    expect(result.current.editingCategory).toBeNull();
    expect(result.current.catName).toBe('');
    expect(result.current.error).toBeNull();
  });

  it('should open modal for editing', () => {
    const { result } = renderHook(() => useCategoryModal(mockCreate, mockUpdate));

    const mockCategory = { id: 'cat1', name: 'Pizza', sortOrder: 0 };

    act(() => {
      result.current.handleOpenCategoryModal(mockCategory);
    });

    expect(result.current.isCatModalOpen).toBe(true);
    expect(result.current.editingCategory).toEqual(mockCategory);
    expect(result.current.catName).toBe('Pizza');
    expect(result.current.error).toBeNull();
  });

  it('should validate and show error when name is invalid', () => {
    const { result } = renderHook(() => useCategoryModal(mockCreate, mockUpdate));

    act(() => {
      result.current.handleOpenCategoryModal();
    });

    act(() => {
      result.current.setCatName(''); // empty string is invalid per schema
      result.current.handleSaveCategory();
    });

    expect(result.current.error).toBeTruthy();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should call createCategory when saving new category', () => {
    const { result } = renderHook(() => useCategoryModal(mockCreate, mockUpdate));

    act(() => {
      result.current.handleOpenCategoryModal();
    });

    act(() => {
      result.current.setCatName('Burgers');
    });

    act(() => {
      result.current.handleSaveCategory();
    });

    expect(result.current.error).toBeNull();
    expect(mockCreate).toHaveBeenCalledWith('Burgers', expect.any(Object));
  });

  it('should call updateCategory when saving existing category', () => {
    const { result } = renderHook(() => useCategoryModal(mockCreate, mockUpdate));
    const mockCategory = { id: 'cat1', name: 'Pizza', sortOrder: 0 };

    act(() => {
      result.current.handleOpenCategoryModal(mockCategory);
    });

    act(() => {
      result.current.setCatName('Pizzas');
    });

    act(() => {
      result.current.handleSaveCategory();
    });

    expect(result.current.error).toBeNull();
    expect(mockUpdate).toHaveBeenCalledWith({ id: 'cat1', name: 'Pizzas' }, expect.any(Object));
  });
});
