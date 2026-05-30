'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './_components/sidebar';
import { useUserStore } from '@/shared/store/useUserStore';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const isLoading = useUserStore((state) => state.isLoading);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && user === null) {
      useUserStore.getState().logout(); 
    }
    if (!isLoading && user && (!user.restaurants || user.restaurants.length === 0) && pathname !== '/create-organization') {
      router.push('/create-organization');
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading || user === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-cream dark:bg-brand-espresso transition-colors">
        <Loader2 className="h-10 w-10 animate-spin text-brand-copper" />
      </div>
    );
  }

  if (!user.restaurants || user.restaurants.length === 0) {
    if (pathname === '/create-organization') {
      return <>{children}</>;
    }
    
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