/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useMenuBoard } from './useMenuBoard';

jest.mock('@/features/menu-builder/hooks/board/useMenu', () => ({
  useMenu: () => ({
    categories: [],
    isLoading: false,
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
    createDishAsync: jest.fn(),
    updateDishAsync: jest.fn(),
    deleteDish: jest.fn(),
  }),
}));

jest.mock('@/features/menu-builder/hooks/modifiers/useModifiersManagement', () => ({
  useModifiersManagement: () => ({
    groups: [],
    isLoading: false,
  }),
}));

jest.mock('@/shared/hooks/useActiveRestaurantId', () => ({
  useActiveRestaurantId: () => 1,
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/features/menu-builder/hooks/categories/useCategoryModal', () => ({
  useCategoryModal: () => ({}),
}));

jest.mock('@/features/menu-builder/hooks/dishes/useDishModal', () => ({
  useDishModal: () => ({}),
}));

describe('useMenuBoard', () => {
  it('should initialize correctly', () => {
    const { result } = renderHook(() => useMenuBoard());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.categories).toEqual([]);
    expect(result.current.modifierGroups).toEqual([]);
  });

  it('should handle delete target', () => {
    const { result } = renderHook(() => useMenuBoard());

    act(() => {
      result.current.setDeleteTarget({ type: 'category', id: 'cat1' });
    });

    expect(result.current.deleteTarget).toEqual({ type: 'category', id: 'cat1' });

    act(() => {
      result.current.setDeleteTarget(null);
    });

    expect(result.current.deleteTarget).toBeNull();
  });
});
