'use client';

import { useState, useEffect, useTransition, ChangeEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { authApi } from '@/features/auth/api/auth.api';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRouter } from 'next/navigation';
import { emailSchema, verifySchema } from '@/features/auth/schemas/login.schema';
import { LoginFormState, AuthApiError } from '@/features/auth/types/auth.types';
import toast from 'react-hot-toast';

export const useLoginForm = (): LoginFormState => {
  const { t } = useTranslation();
  const router = useRouter();
  const fetchUser = useUserStore((state) => state.fetchUser);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPending, startTransition] = useTransition();

  const isEmailSyntacticallyValid = email.includes('@') && email.includes('.');

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDisplayCode = (rawCode: string): string => {
    const clean = rawCode.replace(/\D/g, '').slice(0, 6);
    if (clean.length > 3) {
      return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    }
    return clean;
  };

  const handleResendCode = async () => {
    if (timeLeft > 0 || isPending) return;
    setEmailError('');
    setCodeError('');
    
    startTransition(async () => {
      try {
        await authApi.requestLoginCode(email);
        setTimeLeft(60);
        toast.success(t('auth.login.codeResent'));
      } catch (error: unknown) {
        const err = error as AuthApiError;
        const errorKey = `auth.errors.${err.message}`;
        const translated = t(errorKey);
        setEmailError(translated === errorKey ? t('auth.errors.defaultError') : translated);
      }
    });
  };

  const handleFormAction = () => {
    setEmailError('');
    setCodeError('');

    startTransition(async () => {
      try {
        if (step === 1) {
          const validation = emailSchema.safeParse({ email });
          if (!validation.success) {
            setEmailError(t(validation.error.issues[0].message));
            return;
          }
          await authApi.requestLoginCode(email);
          setStep(2);
          setTimeLeft(60);
        } else {
          const cleanCode = code.replace(/\D/g, '');
          const validation = verifySchema.safeParse({ email, code: cleanCode });
          if (!validation.success) {
            setCodeError(t(validation.error.issues[0].message));
            return;
          }
          await authApi.verifyLoginCode(email, cleanCode);
          await fetchUser(true);
          toast.success(t('dashboard.successMessage'));
          router.push('/dashboard');
        }
      } catch (error: unknown) {
        const err = error as AuthApiError;
        const errorKey = `auth.errors.${err.message}`;
        const translated = t(errorKey);
        const fallback = step === 1 ? t('auth.errors.defaultError') : t('auth.errors.verifyFailed');
        const finalMessage = translated === errorKey ? fallback : translated;

        if (step === 1) {
          setEmailError(finalMessage);
        } else {
          setCodeError(finalMessage);
        }
      }
    });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  return {
    t,
    email,
    setEmail,
    code,
    setCode,
    step,
    emailError,
    codeError,
    isEmailSyntacticallyValid,
    timeLeft,
    setIsEmailDirty: () => {},
    formatTime,
    formatDisplayCode,
    handleResendCode,
    handleFormAction,
    isSubmitting: isPending,
    handleEmailChange,
    handleCodeChange,
  };
};