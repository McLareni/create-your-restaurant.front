'use client';

import { Mail, Key, ArrowRight, RefreshCw, LogIn } from 'lucide-react';
import { Checkbox, GoogleIcon, AppleIcon } from '@/shared/ui';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

export const LoginForm = () => {
  const login = useLoginForm();

  return (
    <div className="w-full max-w-md rounded-2xl bg-brand-espresso/60 backdrop-blur-xl p-8 shadow-premium border border-white/8 transition-all duration-300">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-serif font-bold tracking-tight text-white">
          {login.t('auth.login.title')}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-white/70">
          {login.t('auth.login.subtitle')}
        </p>
      </div>

      <form action={login.handleFormAction} className="flex flex-col gap-5">
        {login.step === 1 ? (
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-semibold text-white/80 mb-1.5 px-0.5">
              {login.t('auth.login.emailLabel')}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-white/40" />
              <input
                id="email"
                type="email"
                value={login.email}
                onChange={login.handleEmailChange}
                placeholder={login.t('auth.login.emailPlaceholder')}
                disabled={login.isSubmitting}
                className="w-full h-11 pl-10 pr-3.5 bg-white/2 border border-white/8 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 rounded-xl transition-all text-sm outline-none text-white placeholder:text-white/30"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-white/50 px-0.5">
              {login.t('auth.login.emailHint')}
            </p>
            {login.emailError && (
              <span className="text-xs text-red-400 mt-1 px-0.5">{login.emailError}</span>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1 animate-fade-in">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <label htmlFor="code" className="text-xs font-semibold text-white/80">
                {login.t('auth.login.codeLabel')}
              </label>
              <span className="text-[11px] font-medium text-brand-gold">
                {login.email}
              </span>
            </div>
            <div className="relative flex items-center">
              <Key className="absolute left-3.5 h-4 w-4 text-white/40" />
              <input
                id="code"
                type="text"
                maxLength={6}
                value={login.code}
                onChange={login.handleCodeChange}
                placeholder={login.t('auth.login.codePlaceholder')}
                disabled={login.isSubmitting}
                className="w-full h-11 pl-10 pr-3.5 bg-white/2 border border-white/8 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 rounded-xl transition-all text-sm font-mono tracking-widest outline-none text-white placeholder:text-white/20"
              />
            </div>
            {login.codeError && (
              <span className="text-xs text-red-400 mt-1 px-0.5">{login.codeError}</span>
            )}
            
            <div className="mt-2 flex items-center justify-end text-[11px] text-white/50 px-0.5">
              <button
                type="button"
                onClick={login.handleResendCode}
                disabled={login.timeLeft > 0 || login.isSubmitting}
                className="text-brand-gold hover:text-brand-gold-hover font-semibold transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                {login.timeLeft > 0 
                  ? `${login.t('auth.login.resendCodeTimer')} ${login.formatTime(login.timeLeft)}` 
                  : login.t('auth.login.resendCode')}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={login.isSubmitting || (login.step === 1 && !login.isEmailSyntacticallyValid)}
          className="w-full h-11 text-xs font-bold tracking-wide text-brand-espresso bg-brand-gold hover:bg-brand-gold-hover active:scale-98 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/5 transition-all cursor-pointer border border-brand-gold/20 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {login.isSubmitting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : login.step === 1 ? (
            <>
              {login.t('auth.login.continueBtn')}
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              {login.t('auth.login.verifyBtn')}
              <LogIn className="h-4 w-4" />
            </>
          )}
        </button>

        {login.step === 1 && (
          <div className="px-0.5 mt-1">
            <Checkbox
              id="terms"
              name="terms"
              required
              className="text-white/60 border-white/10 bg-white/2 rounded-md focus:ring-brand-gold/30"
            >
              <span className="text-[11px] leading-snug text-white/60 block">
                {login.t('auth.login.termsPrefix')}
                <a href="/privacy" className="text-brand-gold hover:underline font-medium ml-1">
                  {login.t('auth.login.privacyPolicy')}
                </a>
                {login.t('auth.login.and')}
                <a href="/terms" className="text-brand-gold hover:underline font-medium ml-1">
                  {login.t('auth.login.terms')}
                </a>
              </span>
            </Checkbox>
          </div>
        )}
      </form>

      {login.step === 1 && (
        <>
          <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-white/6 after:mt-0.5 after:flex-1 after:border-t after:border-white/6">
            <span className="mx-3 text-center text-[11px] font-medium tracking-wide uppercase text-white/40">
              {login.t('auth.login.or')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={login.isSubmitting}
              className="h-11 px-4 text-xs font-semibold text-white bg-white/2 hover:bg-white/5 active:scale-98 border border-white/8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <GoogleIcon className="h-4 w-4" />
              <span>Google</span>
            </button>
            <button
              type="button"
              disabled={login.isSubmitting}
              className="h-11 px-4 text-xs font-semibold text-white bg-white/2 hover:bg-white/5 active:scale-98 border border-white/8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <AppleIcon className="h-4 w-4" />
              <span>Apple</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};