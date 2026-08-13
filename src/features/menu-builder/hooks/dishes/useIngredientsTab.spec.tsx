/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useIngredientsTabLogic } from './useIngredientsTab';
import toast from 'react-hot-toast';

jest.mock('@/features/menu-builder/hooks/inventory/useInventory', () => ({
  useInventory: () => ({
    inventoryItems: [
      { id: 'inv1', name: 'Tomato', unit: 'kg' },
      { id: 'inv2', name: 'Cheese', unit: 'kg' },
    ],
    isLoading: false,
  }),
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

describe('useIngredientsTabLogic', () => {
  it('should initialize correctly', () => {
    const mockSetDishForm = jest.fn();
    const { result } = renderHook(() =>
      useIngredientsTabLogic({ ingredients: [] } as any, mockSetDishForm)
    );

    expect(result.current.selectedItemId).toBe('');
    expect(result.current.quantity).toBe('');
    expect(result.current.inventoryItems.length).toBe(2);
  });

  it('should add ingredient', () => {
    let currentForm = { ingredients: [] } as any;
    const mockSetDishForm = jest.fn().mockImplementation((fn) => {
      currentForm = fn(currentForm);
    });

    const { result } = renderHook(() =>
      useIngredientsTabLogic(currentForm, mockSetDishForm)
    );

    act(() => {
      result.current.setSelectedItemId('inv1');
      result.current.setQuantity('2');
    });

    act(() => {
      result.current.handleAdd();
    });

    expect(mockSetDishForm).toHaveBeenCalled();
    expect(currentForm.ingredients).toEqual([
      { name: 'Tomato', quantity: 2, unit: 'kg', inventoryItemId: 'inv1' },
    ]);
  });

  it('should not add duplicate ingredient', () => {
    const currentForm = {
      ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg', inventoryItemId: 'inv1' }],
    } as any;
    const mockSetDishForm = jest.fn();

    const { result } = renderHook(() =>
      useIngredientsTabLogic(currentForm, mockSetDishForm)
    );

    act(() => {
      result.current.setSelectedItemId('inv1');
      result.current.setQuantity('1');
    });

    act(() => {
      result.current.handleAdd();
    });

    expect(mockSetDishForm).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('menu.constructor.dishes.modal.ingredients.errors.alreadyAdded');
  });

  it('should remove ingredient', () => {
    let currentForm = {
      ingredients: [{ name: 'Tomato', quantity: 2, unit: 'kg', inventoryItemId: 'inv1' }],
    } as any;
    const mockSetDishForm = jest.fn().mockImplementation((fn) => {
      currentForm = fn(currentForm);
    });

    const { result } = renderHook(() =>
      useIngredientsTabLogic(currentForm, mockSetDishForm)
    );

    act(() => {
      result.current.handleRemove(0);
    });

    expect(currentForm.ingredients).toEqual([]);
  });
});
