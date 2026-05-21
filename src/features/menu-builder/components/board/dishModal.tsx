'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, FloatingPanel, Input, Switch, Checkbox } from '@/shared/ui';
import { DishFormValues } from '../../schemas/dishes.schema';
import { IngredientsTab } from './tabs/IngredientsTab';
import { UpsellTab } from './tabs/UpsellTab';
import { DishLivePreview } from './preview/DishLivePreview';
import { CharacteristicsTab } from './tabs/CharacteristicsTab';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  dishForm: DishFormValues;
  setDishForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modifierGroups: any[];
  currentDishId?: string;
  isLoading?: boolean;
  errors: Record<string, string>;
}

export const DishModal = ({
  isOpen,
  onClose,
  isEditing,
  dishForm,
  setDishForm,
  onSave,
  handleImageUpload,
  modifierGroups,
  currentDishId,
  isLoading = false,
  errors
}: DishModalProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'characteristics' | 'ingredients' | 'modifiers' | 'upsell' | 'media'>('general');

  const handleAddVariant = () => {
    const currentVariants = dishForm.variants || [];
    setDishForm({ ...dishForm, variants: [...currentVariants, { name: '', price: 0, sku: '' }] });
  };

  const handleRemoveVariant = (index: number) => {
    const currentVariants = [...(dishForm.variants || [])];
    currentVariants.splice(index, 1);
    setDishForm({ ...dishForm, variants: currentVariants });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const currentVariants = [...(dishForm.variants || [])];
    currentVariants[index] = { ...currentVariants[index], [field]: value };
    setDishForm({ ...dishForm, variants: currentVariants });
  };

  const onLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading(t('menu.constructor.dishes.notifications.imageUploading'), { id: 'img-upload' });
      handleImageUpload(e);
      toast.success(t('menu.constructor.dishes.notifications.imageUploadSuccess'), { id: 'img-upload' });
    } catch (err) {
      toast.error(t('menu.constructor.dishes.notifications.imageUploadError'), { id: 'img-upload' });
    }
  };

  const handleValidateAndSave = () => {
    if (Object.keys(errors).length > 0) {
      toast.error(t('errors.formValidation'));
      return;
    }
    onSave();
  };

  return (
    <FloatingPanel 
      panelId="dish-modal"
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? t('menu.constructor.dishes.modal.editTitle') : t('menu.constructor.dishes.modal.createTitle')}
      className="w-240 max-w-6xl border-brand-copper/20 max-h-[calc(100vh-40px)] flex flex-col animate-none"
    >
      {/* h-162.5 фіксує модалку у висоту раз і назавжди, прибираючи стрибки розмірів */}
      <div className="flex flex-col text-brand-espresso dark:text-brand-cream w-full h-162.5 max-h-[calc(100vh-140px)] justify-start gap-5 overflow-hidden">
        
        <div className="flex border-b border-brand-gray/10 dark:border-brand-gray/20 pb-0.5 gap-1 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'general', label: t('menu.constructor.dishes.modal.basicInfo'), hasError: !!(errors.name || errors.description) },
            { id: 'pricing', label: t('menu.constructor.dishes.modal.tabs.pricing'), hasError: !!(errors.price || errors.taxRate || errors.variants) },
            { id: 'characteristics', label: t('menu.constructor.dishes.modal.tabs.characteristics'), hasError: !!(errors.allergens || errors.tags) },
            { id: 'ingredients', label: t('menu.constructor.dishes.modal.ingredients.title'), hasError: !!errors.ingredients },
            { id: 'modifiers', label: t('menu.constructor.tabs.modifiers'), hasError: !!errors.modifierIds },
            { id: 'upsell', label: t('menu.constructor.tabs.combos'), hasError: !!errors.upsellDishIds },
            { id: 'media', label: t('menu.constructor.dishes.modal.media'), hasError: false }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              disabled={isLoading}
              className={`relative pb-1.5 px-3 text-[11px] uppercase tracking-wider font-bold border-b-2 transition-all whitespace-nowrap outline-none rounded-t-lg hover:bg-brand-cream/30 dark:hover:bg-brand-gray/5 ${
                activeTab === tab.id
                  ? 'border-brand-copper text-brand-copper bg-brand-cream/10 dark:bg-brand-gray/5'
                  : 'border-transparent text-brand-gray hover:text-brand-espresso dark:hover:text-brand-cream'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.label}
              {tab.hasError && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-5 items-start flex-1 overflow-hidden h-full py-1">
          {/* Ліва робоча частина форми */}
          <div className="flex-1 h-full overflow-y-auto custom-scrollbar pr-1">
            
            {activeTab === 'general' && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-100">
                <Input
                  id="dishName"
                  label={t('menu.constructor.dishes.modal.nameLabel')}
                  placeholder={t('menu.constructor.dishes.modal.namePlaceholder')}
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  disabled={isLoading}
                  error={errors.name}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-brand-espresso dark:text-brand-cream">{t('menu.constructor.dishes.modal.descLabel')}</label>
                  <textarea
                    className={`w-full rounded-xl border bg-white dark:bg-brand-mocha px-3 py-2 text-sm text-brand-espresso dark:text-brand-cream outline-none focus:border-brand-copper focus:ring-1 focus:ring-brand-copper transition-all h-28 resize-none shadow-xs ${errors.description ? 'border-red-500' : 'border-brand-gray/20 dark:border-brand-gray/40'}`}
                    placeholder={t('menu.constructor.dishes.modal.descPlaceholder')}
                    value={dishForm.description}
                    onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                    disabled={isLoading}
                  />
                  {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-brand-gray/10 bg-brand-cream/5">
                  <span className="text-xs font-bold">{t('menu.constructor.dishes.modal.availabilityLabel')}</span>
                  <Switch checked={dishForm.isAvailable} onChange={(val) => setDishForm({ ...dishForm, isAvailable: val })} disabled={isLoading} />
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-100">
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    id="dishPrice" 
                    type="number" 
                    label={t('menu.constructor.dishes.modal.priceLabel')} 
                    value={dishForm.price || ''} 
                    onChange={(e) => setDishForm({ ...dishForm, price: Math.max(0, parseFloat(e.target.value) || 0) })} 
                    disabled={isLoading}
                    className="h-10 text-xs" 
                    error={errors.price}
                  />
                  <Input 
                    id="dishTaxInput" 
                    type="number" 
                    label={t('menu.constructor.dishes.modal.taxRateLabel')} 
                    placeholder="20" 
                    value={dishForm.taxRate === 0 ? '' : dishForm.taxRate} 
                    onChange={(e) => setDishForm({ ...dishForm, taxRate: Math.max(0, parseFloat(e.target.value) || 0) })} 
                    disabled={isLoading}
                    className="h-10 text-xs" 
                    error={errors.taxRate}
                  />
                </div>
                
                <div className="border border-brand-gray/10 rounded-2xl p-3 bg-brand-cream/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">{t('menu.constructor.dishes.modal.variantsTitle')}</span>
                    <Button variant="outline" type="button" onClick={handleAddVariant} disabled={isLoading} className="h-6 text-[10px] px-2 border-brand-copper text-brand-copper rounded-lg" icon={<Plus className="h-3 w-3" />}>{t('menu.constructor.dishes.modal.addVariantBtn')}</Button>
                  </div>
                  {errors.variants && <p className="text-xs text-red-500 mb-2">{errors.variants}</p>}
                  {dishForm.variants && dishForm.variants.length > 0 && (
                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {dishForm.variants.map((variant, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-white dark:bg-brand-mocha p-2 rounded-xl border border-brand-gray/10 shadow-xs">
                          <div className="flex-1"><Input id={`v-name-${idx}`} label={t('menu.constructor.dishes.modal.variantName')} value={variant.name} onChange={(e) => handleVariantChange(idx, 'name', e.target.value)} disabled={isLoading} className="h-8 text-xs" /></div>
                          <div className="w-20"><Input id={`v-price-${idx}`} type="number" label={t('menu.constructor.dishes.modal.variantPrice')} value={variant.price || ''} onChange={(e) => handleVariantChange(idx, 'price', Math.max(0, parseFloat(e.target.value) || 0))} disabled={isLoading} className="h-8 text-xs" /></div>
                          <div className="w-28"><Input id={`v-sku-${idx}`} label={t('menu.constructor.dishes.modal.variantSku')} placeholder="XL-1" value={variant.sku || ''} onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)} disabled={isLoading} className="h-8 text-xs" /></div>
                          <button type="button" onClick={() => handleRemoveVariant(idx)} disabled={isLoading} className="p-1.5 text-brand-gray hover:text-red-500 rounded-lg outline-none disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'characteristics' && <CharacteristicsTab dishForm={dishForm} setDishForm={setDishForm} />}
            {activeTab === 'ingredients' && <IngredientsTab dishForm={dishForm} setDishForm={setDishForm} />}
            {activeTab === 'upsell' && <UpsellTab dishForm={dishForm} setDishForm={setDishForm} currentDishId={currentDishId} />}

            {activeTab === 'modifiers' && (
              <div className="grid grid-cols-2 gap-2 p-2 rounded-xl border border-brand-gray/10 bg-brand-cream/10 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in duration-100">
                {modifierGroups.length === 0 ? (
                  <div className="col-span-2 text-center p-4 text-xs text-brand-gray">{t('menu.constructor.dishes.modal.noModifiers')}</div>
                ) : (
                  modifierGroups.map(group => (
                    <div key={group.id} className="bg-white dark:bg-brand-mocha border border-brand-gray/10 p-2 rounded-lg shadow-xs">
                      <Checkbox
                        id={`mod-${group.id}`}
                        label={<span className="text-xs font-bold">{group.name}</span>}
                        checked={dishForm.modifierIds?.includes(group.id)}
                        disabled={isLoading}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const currentIds = dishForm.modifierIds || [];
                          if (e.target.checked) {
                            setDishForm({ ...dishForm, modifierIds: [...currentIds, group.id] });
                          } else {
                            setDishForm({ ...dishForm, modifierIds: currentIds.filter(id => id !== group.id) });
                          }
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="relative w-full h-40 rounded-2xl border-2 border-dashed border-brand-gray/30 hover:border-brand-copper hover:bg-brand-copper/5 transition-all overflow-hidden group animate-in fade-in duration-100">
                <input type="file" id="dish-image" accept="image/*" className="hidden" onChange={onLocalImageUpload} disabled={isLoading} />
                <label htmlFor="dish-image" className={`absolute inset-0 flex flex-col items-center justify-center bg-brand-cream/10 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <span className="text-span font-bold text-xs">{t('menu.constructor.dishes.modal.mediaHint')}</span>
                </label>
              </div>
            )}
          </div>

          {/* Права частина: Прев'ю смартфона (h-auto self-start фіксує його від розтягування) */}
          <div className="h-auto self-start shrink-0">
            <DishLivePreview form={dishForm} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 mt-auto border-t border-brand-gray/10 dark:border-brand-gray/20 shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={isLoading} className="h-9 text-xs font-semibold">
            {t('menu.constructor.dishes.modal.cancel')}
          </Button>
          <Button variant="brand" className="px-5 h-9 text-xs font-bold shadow-md shadow-brand-copper/10" onClick={handleValidateAndSave} isLoading={isLoading} disabled={isLoading}>
            {t('menu.constructor.dishes.modal.save')}
          </Button>
        </div>
      </div>
    </FloatingPanel>
  );
};