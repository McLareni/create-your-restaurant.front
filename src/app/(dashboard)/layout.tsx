'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/shared/store/useUserStore';
import { Loader2 } from 'lucide-react';

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
      const hasOrganizations = false; 
      
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

  return <>{children}</>;
}