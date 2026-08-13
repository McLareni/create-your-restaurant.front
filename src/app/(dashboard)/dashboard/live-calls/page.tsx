'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellRing, RefreshCcw, History, Activity } from 'lucide-react';
import { useLiveMonitor } from '@/features/live-monitor/hooks/useLiveMonitor';
import { LiveMonitorCard } from '@/features/live-monitor/components/LiveMonitorCard';
import { HistoryList } from '@/features/live-monitor/components/HistoryList';
import { Button } from '@/shared/ui';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';

export default function LiveMonitorPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const hasLiveModule = useAccessStore((state) => state.hasModule('live-calls'));
  const [historyDate, setHistoryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const monitor = useLiveMonitor(historyDate);
  const [expandedTableIds, setExpandedTableIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'calls' | 'active' | 'history'>('active');

  const lastSnapshotLabel = useMemo(() => {
    if (!monitor.generatedAt) {
      return t('actions.loading');
    }
    return new Date(monitor.generatedAt).toLocaleTimeString('uk-UA');
  }, [monitor.generatedAt, t]);

  const toggleTableDetails = (tableId: string) => {
    setExpandedTableIds((prev) => {
      const next = new Set(prev);
      if (next.has(tableId)) {
        next.delete(tableId);
      } else {
        next.add(tableId);
      }
      return next;
    });
  };

  if (!hasLiveModule) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-bg-main min-h-[70vh]">
        <div className="text-center max-w-md bg-bg-surface p-8 rounded-xl border border-solid border-border-main/60 shadow-[0_25px_60px_-15px_rgba(28,25,23,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] flex flex-col items-center">
          <div className="h-16 w-16 bg-brand-emerald/10 text-brand-emerald rounded-xl flex items-center justify-center mb-5">
            <BellRing className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2 tracking-tight">
            {t('liveCalls.notEnabledTitle')}
          </h2>
          <p className="text-xs text-text-muted font-light mb-6 leading-relaxed">
            {t('liveCalls.notEnabledDesc')}
          </p>
          <Button variant="brand" onClick={() => router.push('/dashboard/marketplace')} className="w-full h-11 text-xs font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl shadow-md border-0 cursor-pointer">
            {t('pos.goToMarket')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-bg-main p-6 text-text-main transition-colors duration-300">
      <div className="mb-8 border-b border-solid border-border-main/60 pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-brand-emerald/10 rounded-xl text-brand-emerald border border-solid border-brand-emerald/20">
              <BellRing className="h-6 w-6" />
            </div>
            {t('liveCalls.title')}
          </h1>
          <p className="mt-2 text-xs text-text-muted font-light max-w-2xl leading-relaxed">
            {t('liveCalls.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm border border-solid ${
            monitor.isSocketConnected 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}>
            {monitor.isSocketConnected ? t('liveCalls.statuses.ready') : t('liveCalls.statuses.pending')}
          </span>
          <Button
            variant="outline"
            onClick={() => {
              monitor.refetch();
              monitor.refetchHistory();
            }}
            icon={<RefreshCcw className="h-4 w-4" />}
            className="h-9 px-3 rounded-xl border-border-main text-text-main hover:bg-bg-surface shadow-sm font-semibold text-xs"
          >
            {t('actions.refresh')}
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex bg-bg-surface p-1 rounded-xl border border-solid border-border-main/60 shadow-sm">
          <button
            onClick={() => setActiveTab('calls')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'calls'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-text-muted hover:text-text-main hover:bg-bg-main/50'
            }`}
          >
            <BellRing className={`h-4 w-4 ${activeTab === 'calls' ? '' : 'text-amber-500/70'}`} />
            {t('liveCalls.tabs.calls')}
            {monitor.tables.some(t => t.isWaiterCallActive) && (
              <span className="ml-1 flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-bg-main text-text-main shadow-sm'
                : 'text-text-muted hover:text-text-main hover:bg-bg-main/50'
            }`}
          >
            <Activity className="h-4 w-4" />
            {t('liveCalls.tabs.active')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-bg-main text-text-main shadow-sm'
                : 'text-text-muted hover:text-text-main hover:bg-bg-main/50'
            }`}
          >
            <History className="h-4 w-4" />
            {t('liveCalls.tabs.history')}
          </button>
        </div>
        
        {activeTab === 'history' ? (
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('liveCalls.date')}</label>
            <input 
              type="date" 
              value={historyDate}
              onChange={(e) => setHistoryDate(e.target.value)}
              className="w-36 pl-3 pr-2 py-2 text-sm font-medium bg-bg-surface border border-solid border-border-main rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all shadow-sm cursor-pointer hover:border-brand-emerald/50"
            />
          </div>
        ) : (
          <div className="text-xs font-bold text-text-muted bg-bg-surface px-3 py-1.5 rounded-lg border border-solid border-border-main/60 shadow-sm">
            {t('liveCalls.card.details')}: <span className="font-mono text-text-main ml-1">{lastSnapshotLabel}</span>
          </div>
        )}
      </div>

      {activeTab === 'active' || activeTab === 'calls' ? (
        monitor.isLoading ? (
          <div className="flex flex-1 items-center justify-center p-12 text-text-muted font-bold animate-pulse">
            {t('actions.loading')}
          </div>
        ) : (activeTab === 'calls' ? monitor.tables.filter(t => t.isWaiterCallActive) : monitor.tables).length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-12 flex-col opacity-70">
            <Activity className="h-12 w-12 text-text-muted/40 mb-4 stroke-1" />
            <span className="text-sm font-medium text-text-muted">
              {activeTab === 'calls' ? t('liveCalls.emptyCalls') : t('liveCalls.empty')}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-start">
            {(activeTab === 'calls' ? monitor.tables.filter(t => t.isWaiterCallActive) : monitor.tables).map((table) => {
              const isExpanded = expandedTableIds.has(table.id);
              return (
                <LiveMonitorCard
                  key={table.id}
                  table={table}
                  isExpanded={isExpanded}
                  onToggleDetails={toggleTableDetails}
                  onResolveWaiterCall={monitor.resolveWaiterCall}
                  isResolvingWaiterCall={
                    monitor.isResolvingWaiterCall &&
                    monitor.resolvingWaiterTableId === table.id
                  }
                  onUpdateOrderStatus={monitor.updateOrderStatus}
                  isUpdatingOrderStatus={monitor.isUpdatingOrderStatus}
                  updatingOrderId={monitor.updatingOrderId}
                />
              );
            })}
          </div>
        )
      ) : (
        <HistoryList
          orders={monitor.historyOrders}
          isLoading={monitor.isHistoryLoading}
          onRestore={(orderId) => monitor.updateOrderStatus(orderId, 'PENDING')}
          isUpdating={monitor.isUpdatingOrderStatus}
          updatingOrderId={monitor.updatingOrderId}
        />
      )}
    </div>
  );
}