'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useUserStore } from '@/shared/store/useUserStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { 
  LayoutDashboard, BarChart3, BellRing, UtensilsCrossed, 
  QrCode, Users, ArrowRightLeft, FileClock, MessageSquareQuote, 
  Blocks, Palette, CreditCard, Moon, HelpCircle, ShieldAlert,
  ChevronsUpDown, Plus, Lock, LogOut, Store
} from 'lucide-react';

type MenuItem = {
  id: string;
  href: string;
  icon: React.ElementType;
  label: string;
  moduleKey?: string;
  highlight?: boolean;
};

export const Sidebar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const { hasModule, fetchAccessData } = useAccessStore(); 
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  useEffect(() => {
    fetchAccessData('mock-restaurant-id');
  }, [fetchAccessData]);

  const handleLockedClick = (e: React.MouseEvent, moduleName: string) => {
    e.preventDefault();
    alert(`${t('sidebar.locked.title')}:\n${t('sidebar.locked.description')} (${moduleName})`);
  };

  const menuGroups: MenuItem[][] = [
    [
      { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, label: t('sidebar.nav.dashboard') },
      { id: 'analytics', href: '/dashboard/analytics', icon: BarChart3, label: t('sidebar.nav.analytics'), moduleKey: 'analytics' },
    ],
    [
      { id: 'live-calls', href: '/dashboard/live', icon: BellRing, label: t('sidebar.nav.liveCalls'), moduleKey: 'live-calls' },
      { id: 'menu', href: '/dashboard/menu', icon: UtensilsCrossed, label: t('sidebar.nav.menuEngine'), moduleKey: 'menu-engine' },
      { id: 'qr', href: '/dashboard/qr', icon: QrCode, label: t('sidebar.nav.qrTables'), moduleKey: 'qr-tables' },
      { id: 'staff', href: '/dashboard/staff', icon: Users, label: t('sidebar.nav.staff'), moduleKey: 'staff' },
      { id: 'pos', href: '/dashboard/pos', icon: ArrowRightLeft, label: t('sidebar.nav.posSync'), moduleKey: 'pos-sync', highlight: true },
      { id: 'audit', href: '/dashboard/audit', icon: FileClock, label: t('sidebar.nav.auditLogs') },
      { id: 'feedback', href: '/dashboard/feedback', icon: MessageSquareQuote, label: t('sidebar.nav.feedback'), moduleKey: 'feedback', highlight: true },
    ],
    [
      { id: 'marketplace', href: '/dashboard/marketplace', icon: Blocks, label: t('sidebar.nav.marketplace') },
      { id: 'visual', href: '/dashboard/visual', icon: Palette, label: t('sidebar.nav.visual'), moduleKey: 'visual' },
      { id: 'billing', href: '/dashboard/billing', icon: CreditCard, label: t('sidebar.nav.billing') },
    ],
    [
      { id: 'theme', href: '#', icon: Moon, label: t('sidebar.nav.themeToggle') },
      { id: 'support', href: '/dashboard/support', icon: HelpCircle, label: t('sidebar.nav.support') },
      { id: 'legal', href: '/dashboard/legal', icon: ShieldAlert, label: t('sidebar.nav.legal') },
    ]
  ];

  return (
    <aside className="flex w-72 flex-col bg-brand-espresso text-brand-cream border-r border-brand-espresso shadow-2xl h-screen sticky top-0">
      <div className="relative p-4 border-b border-brand-gray/20">
        <button 
          onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
          className="flex w-full items-center justify-between rounded-xl bg-brand-mocha p-3 transition-colors hover:bg-brand-mocha/80 outline-none focus:ring-1 focus:ring-brand-copper"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-copper text-white font-serif text-lg font-bold">
              К
            </div>
            <div className="flex flex-col items-start truncate">
              <span className="text-xs text-brand-gray font-medium uppercase tracking-wider">{t('sidebar.orgSelector.switch')}</span>
              <span className="truncate font-medium text-brand-cream">{t('sidebar.orgSelector.current')}</span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-brand-gray shrink-0" />
        </button>

        {isOrgDropdownOpen && (
          <div className="absolute left-4 right-4 top-full z-50 mt-2 rounded-xl border border-brand-gray/20 bg-brand-mocha shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5">
                <Store className="h-5 w-5 text-brand-gray" />
                <span className="text-sm font-medium">{t('sidebar.orgSelector.current')}</span>
              </button>
            </div>
            <div className="border-t border-brand-gray/20 p-2">
              <Link 
                href="/create-organization"
                className="flex w-full items-center gap-2 rounded-lg p-2 text-brand-copper transition-colors hover:bg-brand-copper/10"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">{t('sidebar.orgSelector.addNew')}</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={`px-3 py-2 ${groupIdx !== menuGroups.length - 1 ? 'border-b border-brand-gray/10 mb-2' : ''}`}>
            {group.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isLocked = item.moduleKey && !hasModule(item.moduleKey);

              if (isLocked) {
                return (
                  <button
                    key={item.id}
                    onClick={(e) => handleLockedClick(e, item.label)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-brand-gray opacity-60 transition-colors hover:bg-white/5 mb-1 outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <Lock className="h-4 w-4" />
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1 outline-none ${
                    isActive 
                      ? 'bg-brand-copper text-white shadow-md' 
                      : 'text-brand-cream/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-brand-gold' : 'text-brand-gray'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold"></div>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-brand-gray/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gray/20 text-brand-cream font-medium">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-sm font-medium text-brand-cream">{user?.email || t('loading')}</span>
              <span className="text-xs text-brand-gray">{user?.role ? t(`roles.${user.role}`) : ''}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-brand-gray transition-colors hover:bg-red-500/10 hover:text-red-400 outline-none"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};