/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useDishModal } from './useDishModal';
import { INITIAL_DISH_FORM } from '@/features/menu-builder/schemas/dishes.schema';
import { menuApi } from '@/features/menu-builder/api/menu.api';
import toast from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@/features/menu-builder/api/menu.api', () => ({
  menuApi: {
    updateDishPhotos: jest.fn(),
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

jest.mock('@/features/menu-builder/hooks/dishes/useDishMediaGallery', () => ({
  useDishMediaGallery: () => ({
    items: [],
    dishPhotoFiles: [],
    dishImageUrls: [],
    activeDishImageIndex: 0,
    clearGallery: jest.fn(),
    handleLocalImageUpload: jest.fn(),
    handlePrevDishImage: jest.fn(),
    handleNextDishImage: jest.fn(),
    handleSelectDishImage: jest.fn(),
    handleRemoveImage: jest.fn(),
    setAsMainImage: jest.fn(),
  }),
}));

jest.mock('@/features/menu-builder/hooks/modifiers/useModifierGroupsQuery', () => ({
  useModifierGroupsQuery: () => ({
    data: [{ id: 'group1', name: 'Size', isRequired: true, options: [] }],
  }),
}));

jest.mock('@/shared/hooks/useAppActionState', () => ({
  useAppActionState: (actionFn: any) => {
    return [
      { errors: {} },
      async (formData: FormData) => {
        try {
          await actionFn(formData);
        } catch (e) {
          // ignore error for test purposes if it throws Validation failed
        }
      },
      false,
    ];
  },
}));

describe('useDishModal', () => {
  const mockCreateDishAsync = jest.fn();
  const mockUpdateDishAsync = jest.fn();
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
    const { result } = renderHook(() => useDishModal({
      createDishAsync: mockCreateDishAsync,
      updateDishAsync: mockUpdateDishAsync,
    }), { wrapper });

    expect(result.current.isDishModalOpen).toBe(false);
    expect(result.current.dishForm).toEqual(INITIAL_DISH_FORM);
    expect(result.current.modifierGroups.length).toBe(1);
    expect(result.current.modifierGroups[0].name).toBe('Size');
  });

  it('should open modal for creation', () => {
    const { result } = renderHook(() => useDishModal({
      createDishAsync: mockCreateDishAsync,
      updateDishAsync: mockUpdateDishAsync,
    }), { wrapper });

    act(() => {
      result.current.handleOpenDishModal('cat1');
    });

    expect(result.current.isDishModalOpen).toBe(true);
    expect(result.current.editingDish).toBeNull();
    expect(result.current.activeTab).toBe('general');
  });

  it('should open modal for editing', () => {
    const { result } = renderHook(() => useDishModal({
      createDishAsync: mockCreateDishAsync,
      updateDishAsync: mockUpdateDishAsync,
    }), { wrapper });

    const mockDish = {
      id: 'dish1',
      categoryId: 'cat1',
      name: 'Pizza',
      price: 100,
      isAvailable: true,
      images: [],
    };

    act(() => {
      result.current.handleOpenDishModal('cat1', mockDish as any);
    });

    expect(result.current.isDishModalOpen).toBe(true);
    expect(result.current.editingDish).toEqual(mockDish);
    expect(result.current.dishForm.name).toBe('Pizza');
    expect(result.current.dishForm.price).toBe(100);
  });

  it('should save dish via form action', async () => {
    mockCreateDishAsync.mockResolvedValue({ id: 'dish-123' });
    const { result } = renderHook(() => useDishModal({
      createDishAsync: mockCreateDishAsync,
      updateDishAsync: mockUpdateDishAsync,
    }), { wrapper });

    act(() => {
      result.current.handleOpenDishModal('cat1');
    });

    // Simulate form submission
    const formData = new FormData();
    formData.append('name', 'Burgers');
    formData.append('description', 'Tasty burgers');
    formData.append('price', '200'); // Note: in real use case price is part of state `dishForm`

    // We must update state first to simulate user typing
    act(() => {
      result.current.setDishForm({ ...INITIAL_DISH_FORM, price: 200 });
    });

    await act(async () => {
      await result.current.formAction(formData as any);
    });

    await waitFor(() => {
      expect(mockCreateDishAsync).toHaveBeenCalledWith({
        categoryId: 'cat1',
        data: expect.objectContaining({
          name: 'Burgers',
          description: 'Tasty burgers',
          price: 200,
        }),
      });
      expect(toast.success).toHaveBeenCalledWith('menu.constructor.dishes.notifications.createSuccess');
    });
  });
});
