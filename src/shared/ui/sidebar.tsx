'use client';

import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useRestaurantStore } from '../store/useRestaurantStore';
import { useTranslation } from '../hooks/useTranslation';
import { Select } from './select';
import { Button } from './button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Utensils, Users, Plus, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { activeRestaurant, setActiveRestaurant } = useRestaurantStore();

  const restaurants = user?.restaurants || [];
  const canCreateMore = restaurants.length < 3;

  useEffect(() => {
    if (restaurants.length > 0 && !activeRestaurant) {
      setActiveRestaurant(restaurants[0]);
    }
  }, [restaurants, activeRestaurant, setActiveRestaurant]);

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = restaurants.find(r => r.id === Number(e.target.value));
    if (selected) {
      setActiveRestaurant(selected);
      router.refresh();
    }
  };

  const menuItems = [
    { name: t('sidebar.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('sidebar.menuBuilder'), href: '/dashboard/menu-builder', icon: Utensils },
    { name: t('sidebar.staff'), href: '/dashboard/staff', icon: Users },
  ];

  return (
    <aside className="w-64 bg-brand-espresso text-brand-cream flex flex-col h-screen border-r border-brand-copper/20 shrink-0">
      <div className="p-6 border-b border-brand-gray/20">
        <h2 className="text-2xl font-serif font-bold text-brand-copper tracking-wide">Gustio Admin</h2>
      </div>

      <div className="p-4 flex flex-col gap-2 border-b border-brand-gray/10">
        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">
          {t('sidebar.currentRestaurant')}
        </label>
        
        {restaurants.length > 0 ? (
          <Select
            id="restaurant-selector"
            value={activeRestaurant?.id || ''}
            onChange={handleRestaurantChange}
            className="bg-brand-mocha border-brand-gray/30 text-brand-cream h-9 text-xs"
          >
            {restaurants.map((res) => (
              <option key={res.id} value={res.id} className="bg-brand-espresso text-brand-cream">
                {res.name}
              </option>
            ))}
          </Select>
        ) : (
          <p className="text-xs text-brand-gray italic">{t('sidebar.noRestaurants')}</p>
        )}

        {canCreateMore ? (
          <Link href="/create-organization" className="w-full">
            <Button variant="outline" className="w-full h-8 text-[11px] gap-1.5 border-brand-copper/50 text-brand-copper hover:bg-brand-copper/10" icon={<Plus className="h-3 w-3" />}>
              {t('sidebar.addRestaurant')}
            </Button>
          </Link>
        ) : (
          <span className="text-[10px] text-center text-red-400 bg-red-500/10 py-1.5 px-2 rounded-lg border border-red-500/20 font-medium">
            {t('sidebar.limitReached')}
          </span>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-brand-copper text-brand-espresso font-bold shadow-md shadow-brand-copper/10' 
                  : 'text-brand-gray hover:bg-brand-mocha hover:text-brand-cream'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-brand-gray/20">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-brand-gray hover:text-red-400 hover:bg-red-500/5 h-10 rounded-xl text-sm gap-3 font-medium"
          icon={<LogOut className="h-4 w-4" />}
        >
          {t('sidebar.logout')}
        </Button>
      </div>
    </aside>
  );
};