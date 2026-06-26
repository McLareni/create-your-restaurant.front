import { LoginForm } from '@/features/auth';
import { useTranslation } from '@/shared/hooks/useTranslation';
import Image from 'next/image';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen w-full bg-brand-espresso selection:bg-brand-emerald selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop"
          alt="Gustio Restaurant Background"
          fill
          priority
          className="object-cover opacity-20 scale-105 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-radial-to-r from-transparent via-brand-espresso/50 to-brand-espresso" />
        <div className="absolute inset-0 bg-linear-to-l from-brand-espresso via-brand-espresso/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#00A46C_1px,transparent_1px)] bg-size-[32px_32px]" />
      </div>

      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        
        <div className="hidden lg:flex w-1/2 flex-col justify-center p-16 text-brand-cream min-h-screen relative">
          <div className="max-w-xl">
            <h2 className="mb-6 text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-white whitespace-pre-line">
              {t('auth.login.title')}
            </h2>
            <p className="text-base text-brand-gray/90 leading-relaxed font-light max-w-md">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <div className="absolute bottom-16 left-16 right-16 border-t border-white/10 pt-6 flex gap-6 text-xs text-brand-gray/80 font-medium">
            <span className="text-white/60">&copy; {new Date().getFullYear()} Gustio Platform</span>
            <a href="/terms" className="text-brand-emerald hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="text-brand-emerald hover:text-white transition-colors">Privacy</a>
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 xl:px-24 min-h-screen">
          <LoginForm />
          
          <div className="flex lg:hidden items-center justify-center gap-5 text-xs text-brand-gray/80 font-medium pt-8">
            <span className="text-white/60">&copy; {new Date().getFullYear()} Gustio</span>
            <a href="/terms" className="text-brand-emerald hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="text-brand-emerald hover:text-white transition-colors">Privacy</a>
          </div>
        </div>

      </div>
    </div>
  );
}