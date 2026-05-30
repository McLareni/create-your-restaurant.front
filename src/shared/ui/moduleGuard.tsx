'use client';

import { ReactNode } from 'react';
import { useAccessStore } from '@/shared/store/useAccessStore';

interface ModuleGuardProps {
  moduleKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ModuleGuard = ({ moduleKey, children, fallback = null }: ModuleGuardProps) => {
  const hasModule = useAccessStore((state) => state.hasModule);
  const isLoadingAccess = useAccessStore((state) => state.isLoadingAccess);

  if (isLoadingAccess) return null;

  if (hasModule(moduleKey)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};