/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreateOrganization } from './useCreateOrganization';
import { organizationApi } from '../api/organizations.api';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock Zustand stores
jest.mock('@/shared/store/useUserStore', () => ({
  useUserStore: Object.assign(
    () => ({ user: { id: 1, restaurants: [] } }), // Default returned state
    {
      getState: () => ({
        user: { id: 1, restaurants: [] },
        fetchUser: jest.fn(),
      }),
    }
  ),
}));

jest.mock('@/shared/store/useRestaurantStore', () => ({
  useRestaurantStore: Object.assign(
    () => ({}),
    {
      getState: () => ({
        setActiveRestaurant: jest.fn(),
      }),
    }
  ),
}));

jest.mock('@/shared/store/useAccessStore', () => ({
  useAccessStore: Object.assign(
    () => ({ activeModules: [] }), // Default hook return
    {
      getState: () => ({
        activeModules: [],
      }),
    }
  ),
}));

// Mock the API layer
jest.mock('../api/organizations.api', () => ({
  organizationApi: {
    checkSlug: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock API client for image upload
jest.mock('@/shared/api/client', () => ({
  apiClient: {
    post: jest.fn().mockResolvedValue({ imageUrl: 'http://test.com/img.jpg' }),
  },
}));

// Setup react ReactDOM mocks for action state
jest.mock('react', () => {
  const original = jest.requireActual('react');
  return {
    ...original,
    useActionState: (action: any) => [
      { errors: {} },
      async () => {},
      false
    ],
  };
});

describe('useCreateOrganization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger slug check only when name or slug changes', async () => {
    (organizationApi.checkSlug as jest.Mock).mockResolvedValue({ isAvailable: true });
    
    const { result } = renderHook(() => useCreateOrganization());

    // Initially isCheckingSlug should be false
    expect(result.current.isCheckingSlug).toBe(false);

    // 1. Change city (should NOT trigger slug check because slug is empty)
    act(() => {
      result.current.handleChange('city', 'Kyiv');
    });
    expect(result.current.isCheckingSlug).toBe(false);

    // 2. Change name (should trigger slug check)
    act(() => {
      result.current.handleChange('name', 'My Resto');
    });
    
    expect(result.current.formData.slug).toBe('my-resto');
    expect(result.current.isCheckingSlug).toBe(true);

    // Wait for debounce and API call
    await waitFor(() => {
      expect(organizationApi.checkSlug).toHaveBeenCalledWith('my-resto');
      expect(result.current.isCheckingSlug).toBe(false);
      expect(result.current.slugAvailable).toBe(true);
    });

    // Clear mock to track new calls
    (organizationApi.checkSlug as jest.Mock).mockClear();

    // 3. Change phone (should NOT trigger slug check because slug is the same)
    act(() => {
      result.current.handleChange('phone', '123456789');
    });

    // isCheckingSlug should remain false
    expect(result.current.isCheckingSlug).toBe(false);
    
    // Wait a bit to ensure it doesn't get called
    await new Promise(r => setTimeout(r, 600));
    expect(organizationApi.checkSlug).not.toHaveBeenCalled();
    
    // 4. Change slug manually (should trigger slug check)
    act(() => {
      result.current.handleChange('slug', 'my-resto-new');
    });
    
    expect(result.current.isCheckingSlug).toBe(true);
    
    await waitFor(() => {
      expect(organizationApi.checkSlug).toHaveBeenCalledWith('my-resto-new');
    });
  });

  it('should auto-generate slug from name if not manually edited', () => {
    const { result } = renderHook(() => useCreateOrganization());
    
    act(() => {
      result.current.handleChange('name', 'Hello World!');
    });
    
    expect(result.current.formData.slug).toBe('hello-world');
  });

  it('should not auto-generate slug from name if slug was manually edited', () => {
    const { result } = renderHook(() => useCreateOrganization());
    
    act(() => {
      result.current.handleChange('slug', 'my-custom-slug');
    });
    
    expect(result.current.formData.slug).toBe('my-custom-slug');
    
    act(() => {
      result.current.handleChange('name', 'Hello World!');
    });
    
    // Slug should remain the custom one
    expect(result.current.formData.slug).toBe('my-custom-slug');
  });

  it('should return combined errors including slug reserved error', () => {
    const { result } = renderHook(() => useCreateOrganization());
    
    act(() => {
      result.current.handleChange('slug', 'admin');
    });
    
    expect(result.current.errors.slug).toBe('organization.errors.slugReserved');
  });

  it('should validate image size client-side and reject large files', async () => {
    const { result } = renderHook(() => useCreateOrganization());

    // Create a mock file larger than 10MB
    const largeFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

    await act(async () => {
      await result.current.handleImageChange(largeFile);
    });

    // Check that the error was set
    expect(result.current.errors.imageUrl).toBe('organization.errors.fileTooLarge');
    
    // Create a mock file under 10MB
    const okFile = new File([''], 'ok.jpg', { type: 'image/jpeg' });
    Object.defineProperty(okFile, 'size', { value: 5 * 1024 * 1024 });

    await act(async () => {
      await result.current.handleImageChange(okFile);
    });

    // The error should be cleared
    expect(result.current.errors.imageUrl).toBeUndefined();
  });
});
