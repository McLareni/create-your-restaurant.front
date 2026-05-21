'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Додано usePathname для відстеження шляху
import { Sidebar } from './_components/sidebar';
import { useUserStore } from '@/shared/store/useUserStore';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, fetchUser, isLoading } = useUserStore();
  const router = useRouter();
  const pathname = usePathname(); // Отримуємо поточний URL браузера

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && user === null) {
      useUserStore.getState().logout(); 
    }
    // Перенаправляємо на створення організації ТІЛЬКИ якщо ресторанів 0 і ми ЩЕ НЕ ТАМ
    if (!isLoading && user && (!user.restaurants || user.restaurants.length === 0) && pathname !== '/create-organization') {
      router.push('/create-organization');
    }
  }, [isLoading, user, router, pathname]);

  // Якщо дані ще вантажаться або користувача немає — показуємо глобальний лоадер
  if (isLoading || user === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-cream dark:bg-brand-espresso transition-colors">
        <Loader2 className="h-10 w-10 animate-spin text-brand-copper" />
      </div>
    );
  }

  // КРИТИЧНЕ ВИПРАВЛЕННЯ: Якщо ресторанів 0, але користувач вже зайшов на сторінку створення,
  // ми дозволяємо відрендерити форму створення (children) БЕЗ блокування і без сайдбару
  if (!user.restaurants || user.restaurants.length === 0) {
    if (pathname === '/create-organization') {
      return <>{children}</>;
    }
    
    // Якщо користувач без ресторанів намагається зайти кудись інде — тримаємо лоадер, поки useEffect відправить його на сторінку створення
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-cream dark:bg-brand-espresso transition-colors">
        <Loader2 className="h-10 w-10 animate-spin text-brand-copper" />
      </div>
    );
  }

  // Звичайний режим: коли у користувача є хоча б 1 заклад, показуємо повний інтерфейс із сайдбаром
  return (
    <div className="flex h-screen overflow-hidden bg-brand-cream dark:bg-brand-espresso transition-colors">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}