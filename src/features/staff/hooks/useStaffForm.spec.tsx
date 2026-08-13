/** @jest-environment jsdom */
import { renderHook, act } from '@testing-library/react';
import { useStaffForm } from './useStaffForm';

jest.mock('@/shared/hooks/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react', () => {
  const original = jest.requireActual('react');
  return {
    ...original,
    useActionState: (action: any, initialState: any) => {
      return [
        initialState,
        async (formData: FormData) => {
          return await action(initialState, formData);
        },
        false,
      ];
    },
  };
});

describe('useStaffForm', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values when not editing', () => {
    const { result } = renderHook(() => useStaffForm(null, mockOnSuccess));

    expect(result.current.selectedRole).toBe('STAFF');
    expect(result.current.isActiveStatus).toBe(true);
    expect(result.current.photoPreview).toBe('');
    expect(result.current.formValues.firstName).toBe('');
  });

  it('should initialize with editing member values', () => {
    const mockMember = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'Manager',
      isActive: false,
      photo: 'avatar.png',
    };

    const { result } = renderHook(() => useStaffForm(mockMember as any, mockOnSuccess));

    expect(result.current.selectedRole).toBe('Manager');
    expect(result.current.isActiveStatus).toBe(false);
    expect(result.current.photoPreview).toBe('avatar.png');
    expect(result.current.formValues.firstName).toBe('John');
  });

  it('should update role and active status correctly', () => {
    const { result } = renderHook(() => useStaffForm(null, mockOnSuccess));

    act(() => {
      result.current.setSelectedRole('Admin');
      result.current.setIsActiveStatus(false);
    });

    expect(result.current.selectedRole).toBe('Admin');
    expect(result.current.isActiveStatus).toBe(false);
  });
});
