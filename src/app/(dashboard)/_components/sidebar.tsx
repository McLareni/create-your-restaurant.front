'use client';

import React, { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useSidebarLogic } from '@/app/(dashboard)/_components/hooks/useSidebar';
import { Button, Modal } from '@/shared/ui';
import { 
  ChevronDown, LogOut, Plus, Trash2, 
  Lock, AlertTriangle, Sun, Moon, GripVertical
} from 'lucide-react';

interface SidebarNavigationItem {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  isLocked: boolean;
  onClick?: (e: MouseEvent) => void;
}

interface SidebarNavigationGroup {
  id: string;
  title: string;
  items: SidebarNavigationItem[];
}

export const Sidebar = () => {
  const sidebar = useSidebarLogic();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const menuGroups = sidebar.menuGroups as SidebarNavigationGroup[];

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        setMounted(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <aside className="w-64 h-full bg-bg-surface border-r border-solid border-border-main flex flex-col justify-between shrink-0 select-none z-30">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-4 relative shrink-0">
          <div 
            onClick={() => sidebar.setIsOrgDropdownOpen(!sidebar.isOrgDropdownOpen)}
            className="flex items-center justify-between p-2.5 rounded-md bg-bg-element border border-solid border-border-main/60 text-text-main cursor-pointer hover:bg-bg-hover shadow-2xs transition-all duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-md bg-brand-emerald text-white flex items-center justify-center font-bold text-sm shrink-0">
                {sidebar.activeRestaurant?.imageUrl ? (
                  <div className="relative h-full w-full rounded-lg overflow-hidden">
                    <Image 
                      src={sidebar.activeRestaurant.imageUrl} 
                      alt="restaurant logo" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                ) : (
                  sidebar.orgInitial
                )}
              </div>
              <span className="text-xs font-bold truncate tracking-wide">
                {sidebar.currentOrgName}
              </span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 shrink-0 ml-1 ${sidebar.isOrgDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {sidebar.isOrgDropdownOpen && (
            <div className="absolute top-full left-4 right-4 mt-1 bg-bg-surface border border-solid border-border-main rounded-md shadow-lg flex flex-col p-1.5 z-50 h-auto animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted block">
                  {sidebar.t('sidebar.orgSelector.switch')}
                </span>
                <span className="text-[10px] text-text-muted/70 font-mono normal-case">
                  {sidebar.restaurants.length} / {sidebar.maxAllowed}
                </span>
              </div>
              
              <div className="flex flex-col gap-0.5 mt-1 max-h-48 overflow-y-auto custom-scrollbar">
                {sidebar.restaurants.map((res, index) => {
                  const isLocked = index >= sidebar.maxAllowed;
                  const isCurrent = sidebar.activeRestaurant && String(sidebar.activeRestaurant.id) === String(res.id);
                  
                  return (
                    <div 
                      key={res.id}
                      draggable={true}
                      onDragStart={() => sidebar.handleDragStart(index)}
                      onDragOver={sidebar.handleDragOver}
                      onDrop={() => sidebar.handleDrop(index)}
                      className={`flex items-center justify-between p-1.5 rounded-md transition-all duration-200 cursor-grab active:cursor-grabbing ${
                        isCurrent && !isLocked
                          ? 'bg-brand-emerald/10 text-brand-emerald font-bold' 
                          : 'hover:bg-bg-hover text-text-main font-medium'
                      } ${isLocked ? 'opacity-55 hover:opacity-100' : ''}`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 pl-1" onClick={(e) => sidebar.handleRestaurantSwitch(e, res, isLocked)}>
                        <GripVertical className="h-3.5 w-3.5 text-text-muted/40 shrink-0 hover:text-text-muted" />
                        <div className={`h-6 w-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${isCurrent && !isLocked ? 'bg-brand-emerald text-white' : 'bg-bg-element text-text-muted'}`}>
                          {res.imageUrl ? (
                            <div className="relative h-full w-full rounded-md overflow-hidden">
                              <Image src={res.imageUrl} alt="logo" fill className="object-cover" />
                            </div>
                          ) : (
                            res.name ? res.name[0].toUpperCase() : 'R'
                          )}
                        </div>
                        <span className="text-xs truncate cursor-pointer">{res.name}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {isLocked && <Lock className="h-3 w-3 text-text-muted" />}
                        {sidebar.restaurants.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => sidebar.handleDeleteRestaurantClick(e, res)}
                            className="p-1.5 text-text-muted hover:text-red-500 rounded-md hover:bg-bg-element border-0 bg-transparent cursor-pointer transition-colors duration-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-solid border-border-main/60 mt-2 pt-1.5">
                {sidebar.restaurants.length >= sidebar.maxAllowed ? (
                  <div className="mx-1 my-1 p-2 bg-amber-500/10 border border-solid border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-md text-[11px] leading-normal font-medium flex gap-2 items-start">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{sidebar.t('sidebar.limitReached')}</span>
                  </div>
                ) : (
                  <Link 
                    href="/create-organization"
                    onClick={() => sidebar.setIsOrgDropdownOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-md text-brand-emerald hover:bg-brand-emerald/5 font-bold text-xs transition-colors duration-200"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{sidebar.t('sidebar.orgSelector.addNew')}</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-4">
          {menuGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-0.5 border-b border-solid border-border-main/40 last:border-b-0 pb-3 last:pb-0">
              {group.items.map((item) => {
                const itemIcon = React.createElement(item.icon, { className: 'h-4 w-4 shrink-0' });
                const isItemActive = item.path === '/dashboard'
                  ? sidebar.pathname === '/dashboard'
                  : sidebar.pathname.startsWith(item.path);

                return (
                  <div key={item.id} className="flex flex-col gap-0.5">
                    {item.isLocked ? (
                      <div
                        onClick={item.onClick}
                        className="flex items-center justify-between p-2.5 rounded-md text-xs font-semibold transition-all duration-200 relative cursor-pointer text-text-muted hover:bg-bg-hover hover:text-text-main opacity-60"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {itemIcon}
                          <span className="truncate">{item.title}</span>
                        </div>
                        <Lock className="h-3 w-3 opacity-40 shrink-0" />
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={item.onClick}
                        className={`flex items-center justify-between p-2.5 rounded-md text-xs font-semibold transition-all duration-200 relative ${
                          isItemActive
                            ? 'bg-brand-emerald/10 text-brand-emerald font-bold'
                            : 'text-text-muted hover:bg-bg-hover hover:text-text-main'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {itemIcon}
                          <span className="truncate">{item.title}</span>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-solid border-border-main/60 bg-bg-main/20 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-3 min-w-0 p-1">
          <Link 
            href="/dashboard/profile"
            className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85 transition-opacity"
          >
            <div className="h-8 w-8 rounded-full bg-bg-element flex items-center justify-center font-bold text-xs text-text-muted border border-solid border-border-main overflow-hidden shrink-0">
              {sidebar.user?.photo ? (
                <div className="relative h-full w-full">
                  <Image src={sidebar.user.photo} alt="avatar" fill className="object-cover" />
                </div>
              ) : (
                sidebar.orgInitial
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-text-main truncate">
                {sidebar.user?.firstName || sidebar.user?.email.split('@')[0]}
              </span>
              <span className="text-[10px] text-text-muted truncate font-medium">
                {sidebar.user?.role === 'OWNER' ? sidebar.t('profile.roleOwner') : sidebar.t('profile.roleStaff')}
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-1">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2 rounded-lg text-text-muted hover:bg-bg-element transition-colors duration-200 border-0 bg-transparent cursor-pointer shrink-0"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={sidebar.logout}
              className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-colors duration-200 border-0 bg-transparent cursor-pointer shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={sidebar.isLockModalOpen} 
        onClose={() => sidebar.setIsLockModalOpen(false)}
        title={sidebar.t('sidebar.locked.title')}
      >
        <div className="flex flex-col gap-5">
          <p className="text-xs text-text-muted leading-relaxed font-light">
            {sidebar.t('sidebar.locked.description')}
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-solid border-border-main">
            <Button variant="ghost" onClick={() => sidebar.setIsLockModalOpen(false)} className="h-10 text-xs">
              {sidebar.t('confirmModal.cancel')}
            </Button>
            <Button variant="brand" className="h-10 text-xs px-5" onClick={sidebar.handleActivateLocked}>
              {sidebar.t('sidebar.locked.activateBtn')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!sidebar.restaurantToDelete}
        onClose={() => sidebar.setRestaurantToDelete(null)}
        title={sidebar.t('sidebar.orgSelector.delete')}
      >
        <div className="flex flex-col gap-5">
          <div className="bg-red-500/5 border border-solid border-red-500/10 p-3.5 rounded-lg flex gap-3 text-xs leading-relaxed text-red-600 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              {sidebar.t('sidebar.orgSelector.deleteConfirm')}<br />
              <span className="font-bold text-red-700">{sidebar.restaurantToDelete?.name}</span>
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-solid border-border-main">
            <Button variant="ghost" onClick={() => sidebar.setRestaurantToDelete(null)} className="h-10 text-xs" disabled={sidebar.isDeleting}>
              {sidebar.t('confirmModal.cancel')}
            </Button>
            <Button variant="brand" className="h-10 text-xs px-5 bg-red-500 hover:bg-red-600 text-white" onClick={sidebar.handleConfirmDeleteRestaurant} isLoading={sidebar.isDeleting}>
              {sidebar.t('actions.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </aside>
  );
};