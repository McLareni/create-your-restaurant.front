'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { authApi } from '../api/auth.api';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRouter } from 'next/navigation';
import { emailSchema, verifySchema } from '../schemas/login.schema';
import toast from 'react-hot-toast';

export const useLoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const fetchUser = useUserStore((state) => state.fetchUser);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const isEmailSyntacticallyValid = email.includes('@') && email.includes('.');

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDisplayCode = (rawCode: string) => {
    return rawCode;
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await authApi.requestLoginCode(email);
      setTimeLeft(60);
      toast.success(t('auth.login.resendCode'));
    } catch (error: any) {
      const errorKey = `auth.errors.${error.message}`;
      const translated = t(errorKey);
      toast.error(translated === errorKey ? t('auth.errors.defaultError') : translated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError('');
    setCodeError('');

    try {
      if (step === 1) {
        const validation = emailSchema.safeParse({ email });
        if (!validation.success) {
          setEmailError(t(validation.error.issues[0].message));
          setIsLoading(false);
          return;
        }
        await authApi.requestLoginCode(email);
        setStep(2);
        setTimeLeft(60);
      } else {
        const validation = verifySchema.safeParse({ email, code });
        if (!validation.success) {
          setCodeError(t(validation.error.issues[0].message));
          setIsLoading(false);
          return;
        }
        await authApi.verifyLoginCode(email, code);
        await fetchUser(true);
        toast.success(t('dashboard.successMessage'));
        router.push('/dashboard');
      }
    } catch (error: any) {
      const errorKey = `auth.errors.${error.message}`;
      const translated = t(errorKey);
      const fallback = step === 1 ? t('auth.errors.defaultError') : t('auth.errors.verifyFailed');
      const finalMessage = translated === errorKey ? fallback : translated;

      if (step === 1) {
        setEmailError(finalMessage);
      } else {
        setCodeError(finalMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    t,
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
    handleSubmit,
  };
};