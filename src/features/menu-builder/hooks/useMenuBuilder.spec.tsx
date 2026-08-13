/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useMenuBuilder } from './useMenuBuilder';

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('lucide-react', () => ({
  LayoutList: () => null,
  Layers: () => null,
  PackagePlus: () => null,
}));

describe('useMenuBuilder', () => {
  it('should initialize with board tab', () => {
    const { result } = renderHook(() => useMenuBuilder());
    expect(result.current.activeTab).toBe('board');
    expect(result.current.tabs.length).toBe(3);
  });

  it('should change tab', () => {
    const { result } = renderHook(() => useMenuBuilder());
    
    act(() => {
      result.current.setActiveTab('modifiers');
    });

    expect(result.current.activeTab).toBe('modifiers');
  });
});
