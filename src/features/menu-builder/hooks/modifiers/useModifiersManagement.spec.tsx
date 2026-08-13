/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useModifiersManagement } from './useModifiersManagement';
import { modifiersApi } from '@/features/menu-builder/api/modifiers.api';
import toast from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@/features/menu-builder/api/modifiers.api', () => ({
  modifiersApi: {
    createGroup: jest.fn(),
    updateGroup: jest.fn(),
    deleteGroup: jest.fn(),
  },
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/shared/hooks/useActiveRestaurantId', () => ({
  useActiveRestaurantId: () => 1,
}));

const mockGroups = [
  { id: 'group1', name: 'Size', isRequired: true, options: [{ id: 'opt1', name: 'Large', price: 10, isAvailable: true }] },
];

jest.mock('@/features/menu-builder/hooks/modifiers/useModifierGroupsQuery', () => ({
  useModifierGroupsQuery: () => ({
    data: mockGroups,
    isLoading: false,
  }),
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

describe('useModifiersManagement', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useModifiersManagement(), { wrapper });

    expect(result.current.groups).toEqual(mockGroups);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isGroupModalOpen).toBe(false);
    expect(result.current.isOptionModalOpen).toBe(false);
  });

  it('should handle toggleGroup', () => {
    const { result } = renderHook(() => useModifiersManagement(), { wrapper });

    act(() => {
      result.current.toggleGroup('group1');
    });

    expect(result.current.expandedGroups['group1']).toBe(true);

    act(() => {
      result.current.toggleGroup('group1');
    });

    expect(result.current.expandedGroups['group1']).toBe(false);
  });

  it('should open group modal', () => {
    const { result } = renderHook(() => useModifiersManagement(), { wrapper });

    act(() => {
      result.current.handleOpenGroupModal(mockGroups[0] as any);
    });

    expect(result.current.isGroupModalOpen).toBe(true);
    expect(result.current.editingGroup).toEqual(mockGroups[0]);
  });

  it('should open option modal', () => {
    const { result } = renderHook(() => useModifiersManagement(), { wrapper });

    act(() => {
      result.current.handleOpenOptionModal('group1', mockGroups[0].options[0] as any);
    });

    expect(result.current.isOptionModalOpen).toBe(true);
    expect(result.current.editingOption).toEqual(mockGroups[0].options[0]);
    expect(result.current.optionForm.name).toBe('Large');
  });

  it('should handle create option', async () => {
    const { result } = renderHook(() => useModifiersManagement(), { wrapper });

    act(() => {
      result.current.handleOpenOptionModal('group1');
    });

    act(() => {
      result.current.setOptionForm({ name: 'Small', price: '5', isAvailable: true });
    });

    act(() => {
      result.current.handleSaveOption();
    });

    await waitFor(() => {
      expect(modifiersApi.updateGroup).toHaveBeenCalledWith('group1', expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ name: 'Small', price: 5 }),
        ]),
      }));
    });
  });

  it('should handle confirm delete group', async () => {
    const { result } = renderHook(() => useModifiersManagement(), { wrapper });

    act(() => {
      result.current.setDeleteTarget({ type: 'group', id: 'group1' });
    });

    act(() => {
      result.current.handleConfirmDelete();
    });

    await waitFor(() => {
      expect(modifiersApi.deleteGroup).toHaveBeenCalledWith('group1');
      expect(result.current.deleteTarget).toBeNull();
    });
  });
});
