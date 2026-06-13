'use client';

import { Card, Button } from '@/shared/ui';
import { BarChart3, Wallet, ShoppingBag, Percent, TrendingUp, Award } from 'lucide-react';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';

export const AnalyticsView = () => {
  const state = useAnalytics();

  if (!state.hasModule) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-brand-cream/30 dark:bg-brand-espresso/20 min-h-[70vh]">
        <div className="text-center max-w-md bg-white dark:bg-brand-mocha p-8 rounded-3xl border border-brand-gray/10 shadow-xl flex flex-col items-center">
          <div className="h-16 w-16 bg-brand-cream dark:bg-brand-espresso rounded-2xl flex items-center justify-center text-brand-gray mb-5">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-espresso dark:text-brand-cream mb-2">
            {state.t('analytics.notEnabledTitle' as any) || 'Модуль аналітики не активовано'}
          </h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mb-6 leading-relaxed">
            {state.t('analytics.notEnabledDesc' as any) || 'Для перегляду фінансових звітів та графіків продажів активуйте цей модуль у маркетплейсі.'}
          </p>
          <Button variant="brand" onClick={state.handleNavigateToMarketplace} className="w-full h-11 text-sm font-bold shadow-md">
            {state.t('pos.goToMarket')}
          </Button>
        </div>
      </div>
    );
  }

  if (state.isLoading || !state.summary) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-brand-gray font-medium animate-pulse">
        {state.t('actions.loading')}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-brand-cream p-6 dark:bg-brand-espresso transition-colors duration-300">
      <div className="mb-8 border-b border-brand-gray/10 dark:border-brand-gray/20 pb-5">
        <h1 className="text-3xl font-serif font-bold text-brand-espresso dark:text-brand-cream flex items-center gap-3">
          <div className="p-2 bg-brand-copper/10 rounded-xl text-brand-copper">
            <BarChart3 className="h-7 w-7" />
          </div>
          {state.t('analytics.title' as any) || 'Аналітика та звіти'}
        </h1>
        <p className="mt-2 text-sm text-brand-gray dark:text-brand-gray/80 max-w-2xl leading-relaxed">
          {state.t('analytics.subtitle' as any) || 'Контролюйте фінансові показники вашого ресторану та аналізуйте вподобання гостей.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-5! bg-white dark:bg-brand-mocha border border-brand-gray/10 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-600">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-brand-gray uppercase tracking-wider">{state.t('analytics.revenue' as any) || 'Загальна виручка'}</span>
            <span className="text-2xl font-bold text-brand-espresso dark:text-brand-cream mt-0.5 block">{state.summary.totalRevenue} ₴</span>
          </div>
        </Card>

        <Card className="p-5! bg-white dark:bg-brand-mocha border border-brand-gray/10 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-brand-gray uppercase tracking-wider">{state.t('analytics.orders' as any) || 'Кількість замовлень'}</span>
            <span className="text-2xl font-bold text-brand-espresso dark:text-brand-cream mt-0.5 block">{state.summary.totalOrders}</span>
          </div>
        </Card>

        <Card className="p-5! bg-white dark:bg-brand-mocha border border-brand-gray/10 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-brand-copper/10 rounded-xl text-brand-copper">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-brand-gray uppercase tracking-wider">{state.t('analytics.averageCheck' as any) || 'Середній чек'}</span>
            <span className="text-2xl font-bold text-brand-espresso dark:text-brand-cream mt-0.5 block">{Math.round(state.summary.averageCheck)} ₴</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2 p-6! bg-white dark:bg-brand-mocha border border-brand-gray/10 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-brand-gray/10">
            <TrendingUp className="h-5 w-5 text-brand-copper" />
            <h3 className="font-bold text-base text-brand-espresso dark:text-brand-cream">{state.t('analytics.chartTitle' as any) || 'Динаміка виручки за 7 днів'}</h3>
          </div>

          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-4 border-b border-brand-gray/20 px-2">
            {state.summary.chartData.map((day) => {
              const heightPercent = Math.max((day.revenue / state.maxRevenueInChart) * 100, 4);
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-brand-copper opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-brand-cream dark:bg-brand-espresso px-1 rounded shadow-xs">
                    {day.revenue} ₴
                  </span>
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className="w-full bg-brand-copper/20 group-hover:bg-brand-copper rounded-t-lg transition-all duration-500 ease-out shadow-xs"
                  />
                  <span className="text-[11px] font-medium text-brand-gray mt-1 shrink-0">{day.date}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-1 p-6! bg-white dark:bg-brand-mocha border border-brand-gray/10 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-brand-gray/10">
            <Award className="h-5 w-5 text-brand-copper" />
            <h3 className="font-bold text-base text-brand-espresso dark:text-brand-cream">{state.t('analytics.topDishesTitle' as any) || 'Популярні страви'}</h3>
          </div>

          {state.summary.topDishes.length === 0 ? (
            <div className="text-center py-8 text-xs italic text-brand-gray">{state.t('inventory.emptyState')}</div>
          ) : (
            <div className="space-y-4">
              {state.summary.topDishes.map((dish) => {
                const barWidth = (dish.count / state.maxDishCount) * 100;
                return (
                  <div key={dish.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-brand-espresso dark:text-brand-cream line-clamp-1 flex-1 pr-2">{dish.name}</span>
                      <span className="text-brand-gray shrink-0 text-xs">{dish.count} шт.</span>
                    </div>
                    <div className="w-full bg-brand-cream dark:bg-brand-espresso h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${barWidth}%` }} className="bg-brand-copper h-full rounded-full transition-all duration-500" />
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