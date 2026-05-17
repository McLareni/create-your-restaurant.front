'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/shared/store/useUserStore';
import { Loader2 } from 'lucide-react';
import { Sidebar } from './_components/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
      return;
    }

    if (!isLoading && user) {
      // ПЕРЕВІРКА НА РЕАЛЬНИХ ДАНИХ:
      const hasOrganizations = user.restaurants && user.restaurants.length > 0;
      
      if (!hasOrganizations) {
        router.replace('/create-organization');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <Loader2 className="h-10 w-10 animate-spin text-brand-copper" />
      </div>
    );
  }

  // Якщо юзер є, але ще не має ресторанів, ми не рендеримо дашборд, 
  // поки йде редірект на /create-organization
  if (!user.restaurants || user.restaurants.length === 0) {
    return null; 
  }

  return (
    <div className="flex min-h-screen bg-brand-cream">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}