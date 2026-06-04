'use client';

import Link from 'next/link';
import { Modal, Button, ConfirmModal } from '@/shared/ui';
import { ChevronsUpDown, Plus, Lock, LogOut, Store, ChevronDown, Trash2 } from 'lucide-react';
import { useSidebarLogic } from './hooks/useSidebar';

export const Sidebar = () => {
  const board = useSidebarLogic();

  return (
    <aside className="flex w-72 flex-col bg-bg-main text-text-main border-r border-border-main h-screen sticky top-0 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) z-30">
      
      <div className="relative p-4 border-b border-border-main">
        <button 
          onClick={() => board.setIsOrgDropdownOpen(!board.isOrgDropdownOpen)} 
          className="flex w-full items-center justify-between rounded-xl bg-bg-surface p-3 border border-border-main transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) hover:border-brand-copper/30 shadow-xs outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-copper text-white font-serif text-base font-bold shadow-sm transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) hover:scale-105">
              {board.orgInitial}
            </div>
            <div className="flex flex-col items-start truncate">
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                {board.t('sidebar.orgSelector.switch')}
              </span>
              <span className="truncate text-sm font-semibold tracking-tight">
                {board.currentOrgName}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-text-muted shrink-0" />
        </button>

        <div className={`absolute left-4 right-4 top-full z-50 mt-2 rounded-xl border border-border-main bg-bg-surface shadow-xl max-h-64 overflow-y-auto custom-scrollbar transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
          board.isOrgDropdownOpen 
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}>
          <div className="p-1.5 flex flex-col gap-1">
            {board.restaurants.map((res) => (
              <div 
                key={res.id} 
                className={`flex w-full items-center justify-between rounded-lg p-1 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
                  board.activeRestaurant?.id === res.id ? 'bg-bg-hover border border-brand-copper/20' : 'border border-transparent hover:bg-bg-hover/40'
                }`}
              >
                <button 
                  onClick={() => board.handleRestaurantSwitch(res)} 
                  className={`flex flex-1 items-center gap-2.5 p-1.5 text-left overflow-hidden cursor-pointer text-sm font-medium transition-colors duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
                    board.activeRestaurant?.id === res.id ? 'text-brand-copper font-bold' : 'text-text-main/90'
                  }`}
                >
                  <Store className="h-4 w-4 text-text-muted shrink-0" />
                  <span className="truncate">{res.name}</span>
                </button>
                <button 
                  onClick={(e) => board.handleDeleteRestaurantClick(e, res)} 
                  className="p-1.5 text-text-muted hover:text-red-500 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) rounded-md hover:bg-red-500/10 shrink-0 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-border-main p-1.5 sticky bottom-0 bg-bg-surface">
            {board.restaurants.length < 3 ? (
              <Link 
                href="/create-organization" 
                onClick={() => board.setIsOrgDropdownOpen(false)} 
                className="flex w-full items-center gap-2 rounded-lg p-2 text-brand-copper text-sm font-semibold transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) hover:bg-brand-copper/10"
              >
                <Plus className="h-4 w-4" />
                <span>{board.t('sidebar.orgSelector.addNew')}</span>
              </Link>
            ) : (
              <div className="text-[10px] text-center text-red-500 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/10 font-medium mx-1 select-none">
                {board.t('sidebar.limitReached')}
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar flex flex-col gap-0.5">
        {board.menuGroups.map((group, groupIdx) => {
          const renderedGroup = group.filter(item => !item.moduleKey || board.isPurchased(item.moduleKey));
          if (renderedGroup.length === 0) return null;
          
          return (
            <div key={groupIdx} className={`flex flex-col gap-0.5 ${groupIdx !== board.menuGroups.length - 1 ? 'border-b border-border-main pb-2 mb-2' : ''}`}>
              {renderedGroup.map((item) => {
                const isActive = board.pathname === item.href || (item.subItems && item.subItems.some(sub => board.pathname === sub.href));
                const Icon = item.icon;
                const isLocked = item.moduleKey && !board.hasModule(item.moduleKey);
                const isExpanded = board.expandedMenus[item.id];

                if (item.subItems) {
                  return (
                    <div key={item.id} className="flex flex-col">
                      <button 
                        onClick={(e) => isLocked ? board.handleLockedClick(e, item.label, item.moduleKey!) : board.toggleSubMenu(item.id)} 
                        className={`flex w-full items-center justify-between rounded-xl px-3 h-11 text-sm font-medium transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) outline-none cursor-pointer ${
                          isLocked 
                            ? 'opacity-30 hover:bg-bg-hover' 
                            : isActive && !isExpanded 
                              ? 'bg-brand-copper text-white shadow-md font-semibold' 
                              : 'hover:bg-bg-hover text-text-main/80 hover:text-text-main'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 shrink-0 ${isActive && !isExpanded && !isLocked ? 'text-white' : 'text-text-muted'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isLocked ? <Lock className="h-3.5 w-3.5 text-text-muted/60" /> : <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isExpanded ? 'rotate-180' : ''}`} />}
                      </button>
                      
                      <div className={`grid transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isExpanded && !isLocked ? 'grid-rows-[1fr] opacity-100 mt-0.5' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden flex flex-col gap-0.5 pl-4 border-l border-border-main ml-5">
                          {item.subItems.map(sub => (
                            <Link 
                              key={sub.id} 
                              href={sub.href} 
                              className={`flex w-full items-center rounded-lg h-8 pl-4 pr-2 text-xs font-medium transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) outline-none ${
                                board.pathname === sub.href 
                                  ? 'text-brand-copper font-bold bg-bg-hover' 
                                  : 'text-text-muted hover:text-text-main hover:bg-bg-hover/50'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (isLocked) {
                  return (
                    <button 
                      key={item.id} 
                      onClick={(e) => board.handleLockedClick(e, item.label, item.moduleKey!)} 
                      className="flex w-full items-center justify-between rounded-xl px-3 h-11 text-sm font-medium opacity-30 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) hover:bg-bg-hover outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-text-muted" />
                        <span>{item.label}</span>
                      </div>
                      <Lock className="h-3.5 w-3.5 text-text-muted/60" />
                    </button>
                  );
                }

                if (item.onClick) {
                  return (
                    <button 
                      key={item.id} 
                      onClick={item.onClick} 
                      className="flex w-full items-center justify-between rounded-xl px-3 h-11 text-sm font-medium transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) outline-none text-text-main/80 hover:bg-bg-hover hover:text-text-main cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0 text-text-muted" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                }

                return (
                  <Link 
                    key={item.id} 
                    href={item.href!} 
                    className={`flex w-full items-center justify-between rounded-xl px-3 h-11 text-sm font-medium transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) outline-none ${
                      isActive 
                        ? 'bg-brand-copper text-white shadow-md font-semibold' 
                        : 'text-text-main/80 hover:bg-bg-hover hover:text-text-main'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-brand-gold' : 'text-text-muted'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.highlight && !isActive && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold animate-pulse"></div>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border-main p-4 bg-bg-main transition-colors duration-300 cubic-bezier(0.4, 0, 0.2, 1)">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg-surface border border-border-main text-text-main text-sm font-semibold shadow-xs">
              {board.user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-xs font-semibold tracking-tight text-text-main">
                {board.user?.email || board.t('loading')}
              </span>
              <span className="text-[10px] text-text-muted font-medium">
                {board.user?.role ? board.t(`roles.${board.user.role}`) : ''}
              </span>
            </div>
          </div>
          <button 
            onClick={board.logout} 
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-text-muted transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) hover:bg-red-500/10 hover:text-red-500 outline-none cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Modal isOpen={board.isLockModalOpen} onClose={() => board.setIsLockModalOpen(false)} title={board.t('sidebar.locked.modalTitle')}>
        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-bg-main p-3 border border-border-main">
            <span className="text-xs font-bold text-text-main uppercase tracking-wider">{board.lockedModule?.name}</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">{board.t('sidebar.locked.modalDesc')}</p>
          <div className="flex justify-end pt-3 border-t border-border-main mt-1 gap-2">
            <Button variant="ghost" onClick={() => board.setIsLockModalOpen(false)}>{board.t('confirmModal.cancel')}</Button>
            <Button variant="brand" onClick={board.handleActivateLocked}>{board.t('sidebar.locked.activateBtn')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={!!board.restaurantToDelete} 
        onClose={() => board.isDeleting ? null : board.setRestaurantToDelete(null)} 
        onConfirm={board.handleConfirmDeleteRestaurant} 
        description={`${board.t('sidebar.orgSelector.deleteConfirm')} "${board.restaurantToDelete?.name}"? ${board.t('confirmModal.actionIrreversible')}`} 
      />
    </aside>
  );
};