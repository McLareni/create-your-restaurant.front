'use client';

import { useMemo } from 'react';
import type { MouseEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUserStore } from '@/shared/store/useUserStore';
import { APP_ROUTES_CONFIG } from '@/shared/config/modules.config';

interface UseSidebarNavigationProps {
  purchasedModules: string[];
  activeModules: string[];
  permissions: string[];
  pathname: string;
  onLockClick: (moduleName: string, moduleKey: string) => void;
}

export const useSidebarNavigation = ({
  activeModules,
  permissions,
  pathname,
  onLockClick,
}: UseSidebarNavigationProps) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const isOwner = user?.role === 'OWNER';

  const menuGroups = useMemo(() => {
    const groupKeys: Array<'main' | 'catalog' | 'operations' | 'analytics' | 'system'> = [
      'main',
      'catalog',
      'operations',
      'analytics',
      'system',
    ];

    return groupKeys
      .map((groupKey) => {
        const items = APP_ROUTES_CONFIG.filter((route) => route.sidebarGroup === groupKey)
          .filter((route) => {
            if (isOwner) return true;
            if (route.ownerOnly) return false;
            if (route.permissionKey) return permissions.includes(route.permissionKey);
            return true;
          })
          .map((route) => {
            const title = t(route.titleKey);
            const isLocked = isOwner && route.moduleKey ? !activeModules.includes(route.moduleKey) : false;
            const isItemActive = route.basePath === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(route.basePath);

            let onClick: ((e: MouseEvent) => void) | undefined = undefined;

            if (isLocked && route.moduleKey) {
              onClick = (e: MouseEvent) => {
                e.preventDefault();
                onLockClick(title, route.moduleKey!);
              };
            } else if (isItemActive) {
              onClick = (e: MouseEvent) => {
                e.preventDefault();
              };
            }

            return {
              id: route.id,
              title,
              path: route.basePath,
              icon: route.icon,
              isLocked,
              onClick,
            };
          });

        return {
          id: groupKey,
          title: t(`sidebar.groups.${groupKey}`),
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [isOwner, permissions, activeModules, pathname, onLockClick, t]);

  return { menuGroups };
};