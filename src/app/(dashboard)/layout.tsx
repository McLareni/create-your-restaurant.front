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

  useEffect(() => {
    if (!isLoading && user === null) {
      useUserStore.getState().logout(); 
    }
    if (!isLoading && user && (!user.restaurants || user.restaurants.length === 0)) {
      router.push('/create-organization');
    }
  }, [isLoading, user, router]);

  if (isLoading || user === null || !user.restaurants || user.restaurants.length === 0) {
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