'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUserStore } from '@/shared/store/useUserStore';
import { Button } from '@/shared/ui';

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-main text-text-main p-6 transition-colors duration-300">
      <div className="w-full max-w-2xl rounded-3xl bg-bg-surface p-8 shadow-table border border-border-main/60 dark:border-border-main">
        <div className="flex items-center justify-between mb-8 border-b border-border-main/60 dark:border-border-main pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main">
            {t('dashboard.title')}
          </h1>
          <Button 
            variant="outline" 
            onClick={logout} 
            className="h-10 text-xs font-bold text-text-main border-border-main hover:bg-bg-element transition-all"
          >
            {t('dashboard.logoutBtn')}
          </Button>
        </div>
        
        <p className="mt-4 text-sm text-text-muted font-light leading-relaxed">
          {t('dashboard.successMessage')}
        </p>

        {user && (
          <div className="mt-6 rounded-xl bg-bg-element/50 p-5 border border-border-main/40 flex flex-col gap-2.5 text-sm text-text-main">
            <p><strong className="font-semibold text-text-muted mr-1">{t('dashboard.emailLabel')}:</strong> {user.email}</p>
            <p><strong className="font-semibold text-text-muted mr-1">{t('dashboard.roleLabel')}:</strong> {user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}