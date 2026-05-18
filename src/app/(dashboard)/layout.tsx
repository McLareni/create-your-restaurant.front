'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ДОДАНО: Захист від нескінченного спінера. 
  // Якщо запит завершився (!isLoading), а юзера немає — робимо логаут і чистимо куки
  useEffect(() => {
    if (!isLoading && user === null) {
      useUserStore.getState().logout(); 
    }
  }, [isLoading, user]);

  if (isLoading || user === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-cream dark:bg-brand-espresso transition-colors">
        <Loader2 className="h-10 w-10 animate-spin text-brand-copper" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-cream dark:bg-brand-espresso transition-colors">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}