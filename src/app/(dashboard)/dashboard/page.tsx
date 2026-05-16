'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUserStore } from '@/shared/store/useUserStore';
import { Button } from '@/shared/ui';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, isLoading, fetchUser, logout } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream text-brand-espresso p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl border border-brand-gray/20">
        <div className="flex items-center justify-between mb-8 border-b border-brand-gray/20 pb-6">
          <h1 className="text-3xl font-serif font-bold">
            {t('dashboard.title')}
          </h1>
          <Button 
            variant="outlineDark" 
            onClick={logout} 
            className="!text-brand-espresso !border-brand-espresso/20 hover:!bg-brand-espresso/5"
          >
            Вийти
          </Button>
        </div>
        
        <p className="mt-4 text-brand-gray">
          {t('dashboard.successMessage')}
        </p>

        {isLoading ? (
          <p className="mt-6 text-brand-copper font-medium animate-pulse">Завантаження профілю...</p>
        ) : user ? (
          <div className="mt-6 rounded-xl bg-brand-cream p-5 border border-brand-copper/20 flex flex-col gap-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Роль:</strong> {user.role}</p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-brand-gray/10 p-5 border border-brand-gray/20">
            <p className="text-brand-gray/80 text-sm">
              Дані користувача ще не підключені на бекенді (Очікується GET /users/me).
              Проте сесія активна і захищена.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}