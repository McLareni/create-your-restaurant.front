'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { useUserStore } from '@/shared/store/useUserStore';
import { useAccessStore } from '@/shared/store/useAccessStore';

interface HasAccessProps {
  permission?: string;
  ownerOnly?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export const HasAccess = ({ permission, ownerOnly, children, fallback = null }: HasAccessProps) => {
  const user = useUserStore((state) => state.user);
  const permissions = useAccessStore((state) => state.permissions);

  if (!user) return fallback;
  if (user.role === 'OWNER') return <>{children}</>;
  if (ownerOnly) return fallback;
  if (permission && !permissions.includes(permission)) return fallback;

  return <>{children}</>;
};