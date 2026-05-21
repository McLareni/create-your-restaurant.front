import { LoginForm } from '@/features/auth';
import { useTranslation } from '@/shared/hooks/useTranslation';
import Image from 'next/image';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen w-full bg-brand-espresso selection:bg-brand-copper selection:text-white">
      
      <div className="relative hidden w-1/2 lg:flex flex-col justify-center p-16 text-brand-cream">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop"
            alt={t('hero.imageAlt')}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover opacity-40 grayscale-20" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-brand-espresso via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-xl whitespace-pre-line">
          <h1 className="mb-10 text-6xl font-serif font-bold tracking-tight">
            {t('hero.logo')}
          </h1>
          <h2 className="mb-6 text-[3.5rem] font-serif leading-[1.1]">
            {t('hero.title')}
          </h2>
          <p className="text-xl font-medium text-brand-gray">
            {t('hero.description')}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}