import { useTranslation } from '@/shared/hooks/useTranslation';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream text-brand-espresso">
      <h1 className="text-4xl font-serif font-bold">
        {t('dashboard.title')}
      </h1>
      <p className="mt-4 text-brand-gray">
        {t('dashboard.successMessage')}
      </p>
    </div>
  );
}