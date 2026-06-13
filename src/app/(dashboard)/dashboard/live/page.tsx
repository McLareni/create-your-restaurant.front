'use client';

import { BellRing, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLiveMonitor } from '@/features/live-monitor/hooks/useLiveMonitor';
import { LiveMonitorCard } from '@/features/live-monitor/components/LiveMonitorCard';
import { Button } from '@/shared/ui';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { useRouter } from 'next/navigation';

export default function LiveMonitorPage() {
  const router = useRouter();
  const hasLiveModule = useAccessStore((state) => state.hasModule('live-calls'));
  const monitor = useLiveMonitor();
  const [expandedTableIds, setExpandedTableIds] = useState<Set<string>>(new Set());

  const socketBadgeClass = monitor.isSocketConnected
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';

  const lastSnapshotLabel = useMemo(() => {
    if (!monitor.generatedAt) {
      return 'not loaded';
    }

    return new Date(monitor.generatedAt).toLocaleTimeString('uk-UA');
  }, [monitor.generatedAt]);

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
            Live monitor module is not active
          </h2>
          <p className="mt-2 text-brand-gray dark:text-brand-gray/80">
            Activate the module in Marketplace to start receiving real-time order updates.
          </p>
          <div className="mt-6">
            <Button variant="brand" onClick={() => router.push('/dashboard/marketplace')}>
              Open Marketplace
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
            Live Monitor
          </h1>
          <p className="mt-1 text-brand-gray dark:text-brand-gray/80">
            Active tables and orders with real-time updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${socketBadgeClass}`}
          >
            {monitor.isSocketConnected ? 'Socket connected' : 'Socket reconnecting'}
          </span>
          <Button
            variant="outline"
            onClick={() => monitor.refetch()}
            icon={<RefreshCcw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="mb-4 text-sm text-brand-gray dark:text-brand-gray/80">
        Last snapshot: {lastSnapshotLabel}
      </div>

      {monitor.isLoading ? (
        <div className="rounded-xl border border-brand-gray/10 bg-white p-6 text-brand-gray shadow-sm dark:border-brand-gray/20 dark:bg-brand-mocha">
          Loading live monitor data...
        </div>
      ) : monitor.tables.length === 0 ? (
        <div className="rounded-xl border border-brand-gray/10 bg-white p-6 text-brand-gray shadow-sm dark:border-brand-gray/20 dark:bg-brand-mocha">
          No active tables, orders, or waiter calls right now.
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
