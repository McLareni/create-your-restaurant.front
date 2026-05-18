'use client';

import { Mail, Key } from 'lucide-react';
import { Input, Button, Checkbox, GoogleIcon, AppleIcon } from '@/shared/ui';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

export const LoginForm = () => {
  const { t } = useTranslation();
  const {
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
  } = useLoginForm();

  return (
    <div className="w-full max-w-105 rounded-3xl bg-white dark:bg-brand-mocha p-8 shadow-2xl border border-brand-gray/20 dark:border-brand-gray/20 transition-colors"> 
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-[32px] font-serif font-medium leading-tight text-brand-espresso dark:text-brand-cream">
          {t('auth.login.title')}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray dark:text-brand-gray/80">
          {t('auth.login.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="p-1 -m-1">
          <Input
            id="email"
            type="email"
            label={t('auth.login.emailLabel')}
            placeholder={t('auth.login.emailPlaceholder')}
            leftIcon={<Mail className="h-5 w-5" />}
            hint={t('auth.login.emailHint')}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsEmailDirty(true);
            }}
            error={emailError}
            disabled={step === 2 || isLoading}
          />
        </div>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            step === 2 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden p-1 -m-1">
            <div className="flex flex-col gap-2">
              <Input
                id="code"
                type="text"
                maxLength={7}
                label={t('auth.login.codeLabel')}
                placeholder={t('auth.login.codePlaceholder')}
                leftIcon={<Key className="h-5 w-5" />}
                value={formatDisplayCode(code)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(rawValue);
                }}
                error={codeError}
                disabled={isLoading}
              />
              
              <div className="text-right text-[13px] px-1">
                {timeLeft > 0 ? (
                  <span className="text-brand-gray dark:text-brand-gray/80">
                    {t('auth.login.resendCodeTimer')} <span className="font-medium text-brand-espresso dark:text-brand-cream">{formatTime(timeLeft)}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-brand-copper hover:text-brand-gold transition-colors font-medium outline-none disabled:opacity-50"
                  >
                    {t('auth.login.resendCode')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isEmailSyntacticallyValid || step === 2 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden p-1 -m-1">
            <Button 
              variant="brand" 
              type="submit" 
              isLoading={isLoading} 
              className="h-14 w-full text-lg shadow-lg shadow-brand-copper/20"
              disabled={emailError !== ''}
            >
              {step === 1 ? t('auth.login.continueBtn') : t('auth.login.verifyBtn')}
            </Button>
          </div>
        </div>

        <div className="p-1 -m-1 flex justify-center mt-2">
          <Checkbox 
            id="terms" 
            required
            label={
              <span className="text-brand-gray dark:text-brand-gray/80">
                {t('auth.login.termsPrefix')}
                <a href="#" className="text-brand-copper hover:text-brand-gold transition-colors hover:underline">
                  {t('auth.login.privacyPolicy')}
                </a> 
                {t('auth.login.and')}
                <a href="#" className="text-brand-copper hover:text-brand-gold transition-colors hover:underline">
                  {t('auth.login.terms')}
                </a>.
              </span>
            } 
          />
        </div>
      </form>

      <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-brand-gray/20 dark:before:border-brand-gray/20 after:mt-0.5 after:flex-1 after:border-t after:border-brand-gray/20 dark:after:border-brand-gray/20">
        <span className="mx-4 mb-0 text-center text-sm text-brand-gray dark:text-brand-gray/80">
          {t('auth.login.or')}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-1 -m-1">
        <Button 
          variant="outlineDark" 
          type="button" 
          className="w-full text-brand-espresso dark:text-brand-cream border-brand-gray/30 dark:border-brand-gray/50 hover:bg-brand-gray/10 dark:hover:bg-brand-gray/20"
          icon={<GoogleIcon className="h-5 w-5" />}
        >
          {t('auth.login.google')}
        </Button>
        <Button 
          variant="outlineDark" 
          type="button" 
          className="w-full text-brand-espresso dark:text-brand-cream border-brand-gray/30 dark:border-brand-gray/50 hover:bg-brand-gray/10 dark:hover:bg-brand-gray/20"
          icon={<AppleIcon className="h-5 w-5" />}
        >
          {t('auth.login.apple')}
        </Button>
      </div>
    </div>
  );
};