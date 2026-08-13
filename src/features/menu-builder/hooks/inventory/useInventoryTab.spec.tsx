/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useInventoryTab } from './useInventoryTab';
import toast from 'react-hot-toast';
import { useInventory } from '@/features/menu-builder/hooks/inventory/useInventory';

jest.mock('@/features/menu-builder/hooks/inventory/useInventory', () => ({
  useInventory: jest.fn(),
}));

jest.mock('@/shared/hooks/useActiveRestaurantId', () => ({
  useActiveRestaurantId: () => 1,
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@/shared/hooks/useAppActionState', () => ({
  useAppActionState: (actionFn: any) => {
    return [
      { errors: {} },
      async (formData: FormData) => {
        await actionFn(formData);
      },
      false,
    ];
  },
}));

describe('useInventoryTab', () => {
  const mockCreateItem = jest.fn();
  const mockUpdateItem = jest.fn();
  const mockDeleteItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useInventory as jest.Mock).mockReturnValue({
      inventoryItems: [{ id: 'inv1', name: 'Tomato', stock: 10, unit: 'kg' }],
      isLoading: false,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
    });
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useInventoryTab());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.filteredItems.length).toBe(1);
    expect(result.current.searchQuery).toBe('');
  });

  it('should filter items based on search query', () => {
    const { result } = renderHook(() => useInventoryTab());

    act(() => {
      result.current.setSearchQuery('Cheese');
    });

    expect(result.current.filteredItems.length).toBe(0);

    act(() => {
      result.current.setSearchQuery('tom');
    });

    expect(result.current.filteredItems.length).toBe(1);
  });

  it('should handle stock blur update', () => {
    const { result } = renderHook(() => useInventoryTab());

    act(() => {
      result.current.handleStockBlur('inv1', '20');
    });

    expect(mockUpdateItem).toHaveBeenCalledWith({ id: 'inv1', stock: 20 });
  });

  it('should open create modal', () => {
    const { result } = renderHook(() => useInventoryTab());

    act(() => {
      result.current.openCreateModal();
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingItem).toBeNull();
  });

  it('should start edit', () => {
    const { result } = renderHook(() => useInventoryTab());
    const mockItem = { id: 'inv1', name: 'Tomato', stock: 10, unit: 'kg' };

    act(() => {
      result.current.startEdit(mockItem as any);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingItem).toEqual(mockItem);
  });
});
