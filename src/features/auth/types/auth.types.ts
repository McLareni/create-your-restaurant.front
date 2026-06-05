import { ChangeEvent } from 'react';

export interface LoginFormState {
  t: (key: string) => string;
  email: string;
  setEmail: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  step: 1 | 2;
  emailError: string;
  codeError: string;
  isEmailSyntacticallyValid: boolean;
  timeLeft: number;
  setIsEmailDirty: (value: boolean) => void;
  formatTime: (seconds: number) => string;
  formatDisplayCode: (rawCode: string) => string;
  handleResendCode: () => Promise<void>;
  handleFormAction: () => void;
  isSubmitting: boolean;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface AuthApiError {
  message?: string;
}