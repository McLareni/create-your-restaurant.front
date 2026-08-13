/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useDishMediaGallery } from './useDishMediaGallery';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

describe('useDishMediaGallery', () => {
  it('should initialize correctly with empty array', () => {
    const { result } = renderHook(() => useDishMediaGallery([]));
    expect(result.current.items).toEqual([]);
    expect(result.current.dishImageUrls).toEqual([]);
    expect(result.current.activeDishImageIndex).toBe(0);
  });

  it('should initialize with initial images', () => {
    const { result } = renderHook(() => useDishMediaGallery(['url1', 'url2']));
    expect(result.current.items.length).toBe(2);
    expect(result.current.dishImageUrls).toEqual(['url1', 'url2']);
  });

  it('should handle prev and next image', () => {
    const { result } = renderHook(() => useDishMediaGallery(['url1', 'url2', 'url3']));

    act(() => {
      result.current.handleNextDishImage();
    });
    expect(result.current.activeDishImageIndex).toBe(1);

    act(() => {
      result.current.handlePrevDishImage();
    });
    expect(result.current.activeDishImageIndex).toBe(0);
  });

  it('should remove image and adjust active index', () => {
    const { result } = renderHook(() => useDishMediaGallery(['url1', 'url2']));

    act(() => {
      result.current.handleSelectDishImage(1); // Set to index 1
    });

    act(() => {
      result.current.handleRemoveImage(1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.dishImageUrls).toEqual(['url1']);
    expect(result.current.activeDishImageIndex).toBe(0); // Should adjust to max available index
  });

  it('should clear gallery', () => {
    const { result } = renderHook(() => useDishMediaGallery(['url1', 'url2']));
    act(() => {
      result.current.clearGallery();
    });
    expect(result.current.items).toEqual([]);
    expect(result.current.dishImageUrls).toEqual([]);
  });

  it('should set as main image', () => {
    const { result } = renderHook(() => useDishMediaGallery(['url1', 'url2']));
    act(() => {
      result.current.setAsMainImage(1);
    });
    expect(result.current.dishImageUrls[0]).toEqual('url2');
    expect(result.current.dishImageUrls[1]).toEqual('url1');
    expect(result.current.activeDishImageIndex).toBe(0);
  });
});
