/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useQrGeneratorModal } from './useQrGeneratorModal';
import { drawStyledQr, saveQrStyle, getQrStyle } from '@/features/qr-tables/utils/qrRenderer';
import React from 'react';

// Mock dependencies
jest.mock('@/shared/store/useRestaurantStore', () => ({
  useRestaurantStore: jest.fn(() => 'http://mock-restaurant.com/logo.png'),
}));

jest.mock('@/features/qr-tables/utils/qrRenderer', () => ({
  drawStyledQr: jest.fn(),
  saveQrStyle: jest.fn(),
  getQrStyle: jest.fn(),
}));

// Mock process.env for URLs
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

describe('useQrGeneratorModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock global fetch for logo fetching
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () => Promise.resolve(new Blob(['mock-logo'], { type: 'image/png' })),
      })
    ) as jest.Mock;

    (getQrStyle as jest.Mock).mockReturnValue({ patternType: 'dots', logoOverlay: false });
    (drawStyledQr as jest.Mock).mockResolvedValue('data:image/svg+xml;base64,mocked-qr');
  });

  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn().mockResolvedValue(undefined),
    formData: {
      tableNumber: '5',
      type: 'Бар',
      isActive: true,
    },
    handleFormDataChange: jest.fn(),
    filteredTypes: ['Бар', 'Тераса'],
    showTypeSuggestions: false,
    setShowTypeSuggestions: jest.fn(),
    editingTableId: null,
    tables: [],
  };

  it('should initialize with default styles when creating a new table', async () => {
    const { result } = renderHook(() => useQrGeneratorModal(mockProps));

    await waitFor(() => {
      expect(result.current.patternType).toBe('dots');
      expect(result.current.logoOverlay).toBe(false);
    });
  });

  it('should load saved styles when editing an existing table', async () => {
    (getQrStyle as jest.Mock).mockReturnValue({ patternType: 'squares', logoOverlay: true });
    
    const { result } = renderHook(() => 
      useQrGeneratorModal({ ...mockProps, editingTableId: 'table-123' })
    );

    await waitFor(() => {
      expect(getQrStyle).toHaveBeenCalledWith('table-123');
      expect(result.current.patternType).toBe('squares');
      expect(result.current.logoOverlay).toBe(true);
    });
  });

  it('should call onSave and saveQrStyle when handleFormAction is executed', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    
    const { result } = renderHook(() => 
      useQrGeneratorModal({ ...mockProps, editingTableId: 'table-123', onSave })
    );

    act(() => {
      result.current.handleFormAction();
    });

    await waitFor(() => {
      expect(saveQrStyle).toHaveBeenCalledWith('table-123', expect.objectContaining({
        patternType: 'dots',
        logoOverlay: false
      }));
      expect(onSave).toHaveBeenCalled();
    });
  });

  it('should toggle side panel state', () => {
    const { result } = renderHook(() => useQrGeneratorModal(mockProps));

    expect(result.current.isSidePanelOpen).toBe(false);

    act(() => {
      result.current.setIsSidePanelOpen(true);
    });

    expect(result.current.isSidePanelOpen).toBe(true);
  });
});
