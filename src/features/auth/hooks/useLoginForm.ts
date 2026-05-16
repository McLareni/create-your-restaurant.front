'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { emailSchema, verifySchema } from '@/features/auth/schemas/login.schema';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { authApi } from '@/features/auth/api/auth.api';
import { useRouter } from 'next/navigation';

export const useLoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [isEmailSyntacticallyValid, setIsEmailSyntacticallyValid] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const result = emailSchema.safeParse({ email });
    setIsEmailSyntacticallyValid(result.success);

    if (email === '') {
      if (isEmailDirty) {
        setEmailError(t('auth.errors.emailRequired'));
      } else {
        setEmailError('');
      }
      return;
    }

    if (result.success) {
      setEmailError('');
    } else {
      const hasCyrillicError = result.error.issues.some(
        (issue: z.ZodIssue) => issue.message === 'auth.errors.emailCyrillic'
      );
      if (hasCyrillicError) {
        setEmailError(t('auth.errors.emailCyrillic'));
      } else {
        setEmailError('');
      }
    }
  }, [email, isEmailDirty, t]);

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDisplayCode = (rawCode: string) => {
    if (rawCode.length > 3) {
      return `${rawCode.slice(0, 3)}-${rawCode.slice(3, 6)}`;
    }
    return rawCode;
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return;
    
    setIsLoading(true);
    try {
      await authApi.requestLoginCode(email);
      setTimeLeft(120);
      setCodeError('');
    } catch (error) {
      setCodeError(error instanceof Error ? error.message : 'Error sending code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setCodeError('');

    if (step === 1) {
      const validation = emailSchema.safeParse({ email });
      if (!validation.success) {
        setEmailError(t(validation.error.issues[0].message));
        return;
      }

      setIsLoading(true);
      try {
        await authApi.requestLoginCode(email);
        setStep(2);
        setTimeLeft(120);
      } catch (error) {
        setEmailError(error instanceof Error ? error.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    } else {
      const validation = verifySchema.safeParse({ email, code });
      if (!validation.success) {
        const codeIssue = validation.error.issues.find((i: z.ZodIssue) => i.path.includes('code'));
        if (codeIssue) setCodeError(t(codeIssue.message));
        return;
      }

      setIsLoading(true);
      try {
        await authApi.verifyLoginCode(email, code);
        document.cookie = 'gustio_session=temporary_mock_token; path=/; max-age=3600; SameSite=Lax;';
        router.push('/dashboard');
      } catch (error) {
        setCodeError('Невірний код або термін його дії минув');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    email,
    setEmail,
    code,
    setCode,
    step,
    isLoading,
    emailError,
    codeError,
    isEmailSyntacticallyValid,
    timeLeft,
    setIsEmailDirty,
    formatTime,
    formatDisplayCode,
    handleResendCode,
    handleSubmit
  };
};