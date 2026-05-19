'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, Input, Select, Checkbox, EmptyState } from '@/shared/ui';
import { Search, Save, X, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { useDishes } from '../../hooks/useDishes';

export const PricesTab = () => {
  const { t } = useTranslation();
  const { dishes, bulkUpdatePrices } = useDishes();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draftPrices, setDraftPrices] = useState<Record<string, number>>({});

  const [bulkAction, setBulkAction] = useState<'increase' | 'decrease'>('increase');
  const [bulkType, setBulkType] = useState<'percent' | 'fixed'>('percent');
  const [bulkValue, setBulkValue] = useState<number | ''>('');

  const filteredDishes = useMemo(() => {
    return dishes.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [dishes, searchQuery]);

  const hasUnsavedChanges = Object.keys(draftPrices).length > 0;

  const handlePriceChange = (id: string, newPriceStr: string) => {
    const newPrice = parseInt(newPriceStr, 10);
    const originalPrice = dishes.find(d => d.id === id)?.price || 0;

    setDraftPrices(prev => {
      const updated = { ...prev };
      if (isNaN(newPrice) || newPrice === originalPrice) {
        delete updated[id];
      } else {
        updated[id] = newPrice;
      }
      return updated;
    });
  };

  const applyBulkAction = () => {
    if (!bulkValue || selectedIds.length === 0) return;

    setDraftPrices(prev => {
      const updated = { ...prev };
      
      selectedIds.forEach(id => {
        const dish = dishes.find(d => d.id === id);
        if (!dish) return;

        const basePrice = dish.price;
        let finalPrice = basePrice;

        if (bulkType === 'fixed') {
          finalPrice = bulkAction === 'increase' ? basePrice + bulkValue : basePrice - bulkValue;
        } else if (bulkType === 'percent') {
          const modifier = (basePrice * bulkValue) / 100;
          finalPrice = bulkAction === 'increase' ? basePrice + modifier : basePrice - modifier;
        }

        finalPrice = Math.max(0, Math.round(finalPrice));

        if (finalPrice !== basePrice) {
          updated[id] = finalPrice;
        } else {
          delete updated[id];
        }
      });

      return updated;
    });
    
    setBulkValue('');
  };

  const handleSave = () => {
    const updates = Object.entries(draftPrices).map(([id, price]) => ({ id, price }));
    bulkUpdatePrices(updates);
    setDraftPrices({});
    setSelectedIds([]);
  };

  const handleDiscard = () => {
    setDraftPrices({});
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredDishes.map(d => d.id) : []);
  };

  return (
    <div className="flex h-full flex-col relative">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-brand-gray/10 dark:border-brand-gray/20 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-brand-espresso dark:text-brand-cream">{t('menu.constructor.prices.title')}</h2>
          <p className="text-sm text-brand-gray dark:text-brand-gray/80 mt-1">{t('menu.constructor.prices.subtitle')}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-gray/60 dark:text-brand-gray/80" />
          <input 
            type="text"
            placeholder={t('menu.constructor.prices.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-brand-gray/30 dark:border-brand-gray/50 bg-white dark:bg-brand-mocha pl-9 pr-4 text-sm text-brand-espresso dark:text-brand-cream outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper"
          />
        </div>
      </div>

      {dishes.length === 0 ? (
        <EmptyState icon={<Calculator />} title={t('menu.constructor.dishes.emptyTitle')} description={t('menu.constructor.prices.subtitle')} actionLabel={t('menu.constructor.dishes.addBtn')} onAction={() => window.location.href = '/dashboard/menu-builder#dishes'} />
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-brand-mocha border border-brand-gray/20 dark:border-brand-gray/20 rounded-xl">
          <div className="flex items-center gap-4 bg-brand-cream/50 dark:bg-brand-espresso p-4 border-b border-brand-gray/20 dark:border-brand-gray/20">
            <div className="flex items-center gap-2 pr-4 border-r border-brand-gray/20 dark:border-brand-gray/20 shrink-0">
              <Checkbox 
                id="selectAllPrices" label=""
                checked={selectedIds.length === filteredDishes.length && filteredDishes.length > 0} 
                onChange={(e) => toggleSelectAll(e.target.checked)} 
              />
              <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{t('qr.selected')}: {selectedIds.length}</span>
            </div>
            
            <div className={`flex items-center gap-3 transition-opacity ${selectedIds.length === 0 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <span className="text-sm font-medium text-brand-gray dark:text-brand-gray/80 hidden md:block">{t('menu.constructor.prices.bulkActions')}:</span>
              
              <div className="flex items-center">
                <Select 
                  className="h-9 w-32 text-sm border-r-0 rounded-r-none focus:ring-0 focus:border-brand-gray/30 dark:focus:border-brand-gray/50 bg-white dark:bg-brand-espresso" 
                  value={bulkAction} 
                  onChange={(e) => setBulkAction(e.target.value as any)}
                >
                  <option value="increase">{t('menu.constructor.prices.increase')}</option>
                  <option value="decrease">{t('menu.constructor.prices.decrease')}</option>
                </Select>
                <input 
                  type="number" 
                  className="h-9 w-20 border border-brand-gray/30 dark:border-brand-gray/50 bg-white dark:bg-brand-espresso px-3 text-sm text-brand-espresso dark:text-brand-cream outline-none focus:border-brand-copper z-10 relative"
                  placeholder="0"
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value === '' ? '' : parseInt(e.target.value))}
                />
                <Select 
                  className="h-9 w-20 text-sm border-l-0 rounded-l-none focus:ring-0 focus:border-brand-gray/30 dark:focus:border-brand-gray/50 bg-white dark:bg-brand-espresso" 
                  value={bulkType} 
                  onChange={(e) => setBulkType(e.target.value as any)}
                >
                  <option value="percent">{t('menu.constructor.prices.typePercent')}</option>
                  <option value="fixed">{t('menu.constructor.prices.typeFixed')}</option>
                </Select>
              </div>

              <Button variant="outline" className="h-9 py-0" onClick={applyBulkAction}>
                {t('menu.constructor.prices.apply')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 border-b border-brand-gray/20 dark:border-brand-gray/20 bg-white dark:bg-brand-mocha px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-gray dark:text-brand-gray/60">
            <div className="col-span-6">{t('menu.constructor.prices.columns.dish')}</div>
            <div className="col-span-2 text-right">{t('menu.constructor.prices.columns.currentPrice')}</div>
            <div className="col-span-2">{t('menu.constructor.prices.columns.newPrice')}</div>
            <div className="col-span-2 text-right">{t('menu.constructor.prices.columns.difference')}</div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {filteredDishes.map(dish => {
              const currentPrice = dish.price;
              const draftPrice = draftPrices[dish.id];
              const isModified = draftPrice !== undefined;
              const displayPrice = isModified ? draftPrice : currentPrice;
              const diff = displayPrice - currentPrice;

              return (
                <div key={dish.id} className={`grid grid-cols-12 items-center gap-4 rounded-lg px-4 py-2 transition-colors hover:bg-brand-cream/30 dark:hover:bg-white/5 ${isModified ? 'bg-brand-copper/5 dark:bg-brand-copper/10' : ''}`}>
                  <div className="col-span-6 flex items-center gap-3">
                    <Checkbox id={`price-${dish.id}`} label="" checked={selectedIds.includes(dish.id)} onChange={() => toggleSelect(dish.id)} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">{dish.name}</span>
                      <span className="text-xs text-brand-gray dark:text-brand-gray/80 line-clamp-1">{dish.description}</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-right text-sm font-medium text-brand-gray dark:text-brand-gray/80">
                    {currentPrice} {t('menu.currency')}
                  </div>

                  <div className="col-span-2">
                    <div className="relative w-24">
                      <Input 
                        className={`h-9 text-sm font-medium pr-6 bg-white dark:bg-brand-espresso ${isModified ? 'border-brand-copper dark:border-brand-copper focus:ring-brand-copper text-brand-copper' : ''}`}
                        type="number"
                        value={displayPrice}
                        onChange={(e) => handlePriceChange(dish.id, e.target.value)}
                      />
                      <span className="absolute right-3 top-2 text-xs text-brand-gray dark:text-brand-gray/60">{t('menu.currency')}</span>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-end">
                    {isModified && diff !== 0 ? (
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-white dark:bg-brand-espresso shadow-sm border ${diff > 0 ? 'text-green-600 dark:text-green-500 border-green-100 dark:border-green-900/30' : 'text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/30'}`}>
                        {diff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {diff > 0 ? '+' : ''}{diff} {t('menu.currency')}
                      </span>
                    ) : (
                      <span className="text-xs text-brand-gray/40 dark:text-brand-gray/60">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasUnsavedChanges && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-brand-espresso dark:bg-brand-mocha text-white px-6 py-4 rounded-2xl shadow-2xl border border-brand-gray/20 flex items-center gap-6 animate-in slide-in-from-bottom-8">
          <div className="flex flex-col">
            <span className="text-sm font-bold">{t('menu.constructor.prices.unsavedAlert')}</span>
            <span className="text-xs text-brand-cream/70">{t('menu.constructor.prices.changedItemsCount').replace('{{count}}', Object.keys(draftPrices).length.toString())}</span>
          </div>
          <div className="flex items-center gap-3 border-l border-white/20 pl-6">
            <button onClick={handleDiscard} className="text-sm text-brand-cream/70 hover:text-white transition-colors outline-none flex items-center gap-1">
              <X className="h-4 w-4" /> {t('menu.constructor.prices.discard')}
            </button>
            <Button variant="brand" icon={<Save className="h-4 w-4" />} onClick={handleSave}>
              {t('menu.constructor.prices.saveChanges')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};