/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useInventoryTab } from './useInventoryTab';
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
    localStorage.clear();
    (useInventory as jest.Mock).mockReturnValue({
      inventoryItems: [{ id: 'inv1', name: 'Tomato', stock: 10, unit: 'kg', createdAt: '2026-08-17T00:00:00.000Z', updatedAt: '2026-08-17T00:00:00.000Z' }],
      isLoading: false,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
    });
  });

  it('should initialize correctly', async () => {
    const { result } = renderHook(() => useInventoryTab());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.filteredItems.length).toBe(1);
    expect(result.current.searchQuery).toBe('');
    await waitFor(() => expect(result.current.selectedItemId).toBe('inv1'));
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

  it('should handle stock blur update', async () => {
    const { result } = renderHook(() => useInventoryTab());

    await act(async () => {
      await result.current.handleStockBlur('inv1', '20');
    });

    expect(mockUpdateItem).toHaveBeenCalledWith({ id: 'inv1', stock: 20 });
  });

  it('should persist history when stock changes', async () => {
    const { result } = renderHook(() => useInventoryTab());

    await act(async () => {
      await result.current.handleStockBlur('inv1', '20');
    });

    const saved = JSON.parse(localStorage.getItem('inventory-history-v2:1') || '{}');
    expect(saved.inv1).toHaveLength(1);
    expect(saved.inv1[0].nextStock).toBe(20);
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
    const mockItem = { id: 'inv1', name: 'Tomato', stock: 10, unit: 'kg', createdAt: '2026-08-17T00:00:00.000Z', updatedAt: '2026-08-17T00:00:00.000Z' };

    act(() => {
      result.current.startEdit(mockItem as any);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingItem).toEqual(mockItem);
  });
});
