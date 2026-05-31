'use client';

import { ReactNode } from 'react';
import { useAccessStore } from '@/shared/store/useAccessStore';

interface ModuleGuardProps {
  moduleKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ModuleGuard = ({ moduleKey, children, fallback = null }: ModuleGuardProps) => {
  const isModuleActive = useAccessStore((state) => state.activeModules.includes(moduleKey));
  const isLoadingAccess = useAccessStore((state) => state.isLoadingAccess);

  if (isLoadingAccess) return null;

  if (isModuleActive) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};