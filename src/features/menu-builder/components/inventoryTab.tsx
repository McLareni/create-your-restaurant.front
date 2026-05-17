'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Input, Select, Switch } from '@/shared/ui';
import { Search, AlertCircle, Pizza } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { ProductionZone } from '../types/dishes.types';

export const InventoryTab = () => {
  const { t } = useTranslation();
  const { dishes, updateInventory } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDishes = dishes.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleAvailable = (id: string, currentStatus: boolean) => {
    updateInventory({ id, isAvailable: !currentStatus });
  };

  const handleStockChange = (id: string, value: string) => {
    const qty = value === '' ? null : parseInt(value, 10);
    updateInventory({ id, stockQuantity: isNaN(qty as number) ? null : qty });
  };

  const handleZoneChange = (id: string, zone: string) => {
    updateInventory({ id, productionZone: zone as ProductionZone | null });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-brand-gray/10 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-brand-espresso">{t('menu.constructor.inventory.title')}</h2>
          <p className="text-sm text-brand-gray mt-1">{t('menu.constructor.inventory.subtitle')}</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-gray/60" />
          <input 
            type="text"
            placeholder={t('menu.constructor.inventory.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-brand-gray/30 bg-white pl-9 pr-4 text-sm text-brand-espresso outline-none transition-colors focus:border-brand-copper focus:ring-1 focus:ring-brand-copper"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-brand-gray/20 bg-white flex flex-col">
        <div className="grid grid-cols-12 gap-4 border-b border-brand-gray/20 bg-brand-cream/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brand-gray">
          <div className="col-span-5">{t('menu.constructor.inventory.columns.name')}</div>
          <div className="col-span-3">{t('menu.constructor.inventory.columns.zone')}</div>
          <div className="col-span-2 text-center">{t('menu.constructor.inventory.columns.stock')}</div>
          <div className="col-span-2 text-right">{t('menu.constructor.inventory.columns.status')}</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredDishes.map(dish => (
            <div 
              key={dish.id} 
              className={`grid grid-cols-12 items-center gap-4 rounded-lg p-2 transition-colors hover:bg-brand-cream/30 ${!dish.isAvailable ? 'bg-red-50/50 opacity-80' : ''}`}
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cream text-brand-gray">
                  <Pizza className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-brand-espresso line-clamp-1">{dish.name}</span>
                  <span className="text-xs text-brand-gray">{dish.price} {t('menu.currency')}</span>
                </div>
              </div>

              <div className="col-span-3">
                <Select 
                  className="h-9 text-xs border-transparent bg-transparent hover:bg-white hover:border-brand-gray/30 focus:bg-white"
                  value={dish.productionZone || ''} 
                  onChange={(e) => handleZoneChange(dish.id, e.target.value)}
                >
                  <option value="">{t('menu.constructor.inventory.zones.NONE')}</option>
                  <option value="HOT_KITCHEN">{t('menu.constructor.inventory.zones.HOT_KITCHEN')}</option>
                  <option value="COLD_KITCHEN">{t('menu.constructor.inventory.zones.COLD_KITCHEN')}</option>
                  <option value="BAR">{t('menu.constructor.inventory.zones.BAR')}</option>
                  <option value="SUSHI">{t('menu.constructor.inventory.zones.SUSHI')}</option>
                  <option value="HOOKAH">{t('menu.constructor.inventory.zones.HOOKAH')}</option>
                </Select>
              </div>

              <div className="col-span-2 flex justify-center">
                <div className="relative w-20">
                  <Input 
                    className="h-9 text-center text-sm font-medium pr-1 pl-1"
                    type="text"
                    placeholder={t('menu.constructor.inventory.stockUnlimited')}
                    value={dish.stockQuantity === null ? '' : dish.stockQuantity}
                    onChange={(e) => handleStockChange(dish.id, e.target.value)}
                  />
                  {dish.stockQuantity !== null && dish.stockQuantity <= 5 && dish.stockQuantity > 0 && (
                    <AlertCircle className="absolute -right-2 -top-2 h-4 w-4 text-brand-copper bg-white rounded-full" />
                  )}
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-3 pr-2">
                <span className={`text-xs font-medium ${dish.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {dish.isAvailable ? t('menu.constructor.inventory.statusAvailable') : t('menu.constructor.inventory.statusStopped')}
                </span>
                <Switch 
                  checked={dish.isAvailable} 
                  onChange={() => handleToggleAvailable(dish.id, dish.isAvailable)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};