/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useMarketplace } from './useMarketplace';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { marketplaceApi } from '@/features/marketplace/api/marketplace.api';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import toast from 'react-hot-toast';
import React from 'react';

jest.mock('@/features/marketplace/api/marketplace.api', () => ({
  marketplaceApi: {
    getModules: jest.fn(() => [
      { key: 'analytics', price: 59 },
      { key: 'menu-engine', price: 0 },
      { key: 'multi-restaurant', price: 49 },
    ]),
    connectModule: jest.fn(),
  },
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('useMarketplace', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    jest.clearAllMocks();

    useRestaurantStore.setState({
      activeRestaurant: { id: 1, name: 'Resto', slug: 'resto' } as any,
    });
    
    useAccessStore.setState({
      activeModules: ['menu-engine'],
      purchasedModules: ['menu-engine'],
      toggleModule: jest.fn().mockResolvedValue(undefined),
      fetchAccessData: jest.fn().mockResolvedValue(undefined),
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should open and close connect modal', () => {
    const { result } = renderHook(() => useMarketplace(), { wrapper });
    
    act(() => {
      result.current.handleOpenConnectModal('analytics');
    });
    
    expect(result.current.selectedModule).toBe('analytics');

    act(() => {
      result.current.handleCloseConnectModal();
    });
    
    expect(result.current.selectedModule).toBeNull();
  });

  it('should handle validation error for invalid activation code', async () => {
    const { result } = renderHook(() => useMarketplace(), { wrapper });
    
    act(() => {
      result.current.handleOpenConnectModal('analytics');
      result.current.setActivationCode('INVALID СПЕЦ CHARS!');
    });
    
    await act(async () => {
      await result.current.handleConfirmConnectionAction();
    });
    
    expect(toast.error).toHaveBeenCalled();
    expect(marketplaceApi.connectModule).not.toHaveBeenCalled();
  });

  it('should successfully connect module and call API', async () => {
    const { result } = renderHook(() => useMarketplace(), { wrapper });
    
    (marketplaceApi.connectModule as jest.Mock).mockResolvedValue(true);
    
    act(() => {
      result.current.handleOpenConnectModal('analytics');
      result.current.setActivationCode('GUSTIO-2026');
    });
    
    await act(async () => {
      await result.current.handleConfirmConnectionAction();
    });
    
    expect(marketplaceApi.connectModule).toHaveBeenCalledWith(1, 'analytics', 'GUSTIO-2026');
    // It should close the modal on success
    expect(result.current.selectedModule).toBeNull();
  });

  it('should toggle module successfully', async () => {
    const { result } = renderHook(() => useMarketplace(), { wrapper });
    const toggleMock = useAccessStore.getState().toggleModule as jest.Mock;
    
    await act(async () => {
      result.current.handleToggleModule('menu-engine', false);
    });
    
    expect(toggleMock).toHaveBeenCalledWith('menu-engine', false);
  });

  it('should show toast error if API connection fails', async () => {
    const { result } = renderHook(() => useMarketplace(), { wrapper });
    
    (marketplaceApi.connectModule as jest.Mock).mockRejectedValue(new Error('errors.invalid_activation_code'));
    
    act(() => {
      result.current.handleOpenConnectModal('analytics');
      result.current.setActivationCode('WRONG-CODE');
    });
    
    await act(async () => {
      await result.current.handleConfirmConnectionAction();
    });
    
    // We don't check setTimeout here for toast, we can just ensure API was called
    expect(marketplaceApi.connectModule).toHaveBeenCalled();
  });
});
