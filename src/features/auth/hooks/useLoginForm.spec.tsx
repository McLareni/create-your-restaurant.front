/** @jest-environment jsdom */
import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from './useLoginForm';
import { authApi } from '@/features/auth/api/auth.api';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';

import { waitFor } from '@testing-library/react';

jest.mock('@/features/auth/api/auth.api', () => ({
  authApi: {
    requestLoginCode: jest.fn(),
    verifyLoginCode: jest.fn(),
  },
}));

jest.mock('@/shared/store/useUserStore', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('useLoginForm', () => {
  const mockFetchUser = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({ fetchUser: mockFetchUser });
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it('should initialize with step 1 and empty fields', () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.step).toBe(1);
    expect(result.current.email).toBe('');
    expect(result.current.code).toBe('');
  });

  it('should show validation error for invalid email', async () => {
    const { result } = renderHook(() => useLoginForm());
    
    act(() => {
      result.current.handleEmailChange({ target: { value: 'invalid-email' } } as any);
    });
    act(() => {
      result.current.handleFormAction();
    });

    await waitFor(() => {
      expect(result.current.emailError).toBe('auth.errors.emailInvalid');
    });
    expect(authApi.requestLoginCode).not.toHaveBeenCalled();
  });

  it('should proceed to step 2 on valid email', async () => {
    (authApi.requestLoginCode as jest.Mock).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useLoginForm());
    
    act(() => {
      result.current.handleEmailChange({ target: { value: 'test@example.com' } } as any);
    });
    
    act(() => {
      result.current.handleFormAction();
    });

    await waitFor(() => {
      expect(authApi.requestLoginCode).toHaveBeenCalledWith('test@example.com');
      expect(result.current.step).toBe(2);
      expect(result.current.timeLeft).toBe(60);
    });
  });

  it('should verify code and fetch user on step 2', async () => {
    (authApi.requestLoginCode as jest.Mock).mockResolvedValue(undefined);
    (authApi.verifyLoginCode as jest.Mock).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useLoginForm());
    
    // Step 1
    act(() => {
      result.current.handleEmailChange({ target: { value: 'test@example.com' } } as any);
    });
    act(() => {
      result.current.handleFormAction();
    });
    
    await waitFor(() => {
      expect(result.current.step).toBe(2);
    });
    
    // Step 2
    act(() => {
      result.current.handleCodeChange({ target: { value: '123456' } } as any);
    });
    act(() => {
      result.current.handleFormAction();
    });

    await waitFor(() => {
      expect(authApi.verifyLoginCode).toHaveBeenCalledWith('test@example.com', '123456');
      expect(mockFetchUser).toHaveBeenCalledWith(true);
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
