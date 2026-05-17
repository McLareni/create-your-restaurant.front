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
  ChevronsUpDown, Plus, Lock, LogOut, Store, ChevronDown
} from 'lucide-react';

type SubMenuItem = {
  id: string;
  href: any;
  label: string;
};

type MenuItem = {
  id: string;
  href?: string;
  icon: React.ElementType;
  label: string;
  moduleKey?: string;
  highlight?: boolean;
  subItems?: SubMenuItem[];
};

export const Sidebar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const { hasModule, fetchAccessData } = useAccessStore(); 
  
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const currentOrgName = user?.restaurants?.[0]?.name || t('sidebar.orgSelector.current');
  const orgInitial = currentOrgName ? currentOrgName[0].toUpperCase() : 'G';

  useEffect(() => {
    fetchAccessData('mock-restaurant-id');
  }, [fetchAccessData]);

  const handleLockedClick = (e: React.MouseEvent, moduleName: string) => {
    e.preventDefault();
    alert(`${t('sidebar.locked.title')}:\n${t('sidebar.locked.description')} (${moduleName})`);
  };

  const toggleSubMenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuGroups: MenuItem[][] = [
    [
      { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, label: t('sidebar.nav.dashboard') },
      { id: 'analytics', href: '/dashboard/analytics', icon: BarChart3, label: t('sidebar.nav.analytics'), moduleKey: 'analytics' },
    ],
    [
      { id: 'live-calls', href: '/dashboard/live', icon: BellRing, label: t('sidebar.nav.liveCalls'), moduleKey: 'live-calls' },
      { 
        id: 'menu', 
        icon: UtensilsCrossed, 
        label: t('sidebar.nav.menu'), 
        moduleKey: 'menu-engine',
        subItems: [
          { id: 'menu-constructor', href: '/dashboard/menu-builder', label: t('sidebar.nav.menuConstructor') },
          { id: 'menu-inventory', href: '/dashboard/menu-inventory', label: t('sidebar.nav.menuInventory') },
          { id: 'menu-prices', href: '/dashboard/menu-builder#prices', label: t('sidebar.nav.menuPrices') },
        ]
      },
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
              {orgInitial}
            </div>
            <div className="flex flex-col items-start truncate">
              <span className="text-xs text-brand-gray font-medium uppercase tracking-wider">{t('sidebar.orgSelector.switch')}</span>
              <span className="truncate font-medium text-brand-cream">{currentOrgName}</span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-brand-gray shrink-0" />
        </button>

        {isOrgDropdownOpen && (
          <div className="absolute left-4 right-4 top-full z-50 mt-2 rounded-xl border border-brand-gray/20 bg-brand-mocha shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5">
                <Store className="h-5 w-5 text-brand-gray" />
                <span className="text-sm font-medium">{currentOrgName}</span>
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
              const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href));
              const Icon = item.icon;
              const isLocked = item.moduleKey && !hasModule(item.moduleKey);
              const isExpanded = expandedMenus[item.id];

              if (item.subItems) {
                return (
                  <div key={item.id} className="mb-1">
                    <button
                      onClick={(e) => isLocked ? handleLockedClick(e, item.label) : toggleSubMenu(item.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all outline-none ${
                        isLocked ? 'text-brand-gray opacity-60 hover:bg-white/5' :
                        isActive && !isExpanded ? 'bg-brand-copper text-white shadow-md' : 'text-brand-cream/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 shrink-0 ${isActive && !isExpanded && !isLocked ? 'text-white' : 'text-brand-gray'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    
                    <div className={`grid transition-all duration-200 ease-in-out ${isExpanded && !isLocked ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden flex flex-col gap-1">
                        {item.subItems.map(sub => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              className={`flex w-full items-center rounded-lg py-2 pl-11 pr-3 text-sm transition-colors outline-none ${
                                isSubActive 
                                  ? 'bg-white/10 text-white font-medium' 
                                  : 'text-brand-gray hover:bg-white/5 hover:text-brand-cream'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

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
                  href={item.href!}
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