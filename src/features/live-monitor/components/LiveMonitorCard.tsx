"use client";

import { Button } from "@/shared/ui";
import type {
  LiveMonitorOrder,
  LiveMonitorTable,
} from "@/features/live-monitor/types/liveMonitor.types";

interface LiveMonitorCardProps {
  table: LiveMonitorTable;
  isExpanded: boolean;
  onToggleDetails: (tableId: string) => void;
  onResolveWaiterCall: (tableId: string) => void;
  isResolvingWaiterCall: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);

const statusLabel: Record<LiveMonitorOrder["status"], string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

export const LiveMonitorCard = ({
  table,
  isExpanded,
  onToggleDetails,
  onResolveWaiterCall,
  isResolvingWaiterCall,
}: LiveMonitorCardProps) => {
  const isWaitingForWaiter = table.isWaiterCallActive;

  return (
    <div
      className={`group relative flex h-min min-h-34 w-full flex-col justify-between overflow-visible rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-brand-copper/30 hover:shadow-md dark:border-brand-gray/20 dark:bg-brand-mocha ${
        isWaitingForWaiter
          ? "border-amber-400 bg-amber-50/70 dark:border-amber-500/60 dark:bg-amber-900/15"
          : ""
      } ${
        isExpanded
          ? "z-20 rounded-b-none border-b-0 border-brand-copper/30"
          : isWaitingForWaiter
            ? "z-0"
            : "z-0 border-brand-gray/10"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-brand-espresso dark:text-brand-cream">
            Table #{table.number}
          </h3>
          <p className="text-xs text-brand-gray dark:text-brand-gray/80 whitespace-nowrap">
            {table.zone ? `Zone: ${table.zone}` : "No zone"} | Type:{" "}
            {table.type}
          </p>
        </div>
        <div className="text-right">
          {isWaitingForWaiter ? (
            <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              Чекає на офіціанта
            </div>
          ) : null}
          <div className="text-sm font-semibold text-brand-espresso dark:text-brand-cream whitespace-nowrap">
            Активних замовлень: {table.activeOrderCount}
          </div>
          <div className="flex flex-row gap-4 justify-end">
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => onToggleDetails(table.id)}
            >
              {isExpanded ? "Сховати" : "Детально"}
            </Button>
            {isWaitingForWaiter ? (
              <Button
                variant="brand"
                className="mt-2"
                isLoading={isResolvingWaiterCall}
                onClick={() => onResolveWaiterCall(table.id)}
              >
                Офіціант уже біля столика
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {isExpanded ? (
        <div className="absolute -left-px -right-px z-30 top-[calc(100%-1px)] space-y-3 rounded-b-xl border border-t-0 border-brand-copper/30 bg-white p-3 dark:border-brand-gray/20 dark:bg-brand-mocha">
          {table.activeOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-brand-gray/10 bg-brand-cream/60 p-3 dark:border-brand-gray/25 dark:bg-brand-mocha/60"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-brand-espresso dark:text-brand-cream">
                  Order {order.id.slice(0, 8)}
                </span>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-brand-gray dark:bg-brand-espresso dark:text-brand-gray/70">
                  {statusLabel[order.status] ?? order.status}
                </span>
              </div>

              <div className="space-y-1 text-sm text-brand-gray dark:text-brand-gray/80">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span>
                      {item.quantity}x {item.dishName}
                    </span>
                    <span>{formatCurrency(item.lineTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 border-t border-brand-gray/10 pt-2 text-right text-sm font-semibold text-brand-espresso dark:text-brand-cream">
                Total: {formatCurrency(order.totalAmount)}
              </div>
            </div>
          ))}
          {table.activeOrders.length === 0 && (
            <p className="text-sm text-brand-gray">
              No active orders for this table.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};
