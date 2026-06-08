'use client';

import { Mail, Key, Loader2 } from 'lucide-react';
import { Input, Button, Checkbox, GoogleIcon, AppleIcon } from '@/shared/ui';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

export const LoginForm = () => {
  const login = useLoginForm();

  return (
    <div className="w-full max-w-md rounded-3xl bg-white dark:bg-brand-mocha p-8 shadow-2xl border border-brand-gray/20 dark:border-brand-gray/20 transition-colors"> 
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-[32px] font-serif font-medium leading-tight text-brand-espresso dark:text-brand-cream">
          {login.t('auth.login.title')}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray dark:text-brand-gray/80">
          {login.t('auth.login.subtitle')}
        </p>
      </div>

      <form action={login.handleFormAction} className="flex flex-col gap-5">
        <div className="p-1 -m-1">
          <Input
            id="email"
            type="email"
            label={login.t('auth.login.emailLabel')}
            placeholder={login.t('auth.login.emailPlaceholder')}
            leftIcon={<Mail className="h-5 w-5" />}
            hint={login.t('auth.login.emailHint')}
            value={login.email}
            onChange={login.handleEmailChange}
            error={login.emailError}
            disabled={login.isSubmitting || login.step === 2}
            autoComplete="email"
            required
          />
        </div>

        {login.step === 2 && (
          <div className="p-1 -m-1 flex flex-col gap-2">
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9\s]*"
              label={login.t('auth.login.codeLabel')}
              placeholder={login.t('auth.login.codePlaceholder')}
              leftIcon={<Key className="h-5 w-5" />}
              value={login.formatDisplayCode(login.code)}
              onChange={login.handleCodeChange}
              error={login.codeError}
              disabled={login.isSubmitting}
              autoComplete="one-time-code"
              maxLength={7}
              required
            />
            
            <div className="text-right text-[13px] px-1">
              {login.timeLeft > 0 ? (
                <span className="text-brand-gray dark:text-brand-gray/80">
                  {login.t('auth.login.resendCodeTimer')} <span className="font-medium text-brand-espresso dark:text-brand-cream">{login.formatTime(login.timeLeft)}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={login.handleResendCode}
                  disabled={login.isSubmitting}
                  className="text-brand-copper hover:text-brand-gold transition-colors font-medium outline-none disabled:opacity-50 cursor-pointer"
                >
                  {login.t('auth.login.resendCode')}
                </button>
              )}
            </div>
          </div>
        )}

        <div className={login.isEmailSyntacticallyValid || login.step === 2 ? 'block' : 'hidden'}>
          <div className="p-1 -m-1">
            <Button 
              variant="brand" 
              type="submit" 
              isLoading={login.isSubmitting} 
              className="h-14 w-full text-lg shadow-lg shadow-brand-copper/20"
              disabled={login.emailError !== ''}
            >
              {login.step === 1 ? login.t('auth.login.continueBtn') : login.t('auth.login.verifyBtn')}
            </Button>
          </div>
        </div>

        <div className="p-1 -m-1 flex justify-center mt-2">
          <Checkbox 
            id="terms" 
            required
            disabled={login.isSubmitting}
          >
            <span className="text-brand-gray dark:text-brand-gray/80">
              {login.t('auth.login.termsPrefix')}
              <a href="#" className="text-brand-copper hover:text-brand-gold transition-colors hover:underline">
                {login.t('auth.login.privacyPolicy')}
              </a> 
              {login.t('auth.login.and')}
              <a href="#" className="text-brand-copper hover:text-brand-gold transition-colors hover:underline">
                {login.t('auth.login.terms')}
              </a>.
            </span>
          </Checkbox>
        </div>
      </form>

      <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-brand-gray/20 dark:before:border-brand-gray/20 after:mt-0.5 after:flex-1 after:border-t after:border-brand-gray/20 dark:after:border-brand-gray/20">
        <span className="mx-4 mb-0 text-center text-sm text-brand-gray dark:text-brand-gray/80">
          {login.t('auth.login.or')}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-1 -m-1">
        <Button 
          variant="outlineDark" 
          type="button" 
          className="w-full text-brand-espresso dark:text-brand-cream border-brand-gray/30 dark:border-brand-gray/50 hover:bg-brand-gray/10 dark:hover:bg-brand-gray/20"
          icon={<GoogleIcon className="h-5 w-5" />}
          disabled={login.isSubmitting}
        >
          {login.t('auth.login.google')}
        </Button>
        <Button 
          variant="outlineDark" 
          type="button" 
          className="w-full text-brand-espresso dark:text-brand-cream border-brand-gray/30 dark:border-brand-gray/50 hover:bg-brand-gray/10 dark:hover:bg-brand-gray/20"
          icon={<AppleIcon className="h-5 w-5" />}
          disabled={login.isSubmitting}
        >
          {login.t('auth.login.apple')}
        </Button>
      </div>
    </div>
  );
};