'use client';

import React from 'react';
import { Card, Button } from '@/shared/ui';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { BarChart3, Wallet, ShoppingBag, Percent, TrendingUp, Award, Clock, Users, PieChart } from 'lucide-react';

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  colorClass 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string | number; 
  colorClass: string; 
}) => (
  <Card className="p-5! bg-bg-surface border border-solid border-border-main/60 rounded-xl flex items-center gap-4 shadow-table">
    <div className={`p-3 rounded-xl border border-solid ${colorClass}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">{title}</span>
      <span className="text-xl font-black text-text-main font-mono mt-0.5 block">{value}</span>
    </div>
  </Card>
);

import { useTranslation } from '@/shared/hooks/useTranslation';

export const AnalyticsView = () => {
  const { t } = useTranslation();
  const state = useAnalytics();

  if (!state.hasModule) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-bg-main min-h-[70vh]">
        <div className="text-center max-w-md bg-bg-surface p-8 rounded-xl border border-solid border-border-main/60 shadow-[0_25px_60px_-15px_rgba(28,25,23,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] flex flex-col items-center">
          <div className="h-16 w-16 bg-brand-emerald/10 text-brand-emerald rounded-xl flex items-center justify-center mb-5">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2 tracking-tight">
            {state.t('analytics.notEnabledTitle')}
          </h2>
          <p className="text-xs text-text-muted font-light mb-6 leading-relaxed">
            {state.t('analytics.notEnabledDesc')}
          </p>
          <Button variant="brand" onClick={state.handleNavigateToMarketplace} className="w-full h-11 text-xs font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl shadow-md border-0 cursor-pointer">
            {state.t('pos.goToMarket')}
          </Button>
        </div>
      </div>
    );
  }

  if (state.isLoading || !state.summary) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-text-muted font-bold animate-pulse">
        {state.t('actions.loading')}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-bg-main p-6 text-text-main transition-colors duration-300">
      <div className="mb-8 border-b border-solid border-border-main/60 pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-brand-emerald/10 rounded-xl text-brand-emerald border border-solid border-brand-emerald/20">
              <BarChart3 className="h-6 w-6" />
            </div>
            {state.t('analytics.title')}
          </h1>
          <p className="mt-2 text-xs text-text-muted font-light max-w-2xl leading-relaxed">
            {state.t('analytics.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">{t('analytics.filters.from')}</label>
            <input 
              type="date" 
              value={state.startDate}
              onChange={(e) => state.setStartDate(e.target.value)}
              className="w-36 pl-3 pr-2 py-2 text-sm font-medium bg-bg-surface border border-solid border-border-main rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all shadow-sm cursor-pointer hover:border-brand-emerald/50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-1">{t('analytics.filters.to')}</label>
            <input 
              type="date" 
              value={state.endDate}
              onChange={(e) => state.setEndDate(e.target.value)}
              className="w-36 pl-3 pr-2 py-2 text-sm font-medium bg-bg-surface border border-solid border-border-main rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all shadow-sm cursor-pointer hover:border-brand-emerald/50"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Wallet} 
          title={state.t('analytics.revenue')} 
          value={`${state.summary.totalRevenue} ₴`} 
          colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10" 
        />
        <StatCard 
          icon={ShoppingBag} 
          title={state.t('analytics.orders')} 
          value={state.summary.totalOrders} 
          colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10" 
        />
        <StatCard 
          icon={Percent} 
          title={state.t('analytics.averageCheck')} 
          value={`${Math.round(state.summary.averageCheck)} ₴`} 
          colorClass="bg-brand-emerald/10 text-brand-emerald border-brand-emerald/10" 
        />
        {state.summary.ordersByType?.map(typeStat => (
          <StatCard 
            key={typeStat.type}
            icon={PieChart} 
            title={state.t(`analytics.orderTypes.${typeStat.type}`)} 
            value={`${typeStat.revenue} ₴ (${typeStat.count})`} 
            colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/10" 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2 p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <TrendingUp className="h-4 w-4 text-brand-emerald" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{state.t('analytics.chartTitle')}</h3>
          </div>

          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-4 border-b border-solid border-border-main/60 px-2">
            {state.summary.chartData.map((day) => {
              const heightPercent = Math.max((day.revenue / state.maxRevenueInChart) * 100, 4);
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[9px] font-bold text-brand-emerald opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap bg-bg-main border border-solid border-border-main/40 px-1.5 py-0.5 rounded font-mono shadow-2xs scale-90 group-hover:scale-100">
                    {day.revenue} ₴
                  </span>
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className="w-full max-w-[48px] bg-brand-emerald/15 group-hover:bg-brand-emerald rounded-t-md transition-all duration-300 ease-out border border-b-0 border-solid border-brand-emerald/10"
                  />
                  <span className="text-[10px] font-bold text-text-muted mt-1 shrink-0 font-mono">{day.date}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-1 p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <Award className="h-4 w-4 text-brand-emerald" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{state.t('analytics.topDishesTitle')}</h3>
          </div>

          {state.summary.topDishes.length === 0 ? (
            <div className="text-center py-8 text-xs italic text-text-muted font-light">{state.t('inventory.emptyState')}</div>
          ) : (
            <div className="space-y-4">
              {state.summary.topDishes.map((dish) => {
                const barWidth = (dish.count / state.maxDishCount) * 100;
                return (
                  <div key={dish.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-text-main line-clamp-1 flex-1 pr-2 font-medium">{dish.name}</span>
                      <span className="text-text-muted shrink-0 text-[11px] font-mono font-bold">{dish.count} {t('analytics.pieces')}</span>
                    </div>
                    <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden border border-solid border-border-main/40">
                      <div style={{ width: `${barWidth}%` }} className="bg-brand-emerald h-full rounded-full transition-all duration-500 border-r border-solid border-brand-emerald/20" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-8">
        <Card className="lg:col-span-2 p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <Clock className="h-4 w-4 text-blue-500" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{t('analytics.hourlyLoad')}</h3>
          </div>

          <div className="h-48 flex items-end gap-2 sm:gap-4 pt-4 border-b border-solid border-border-main/60 px-2">
            {state.summary.peakHours?.map((hourData) => {
              const heightPercent = Math.max((hourData.ordersCount / (state.maxPeakHourOrders || 1)) * 100, 4);
              return (
                <div key={hourData.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[9px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap bg-bg-main border border-solid border-border-main/40 px-1.5 py-0.5 rounded font-mono shadow-2xs scale-90 group-hover:scale-100">
                    {hourData.ordersCount}
                  </span>
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className="w-full max-w-[48px] bg-blue-500/15 group-hover:bg-blue-500 rounded-t-md transition-all duration-300 ease-out border border-b-0 border-solid border-blue-500/10"
                  />
                  <span className="text-[9px] font-bold text-text-muted mt-1 shrink-0 font-mono">{hourData.hour}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-1 p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <Users className="h-4 w-4 text-purple-500" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{t('analytics.waiterEfficiency')}</h3>
          </div>

          {!state.summary.waiterPerformance || state.summary.waiterPerformance.length === 0 ? (
            <div className="text-center py-8 text-xs italic text-text-muted font-light">{state.t('inventory.emptyState')}</div>
          ) : (
            <div className="space-y-4">
              {state.summary.waiterPerformance.map((waiter) => {
                const barWidth = (waiter.completedOrders / (state.maxWaiterOrders || 1)) * 100;
                return (
                  <div key={waiter.waiterId} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-text-main line-clamp-1 flex-1 pr-2 font-medium">{waiter.name}</span>
                      <span className="text-text-muted shrink-0 text-[11px] font-mono font-bold">{waiter.completedOrders} {t('analytics.ordersUnit')} ({waiter.revenueGenerated} {t('analytics.currency')})</span>
                    </div>
                    <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden border border-solid border-border-main/40">
                      <div style={{ width: `${barWidth}%` }} className="bg-purple-500 h-full rounded-full transition-all duration-500 border-r border-solid border-purple-500/20" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};