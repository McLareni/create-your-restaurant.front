'use client';

import Image from 'next/image';
import { useUserStore } from '@/shared/store/useUserStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Card } from '@/shared/ui';
import { User as UserIcon, Mail, Phone } from 'lucide-react';
import type { UserProfileDto } from './types/profile.types';

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user) as UserProfileDto | null;
  const logout = useUserStore((state) => state.logout);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-12 text-text-muted font-medium animate-pulse">
        {t('actions.loading')}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-bg-main p-6 transition-colors duration-300">
      <div className="mb-8 border-b border-border-main pb-5">
        <h1 className="text-3xl font-serif font-bold text-text-main flex items-center gap-3">
          <div className="p-2 bg-brand-copper/10 rounded-xl text-brand-copper">
            <UserIcon className="h-7 w-7" />
          </div>
          {t('profile.title')}
        </h1>
        <p className="mt-2 text-sm text-text-muted max-w-2xl leading-relaxed">
          {t('profile.description')}
        </p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-6 bg-bg-surface border border-border-main rounded-2xl shadow-md flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative h-28 w-28 rounded-full bg-bg-main border border-border-main flex items-center justify-center overflow-hidden shadow-inner shrink-0">
            {user.photo ? (
              <Image 
                src={user.photo} 
                alt={t('profile.avatarAlt')} 
                fill
                sizes="112px"
                className="object-cover" 
              />
            ) : (
              <UserIcon className="h-14 w-14 text-text-muted/40" />
            )}
          </div>

          <div className="flex-1 w-full space-y-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-text-main text-center md:text-left">
                {user.firstName || user.lastName ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : t('profile.defaultUser')}
              </h2>
              <span className="inline-block mt-1 px-3 py-1 bg-brand-copper/10 text-brand-copper text-xs font-bold rounded-full uppercase tracking-wider">
                {user.role === 'OWNER' ? t('profile.roleOwner') : t('profile.roleStaff')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-main">
              <div className="flex items-center gap-3 text-sm text-text-main">
                <Mail className="h-4 w-4 text-brand-copper shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-text-main">
                <Phone className="h-4 w-4 text-brand-copper shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">{t('profile.phoneLabel')}</span>
                  <span className="font-medium">{user.phone || '—'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={logout} className="h-10 text-xs font-bold text-red-500! hover:bg-red-500/10 border-red-500/20!" >
                {t('profile.logoutBtn')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}