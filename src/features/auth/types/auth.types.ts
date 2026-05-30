import { FormEvent } from 'react';

export interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  step: 1 | 2;
  isLoading: boolean;
  emailError: string;
  codeError: string;
  isEmailSyntacticallyValid: boolean;
  timeLeft: number;
  setIsEmailDirty: (value: boolean) => void;
  formatTime: (seconds: number) => string;
  formatDisplayCode: (rawCode: string) => string;
  handleResendCode: () => Promise<void>;
  handleSubmit: (e: FormEvent) => Promise<void>;
  t: (key: string) => string;
}