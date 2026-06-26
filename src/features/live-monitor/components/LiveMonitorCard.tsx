'use client';

import React from 'react';
import { Button } from "@/shared/ui";
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Layers, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import type { LiveMonitorTable, LiveMonitorOrder } from "@/features/live-monitor/types/liveMonitor.types";

type LiveMonitorCardProps = {
  table: LiveMonitorTable;
  isExpanded: boolean;
  onToggleDetails: (tableId: string) => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);

const getStatusStyles = (status: LiveMonitorOrder["status"]) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'IN_PROGRESS':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'READY':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'CANCELED':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    default:
      return 'bg-neutral-500/10 text-text-muted border-neutral-500/20';
  }
};

export const LiveMonitorCard = ({
  table,
  isExpanded,
  onToggleDetails,
}: LiveMonitorCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`group flex w-full flex-col justify-between rounded-xl border bg-bg-surface p-5 transition-all duration-300 ${
        isExpanded
          ? "border-brand-emerald/40 ring-1 ring-brand-emerald/10 shadow-md"
          : "border-border-main shadow-table hover:border-border-main/80 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-4 text-text-main bg-bg-surface">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 px-2.5 items-center justify-center rounded-lg bg-bg-main border border-solid border-border-main/50 text-xs font-black text-text-main font-mono tracking-tight">
              #{table.number}
            </span>
            <h3 className="text-sm font-bold text-text-main truncate">
              {t('liveCalls.card.table')}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium">
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3 opacity-60 shrink-0" />
              {table.zone ? table.zone : t('liveCalls.card.noZone')}
            </span>
            <span className="text-border-main/60">•</span>
            <span className="capitalize font-light">{table.type}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-main/60 border border-solid border-border-main/40 text-[11px] font-bold text-text-main">
            <Receipt className="h-3.5 w-3.5 text-brand-emerald shrink-0" />
            <span>{table.activeOrderCount}</span>
          </div>
          
          <Button
            variant="outline"
            className="h-8 text-[11px] font-bold px-3 border-solid rounded-lg flex items-center gap-1"
            onClick={() => onToggleDetails(table.id)}
          >
            <span>{isExpanded ? t('liveCalls.card.hide') : t('liveCalls.card.details')}</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'grid-rows-[1fr] opacity-100 mt-5 pt-4 border-t border-solid border-border-main/40' : 'grid-rows-[0fr] opacity-0'
      }`}>
        <div className="overflow-hidden min-h-0 space-y-3">
          {table.activeOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-solid border-border-main/50 bg-bg-main/30 p-3.5 transition-all hover:border-border-main"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-text-muted font-mono uppercase tracking-wider">
                  {t('liveCalls.card.order')} {order.id.slice(0, 8)}
                </span>
                <span className={`rounded-md border border-solid px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                  {t(`liveCalls.statuses.${order.status.toLowerCase()}`)}
                </span>
              </div>

              <div className="space-y-2 text-xs font-semibold text-text-main">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 text-text-main/90"
                  >
                    <span className="truncate font-medium">
                      <span className="font-mono text-brand-emerald font-black mr-1.5 bg-brand-emerald/5 px-1 py-0.5 rounded text-[10px]">{item.quantity}x</span> 
                      {item.dishName}
                    </span>
                    <span className="font-mono text-text-muted text-[11px] font-bold pt-0.5">{formatCurrency(item.lineTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 border-t border-dashed border-border-main/60 pt-2.5 flex items-center justify-between text-xs font-black text-text-main">
                <span className="text-text-muted font-bold uppercase tracking-wider text-[10px]">{t('liveCalls.card.total')}</span>
                <span className="font-mono text-brand-emerald text-sm font-extrabold">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          ))}
          
          {table.activeOrders.length === 0 && (
            <p className="text-xs italic text-text-muted py-6 text-center font-light bg-bg-main/20 rounded-xl border border-dashed border-border-main/40">
              {t('liveCalls.card.noOrders')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};