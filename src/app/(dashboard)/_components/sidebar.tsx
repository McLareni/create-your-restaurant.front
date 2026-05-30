'use client';

import Link from 'next/link';
import { Modal, Button, ConfirmModal } from '@/shared/ui';
import { ChevronsUpDown, Plus, Lock, LogOut, Store, ChevronDown, Trash2 } from 'lucide-react';
import { useSidebarLogic } from './hooks/useSidebar';

export const Sidebar = () => {
  const board = useSidebarLogic();

  return (
    <aside className="flex w-72 flex-col bg-brand-espresso text-brand-cream border-r border-brand-espresso shadow-2xl h-screen sticky top-0">
      <div className="relative p-4 border-b border-brand-gray/20">
        <button 
          onClick={() => board.setIsOrgDropdownOpen(!board.isOrgDropdownOpen)}
          className="flex w-full items-center justify-between rounded-xl bg-brand-mocha p-3 transition-colors hover:bg-brand-mocha/80 outline-none focus:ring-1 focus:ring-brand-copper cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-copper text-white font-serif text-lg font-bold">
              {board.orgInitial}
            </div>
            <div className="flex flex-col items-start truncate">
              <span className="text-xs text-brand-gray font-medium uppercase tracking-wider">{board.t('sidebar.orgSelector.switch')}</span>
              <span className="truncate font-medium text-brand-cream">{board.currentOrgName}</span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-brand-gray shrink-0" />
        </button>

        {board.isOrgDropdownOpen && (
          <div className="absolute left-4 right-4 top-full z-50 mt-2 rounded-xl border border-brand-gray/20 bg-brand-mocha shadow-xl max-h-66 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 flex flex-col gap-1">
              {board.restaurants.map((res) => (
                <div 
                  key={res.id}
                  className={`flex w-full items-center justify-between rounded-lg p-1 transition-colors hover:bg-white/5 ${board.activeRestaurant?.id === res.id ? 'bg-brand-copper/20' : ''}`}
                >
                  <button 
                    onClick={() => board.handleRestaurantSwitch(res)}
                    className={`flex flex-1 items-center gap-3 p-1.5 text-left overflow-hidden cursor-pointer ${board.activeRestaurant?.id === res.id ? 'text-brand-gold font-semibold' : 'text-brand-cream'}`}
                  >
                    <Store className="h-4 w-4 text-brand-gray shrink-0" />
                    <span className="text-sm truncate">{res.name}</span>
                  </button>
                  
                  <button
                    onClick={(e) => board.handleDeleteRestaurantClick(e, res)}
                    className="p-1.5 text-brand-gray hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10 shrink-0 cursor-pointer"
                    title={board.t('sidebar.orgSelector.delete')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="border-t border-brand-gray/20 p-2 sticky bottom-0 bg-brand-mocha">
              {board.restaurants.length < 3 ? (
                <Link 
                  href="/create-organization" 
                  onClick={() => board.setIsOrgDropdownOpen(false)} 
                  className="flex w-full items-center gap-2 rounded-lg p-2 text-brand-copper transition-colors hover:bg-brand-copper/10"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">{board.t('sidebar.orgSelector.addNew')}</span>
                </Link>
              ) : (
                <div className="text-[10px] text-center text-red-400 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20 font-medium mx-1 select-none">
                  {board.t('sidebar.limitReached')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {board.menuGroups.map((group, groupIdx) => {
          const renderedGroup = group.filter(item => !item.moduleKey || board.isPurchased(item.moduleKey));
          if (renderedGroup.length === 0) return null;

          return (
            <div key={groupIdx} className={`px-3 py-2 ${groupIdx !== board.menuGroups.length - 1 ? 'border-b border-brand-gray/10 mb-2' : ''}`}>
              {renderedGroup.map((item) => {
                const isActive = board.pathname === item.href || (item.subItems && item.subItems.some(sub => board.pathname === sub.href));
                const Icon = item.icon;
                const isLocked = item.moduleKey && !board.hasModule(item.moduleKey);
                const isExpanded = board.expandedMenus[item.id];

                if (item.subItems) {
                  return (
                    <div key={item.id} className="mb-1">
                      <button
                        onClick={(e) => isLocked ? board.handleLockedClick(e, item.label, item.moduleKey!) : board.toggleSubMenu(item.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all outline-none cursor-pointer ${
                          isLocked ? 'text-brand-gray opacity-60 hover:bg-white/5' :
                          isActive && !isExpanded ? 'bg-brand-copper text-white shadow-md' : 'text-brand-cream/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 shrink-0 ${isActive && !isExpanded && !isLocked ? 'text-white' : 'text-brand-gray'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isLocked ? <Lock className="h-4 w-4" /> : <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />}
                      </button>
                      
                      <div className={`grid transition-all duration-200 ease-in-out ${isExpanded && !isLocked ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden flex flex-col gap-1">
                          {item.subItems.map(sub => (
                            <Link key={sub.id} href={sub.href} className={`flex w-full items-center rounded-lg py-2 pl-11 pr-3 text-sm transition-colors outline-none ${board.pathname === sub.href ? 'bg-white/10 text-white font-medium' : 'text-brand-gray hover:bg-white/5 hover:text-brand-cream'}`}>
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
                    <button key={item.id} onClick={(e) => board.handleLockedClick(e, item.label, item.moduleKey!)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-brand-gray opacity-60 transition-colors hover:bg-white/5 mb-1 outline-none cursor-pointer">
                      <div className="flex items-center gap-3"><Icon className="h-5 w-5" /><span>{item.label}</span></div>
                      <Lock className="h-4 w-4" />
                    </button>
                  );
                }

                if (item.onClick) {
                  return (
                    <button key={item.id} onClick={item.onClick} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1 outline-none text-brand-cream/80 hover:bg-white/10 hover:text-white cursor-pointer">
                      <div className="flex items-center gap-3"><Icon className="h-5 w-5 shrink-0 text-brand-gray" /><span>{item.label}</span></div>
                    </button>
                  );
                }

                return (
                  <Link key={item.id} href={item.href!} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1 outline-none ${isActive ? 'bg-brand-copper text-white shadow-md' : 'text-brand-cream/80 hover:bg-white/10 hover:text-white'}`}>
                    <div className="flex items-center gap-3"><Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-brand-gold' : 'text-brand-gray'}`} /><span>{item.label}</span></div>
                    {item.highlight && !isActive && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold"></div>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-brand-gray/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gray/20 text-brand-cream font-medium">
              {board.user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-sm font-medium text-brand-cream">{board.user?.email || board.t('loading')}</span>
              <span className="text-xs text-brand-gray">{board.user?.role ? board.t(`roles.${board.user.role}`) : ''}</span>
            </div>
          </div>
          <button onClick={board.logout} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-brand-gray transition-colors hover:bg-red-500/10 hover:text-red-400 outline-none cursor-pointer"><LogOut className="h-5 w-5" /></button>
        </div>
      </div>

      <Modal isOpen={board.isLockModalOpen} onClose={() => board.setIsLockModalOpen(false)} title={board.t('sidebar.locked.modalTitle')}>
        <div className="flex flex-col gap-5">
          <div className="rounded-xl bg-brand-cream/40 p-4 border border-brand-gray/10"><span className="text-sm font-bold text-brand-espresso uppercase tracking-wider">{board.lockedModule?.name}</span></div>
          <p className="text-sm text-brand-gray leading-relaxed">{board.t('sidebar.locked.modalDesc')}</p>
          <div className="flex justify-end pt-4 border-t border-brand-gray/10 mt-2 gap-3">
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