'use client';

import React from 'react';
import { Card, Button } from '@/shared/ui';
import { BarChart3, Wallet, ShoppingBag, Percent, TrendingUp, Award } from 'lucide-react';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';

export const AnalyticsView = () => {
  const state = useAnalytics();

  if (!state.hasModule) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-bg-main min-h-[70vh]">
        <div className="text-center max-w-md bg-bg-surface p-8 rounded-xl border border-solid border-border-main/60 shadow-[0_25px_60px_-15px_rgba(28,25,23,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] flex flex-col items-center">
          <div className="h-16 w-16 bg-brand-emerald/10 text-brand-emerald rounded-xl flex items-center justify-center mb-5">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2 tracking-tight">
            {state.t('analytics.notEnabledTitle' as never) || 'Модуль аналітики не активовано'}
          </h2>
          <p className="text-xs text-text-muted font-light mb-6 leading-relaxed">
            {state.t('analytics.notEnabledDesc' as never) || 'Для перегляду фінансових звітів та графіків продажів активуйте цей модуль у маркетплейсі.'}
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
      <div className="mb-8 border-b border-solid border-border-main/60 pb-5">
        <h1 className="text-2xl font-bold text-text-main flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-brand-emerald/10 rounded-xl text-brand-emerald border border-solid border-brand-emerald/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          {state.t('analytics.title' as never) || 'Аналітика та звіти'}
        </h1>
        <p className="mt-2 text-xs text-text-muted font-light max-w-2xl leading-relaxed">
          {state.t('analytics.subtitle' as never) || 'Контролюйте фінансові показники вашого ресторану та аналізуйте вподобання гостей.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-5! bg-bg-surface border border-solid border-border-main/60 rounded-xl flex items-center gap-4 shadow-table">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-solid border-emerald-500/10">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">{state.t('analytics.revenue' as never) || 'Загальна виручка'}</span>
            <span className="text-xl font-black text-text-main font-mono mt-0.5 block">{state.summary.totalRevenue} ₴</span>
          </div>
        </Card>

        <Card className="p-5! bg-bg-surface border border-solid border-border-main/60 rounded-xl flex items-center gap-4 shadow-table">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 border border-solid border-blue-500/10">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">{state.t('analytics.orders' as never) || 'Кількість замовлень'}</span>
            <span className="text-xl font-black text-text-main font-mono mt-0.5 block">{state.summary.totalOrders}</span>
          </div>
        </Card>

        <Card className="p-5! bg-bg-surface border border-solid border-border-main/60 rounded-xl flex items-center gap-4 shadow-table">
          <div className="p-3 bg-brand-emerald/10 rounded-xl text-brand-emerald border border-solid border-brand-emerald/10">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">{state.t('analytics.averageCheck' as never) || 'Середній чек'}</span>
            <span className="text-xl font-black text-text-main font-mono mt-0.5 block">{Math.round(state.summary.averageCheck)} ₴</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2 p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <TrendingUp className="h-4 w-4 text-brand-emerald" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{state.t('analytics.chartTitle' as never) || 'Динаміка виручки за 7 днів'}</h3>
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
                    className="w-full bg-brand-emerald/15 group-hover:bg-brand-emerald rounded-t-md transition-all duration-300 ease-out border border-b-0 border-solid border-brand-emerald/10"
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
            <h3 className="font-bold text-sm text-text-main tracking-tight">{state.t('analytics.topDishesTitle' as never) || 'Популярні страви'}</h3>
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
                      <span className="text-text-muted shrink-0 text-[11px] font-mono font-bold">{dish.count} {state.t('menu.constructor.dishes.units.pcs' as never) || 'шт.'}</span>
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
    </div>
  );
};