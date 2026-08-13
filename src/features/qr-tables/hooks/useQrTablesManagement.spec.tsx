/** @jest-environment jsdom */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useQrTablesManagement } from './useQrTablesManagement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tablesApi } from '@/features/qr-tables/api/tables.api';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useUserStore } from '@/shared/store/useUserStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import React, { ReactNode } from 'react';

jest.mock('@/features/qr-tables/api/tables.api');
jest.mock('@/shared/store/useRestaurantStore');
jest.mock('@/shared/store/useUserStore');
jest.mock('@/shared/hooks/useTranslation');

const mockTables = [
  { id: '1', tableNumber: '1', type: 'SQUARE', isActive: true, qrCode: 'qr1' },
  { id: '2', tableNumber: '2', type: 'ROUND', isActive: false, qrCode: 'qr2' },
];

describe('useQrTablesManagement', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    (useRestaurantStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        activeRestaurant: { id: 1, slug: 'test-rest' },
      })
    );

    (useUserStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { restaurants: [{ id: 1, slug: 'test-rest' }] },
      })
    );
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch tables on mount', async () => {
    (tablesApi.getAll as jest.Mock).mockResolvedValue(mockTables);

    const { result } = renderHook(() => useQrTablesManagement(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.tables).toEqual(mockTables);
  });

  it('should handle selection', async () => {
    (tablesApi.getAll as jest.Mock).mockResolvedValue(mockTables);
    const { result } = renderHook(() => useQrTablesManagement(), { wrapper });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleToggleSelect('1');
    });

    expect(result.current.selectedIds.has('1')).toBe(true);
    expect(result.current.selectedIds.has('2')).toBe(false);

    act(() => {
      result.current.handleSelectAll(true);
    });

    expect(result.current.selectedIds.size).toBe(2);

    act(() => {
      result.current.handleSelectAll(false);
    });

    expect(result.current.selectedIds.size).toBe(0);
  });

  it('should filter types', async () => {
    (tablesApi.getAll as jest.Mock).mockResolvedValue(mockTables);
    const { result } = renderHook(() => useQrTablesManagement(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleFormDataChange({ type: 'SQU' });
    });

    expect(result.current.filteredTypes).toEqual(['SQUARE']);
  });

  it('should show error for non-unique table number', async () => {
    (tablesApi.getAll as jest.Mock).mockResolvedValue(mockTables);
    const { result } = renderHook(() => useQrTablesManagement(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.onOpenCreate();
    });

    act(() => {
      result.current.handleFormDataChange({ tableNumber: '1', type: 'SQUARE', isActive: true });
    });

    await act(async () => {
      await result.current.onSave();
    });

    expect(result.current.errorMsg).toBe('qr.errors.numberUnique');
    expect(tablesApi.create).not.toHaveBeenCalled();
  });

  it('should create table when data is valid', async () => {
    (tablesApi.getAll as jest.Mock).mockResolvedValue(mockTables);
    (tablesApi.create as jest.Mock).mockResolvedValueOnce({
      id: '3', tableNumber: '3', type: 'SQUARE', isActive: true, qrCode: 'qr3'
    });

    const { result } = renderHook(() => useQrTablesManagement(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.onOpenCreate();
    });

    act(() => {
      result.current.handleFormDataChange({ tableNumber: '3', type: 'SQUARE', isActive: true });
    });

    await act(async () => {
      await result.current.onSave();
    });

    expect(tablesApi.create).toHaveBeenCalledWith(
      1,
      { tableNumber: '3', type: 'SQUARE', isActive: true },
      'test-rest'
    );
  });

});
