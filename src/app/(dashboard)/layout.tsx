'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/widgets/sidebar/components/sidebar';
import { useUserStore } from '@/shared/store/useUserStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { Loader2, ShieldAlert } from 'lucide-react';
import { ResponsiveGuard } from '@/shared/ui/responsiveGuard';
import { SecurityProvider } from '@/shared/providers/securityProvider';
import { Button } from '@/shared/ui';
import { APP_ROUTES_CONFIG } from '@/shared/config/modules.config';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { AppRouteConfig } from '@/shared/config/modules.config';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const isLoadingUser = useUserStore((state) => state.isLoading);
  const permissions = useAccessStore((state) => state.permissions);
  const isLoadingAccess = useAccessStore((state) => state.isLoadingAccess);
  const router = useRouter();
  const pathname = usePathname();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchUser();
    }
  }, [fetchUser]);

  useEffect(() => {
    if (isLoadingUser) return;
    if (user === null) {
      router.push('/login');
      return;
    }
    const hasNoRestaurants = !user.restaurants || user.restaurants.length === 0;
    if (hasNoRestaurants && pathname !== '/create-organization') {
      router.push('/create-organization');
    }
  }, [isLoadingUser, user, router, pathname]);

  const hasPageAccess = useMemo(() => {
    if (!user) return false;
    if (user.role === 'OWNER') return true;

    const matchedRoute = APP_ROUTES_CONFIG.find((route: AppRouteConfig) => {
      if (route.basePath === '/dashboard') {
        return pathname === '/dashboard';
      }
      const isBaseMatch = pathname.startsWith(route.basePath);
      const isExtraMatch = route.extraPaths?.some((extra: string) =>
        pathname.startsWith(extra),
      );
      return isBaseMatch || isExtraMatch;
    });

    if (!matchedRoute) return true;
    if (matchedRoute.ownerOnly) return false;
    
    if (matchedRoute.permissionKey) {
      return permissions.includes(matchedRoute.permissionKey);
    }
    
    return true;
  }, [user, pathname, permissions]);

  if (isLoadingUser || user === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-cream dark:bg-brand-espresso transition-colors">
        <Loader2 className="h-10 w-10 animate-spin text-brand-copper" />
      </div>
    );
  }

  if (!user.restaurants || user.restaurants.length === 0) {
    if (pathname === '/create-organization') {
      return (
        <SecurityProvider>
          <ResponsiveGuard />
          {children}
        </SecurityProvider>
      );
    }
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-cream dark:bg-brand-espresso transition-colors">
        <Loader2 className="h-10 w-10 animate-spin text-brand-copper" />
      </div>
    );
  }

  return (
    <SecurityProvider>
      <ResponsiveGuard />
      <div className="flex h-screen overflow-hidden bg-brand-cream dark:bg-brand-espresso transition-colors">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {isLoadingAccess ? (
            <div className="flex h-full items-center justify-center bg-brand-cream dark:bg-brand-espresso transition-colors">
              <Loader2 className="h-10 w-10 animate-spin text-brand-emerald" />
            </div>
          ) : hasPageAccess ? (
            children
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center select-none animate-fade-in bg-bg-main">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-red-500/10 text-red-500 shadow-sm">
                <ShieldAlert className="h-10 w-10" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-text-main tracking-tight">
                {t('sidebar.locked.title')}
              </h1>
              <p className="mb-8 max-w-sm text-xs text-text-muted font-light leading-relaxed">
                {t('sidebar.locked.description')}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="px-6 h-10 text-xs rounded-xl shadow-sm"
              >
                {t('notFound.backButton')}
              </Button>
            </div>
          )}
        </main>
      </div>
    </SecurityProvider>
  );
}