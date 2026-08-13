/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useTableCard } from './useTableCard';
import { getQrStyle, drawStyledQr } from '@/features/qr-tables/utils/qrRenderer';

// Mock dependencies
jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/shared/store/useRestaurantStore', () => ({
  useRestaurantStore: jest.fn(() => 'http://mock-restaurant.com/logo.png'),
}));

jest.mock('@/features/qr-tables/utils/qrRenderer', () => ({
  getQrStyle: jest.fn(),
  drawStyledQr: jest.fn(),
}));

describe('useTableCard', () => {
  const mockTable = {
    id: 'table-1',
    tableNumber: 1,
    type: 'Бар',
    qrUrl: 'http://example.com/qr/1',
    isActive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock IntersectionObserver
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
    
    (getQrStyle as jest.Mock).mockReturnValue({ patternType: 'dots', logoOverlay: true });
    (drawStyledQr as jest.Mock).mockResolvedValue('data:image/svg+xml;base64,mocked-qr');
  });

  it('should initialize correctly with zone label', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    const { result } = renderHook(() => 
      useTableCard({
        table: mockTable as any,
        onEdit,
        onDelete,
        onStatusChange,
        isSelected: false,
        onToggleSelect: jest.fn(),
      })
    );

    expect(result.current.zoneLabel).toBe('Бар');
    expect(result.current.styledQr).toBe(''); // empty until visible
  });

  it('should call onEdit when handleEditClick is invoked', () => {
    const onEdit = jest.fn();
    const { result } = renderHook(() => 
      useTableCard({
        table: mockTable as any,
        onEdit,
        onDelete: jest.fn(),
        onStatusChange: jest.fn(),
        isSelected: false,
        onToggleSelect: jest.fn(),
      })
    );

    const mockEvent = { stopPropagation: jest.fn() } as any;
    
    act(() => {
      result.current.handleEditClick(mockEvent);
    });

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalledWith(mockTable);
  });

  it('should call onDelete when handleDeleteClick is invoked', () => {
    const onDelete = jest.fn();
    const { result } = renderHook(() => 
      useTableCard({
        table: mockTable as any,
        onEdit: jest.fn(),
        onDelete,
        onStatusChange: jest.fn(),
        isSelected: false,
        onToggleSelect: jest.fn(),
      })
    );

    const mockEvent = { stopPropagation: jest.fn() } as any;
    
    act(() => {
      result.current.handleDeleteClick(mockEvent);
    });

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledWith(mockTable.id);
  });

  it('should call onStatusChange when handleToggleStatus is invoked', () => {
    const onStatusChange = jest.fn();
    const { result } = renderHook(() => 
      useTableCard({
        table: mockTable as any,
        onEdit: jest.fn(),
        onDelete: jest.fn(),
        onStatusChange,
        isSelected: false,
        onToggleSelect: jest.fn(),
      })
    );

    act(() => {
      result.current.handleToggleStatus(false);
    });

    expect(onStatusChange).toHaveBeenCalledWith(mockTable.id, false);
  });
});
