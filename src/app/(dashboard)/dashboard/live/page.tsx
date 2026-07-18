'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellRing, RefreshCcw } from 'lucide-react';
import { useLiveMonitor } from '@/features/live-monitor/hooks/useLiveMonitor';
import { LiveMonitorCard } from '@/features/live-monitor/components/LiveMonitorCard';
import { Button } from '@/shared/ui';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useTranslation } from '@/shared/hooks/useTranslation';

export default function LiveMonitorPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const hasLiveModule = useAccessStore((state) => state.hasModule('live-calls'));
  const monitor = useLiveMonitor();
  const [expandedTableIds, setExpandedTableIds] = useState<Set<string>>(new Set());

  const socketBadgeClass = monitor.isSocketConnected
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';

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
      <div className="flex h-full items-center justify-center bg-brand-cream p-6 dark:bg-brand-espresso">
        <div className="max-w-xl rounded-xl border border-brand-gray/10 bg-white p-8 text-center shadow-sm dark:border-brand-gray/20 dark:bg-brand-mocha">
          <BellRing className="mx-auto mb-4 h-12 w-12 text-brand-gray/40" />
          <h2 className="text-2xl font-bold text-brand-espresso dark:text-brand-cream">
            {t('liveCalls.notEnabledTitle')}
          </h2>
          <p className="mt-2 text-brand-gray dark:text-brand-gray/80">
            {t('liveCalls.notEnabledDesc')}
          </p>
          <div className="mt-6">
            <Button variant="brand" onClick={() => router.push('/dashboard/marketplace')}>
              {t('pos.goToMarket')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-brand-cream p-6 dark:bg-brand-espresso">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-brand-espresso dark:text-brand-cream">
            <BellRing className="h-8 w-8 text-brand-copper" />
            {t('liveCalls.title')}
          </h1>
          <p className="mt-1 text-brand-gray dark:text-brand-gray/80">
            {t('liveCalls.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${socketBadgeClass}`}>
            {monitor.isSocketConnected ? t('liveCalls.statuses.ready') : t('liveCalls.statuses.pending')}
          </span>
          <Button
            variant="outline"
            onClick={() => monitor.refetch()}
            icon={<RefreshCcw className="h-4 w-4" />}
          >
            {t('actions.refresh')}
          </Button>
        </div>
      </div>

      <div className="mb-4 text-sm text-brand-gray dark:text-brand-gray/80">
        {t('liveCalls.card.details')}: {lastSnapshotLabel}
      </div>

      {monitor.isLoading ? (
        <div className="rounded-xl border border-brand-gray/10 bg-white p-6 text-brand-gray shadow-sm dark:border-brand-gray/20 dark:bg-brand-mocha">
          {t('actions.loading')}
        </div>
      ) : monitor.tables.length === 0 ? (
        <div className="rounded-xl border border-brand-gray/10 bg-white p-6 text-brand-gray shadow-sm dark:border-brand-gray/20 dark:bg-brand-mocha">
          {t('liveCalls.empty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(330px,1fr))]">
          {monitor.tables.map((table) => {
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
              />
            );
          })}
        </div>
      )}
    </div>
  );
}