import React from 'react';
import { RefreshCcw, CheckCircle, XCircle, Clock, Receipt } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import type { LiveMonitorOrder } from '../types/liveMonitor.types';

interface HistoryListProps {
  orders: LiveMonitorOrder[];
  isLoading: boolean;
  onRestore: (orderId: string) => void;
  isUpdating: boolean;
  updatingOrderId?: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  orders,
  isLoading,
  onRestore,
  isUpdating,
  updatingOrderId,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-text-muted font-bold animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-emerald border-t-transparent animate-spin"></div>
          <span className="text-sm font-bold tracking-widest uppercase">{t('actions.loading')}</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 flex-col opacity-70">
        <Receipt className="h-12 w-12 text-text-muted/40 mb-4 stroke-1" />
        <span className="text-sm font-medium text-text-muted">{t('liveCalls.emptyHistory')}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {orders.map((order) => (
        <div
          key={order.id}
          className="group relative rounded-3xl border border-solid border-border-main/40 bg-bg-surface/80 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-bg-surface/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-start justify-between border-b border-solid border-border-main/40 pb-4 mb-4">
            <div className="flex items-center gap-3">
              {order.status === 'COMPLETED' ? (
                <div className="bg-emerald-500/10 p-2 rounded-xl border border-solid border-emerald-500/20">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
              ) : (
                <div className="bg-red-500/10 p-2 rounded-xl border border-solid border-red-500/20">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-extrabold text-xs uppercase tracking-widest text-text-main">
                  #{order.orderNumber}
                </span>
                <span className="text-[10px] font-mono text-text-muted flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {new Date(order.updatedAt).toLocaleTimeString('uk-UA')}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className="text-lg font-black font-mono text-text-main tracking-tight">
                {order.totalAmount} <span className="text-xs text-text-muted font-sans font-bold">{t('liveCalls.currency')}</span>
              </span>
              <button
                type="button"
                onClick={() => onRestore(order.id)}
                disabled={isUpdating && updatingOrderId === order.id}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-main border border-solid border-border-main/60 hover:bg-bg-hover hover:border-brand-emerald/30 text-[10px] font-bold text-text-main transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group/btn mt-1"
                title={t('liveCalls.restoreOrder')}
              >
                <RefreshCcw className={`h-3 w-3 text-text-muted group-hover/btn:text-brand-emerald transition-colors ${isUpdating && updatingOrderId === order.id ? 'animate-spin' : ''}`} />
                {isUpdating && updatingOrderId === order.id ? t('liveCalls.restoring') : t('liveCalls.restore')}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col flex-1 h-full">
            <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center justify-between">
              <span>{t('liveCalls.card.table')}: <span className="text-text-main font-black">{order.table?.number || '—'}</span></span>
              {order.table?.zone && (
                <span className="bg-bg-element px-2 py-0.5 rounded-md text-text-main">{order.table.zone}</span>
              )}
            </div>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between items-start text-xs font-medium text-text-main group-hover:text-text-main/90 transition-colors">
                  <span className="flex-1 pr-3 leading-snug line-clamp-2">
                    <span className="text-brand-emerald font-bold mr-1.5 font-mono">{item.quantity}x</span>
                    {item.dishName}
                  </span>
                  <span className="font-mono text-text-muted whitespace-nowrap mt-0.5">{item.lineTotal} {t('liveCalls.currency')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
