'use client';

import { ReactNode } from 'react';
import { useAccessStore } from '@/shared/store/useAccessStore';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({ permission, children, fallback = null }: PermissionGuardProps) => {
  const hasPermission = useAccessStore((state) => state.hasPermission(permission));
  const isLoadingAccess = useAccessStore((state) => state.isLoadingAccess);

  if (isLoadingAccess) return null;

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};