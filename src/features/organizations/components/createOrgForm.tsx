'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Input, Button, Select } from '@/shared/ui';
import { 
  Loader2, CheckCircle2, XCircle, Store, ChevronRight, 
  ChevronDown, Image as ImageIcon, Clock, Share2, MapPin
} from 'lucide-react';
import { CreateOrgCard } from '@/features/organizations/components/createOrgCard';
import { CreateOrgFormProps } from '@/features/organizations/types/organization.types';
import { CreateOrganizationValues } from '@/features/organizations/schemas/organization.schema';

export const CreateOrgForm = ({ state }: CreateOrgFormProps) => {
  const { t } = useTranslation();
  const [sidebarPreview, setSidebarPreview] = useState<boolean>(false);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    media: false,
    address: false,
    schedule: true,
    socials: false,
  });
  
  const [socialPlatform1, setSocialPlatform1] = useState<keyof CreateOrganizationValues>('instagram');
  const [socialPlatform2, setSocialPlatform2] = useState<keyof CreateOrganizationValues>('facebook');
  
  const { 
    formData, errors, isCheckingSlug, slugAvailable, isPending, 
    handleChange, handleDaysChange, handleImageChange, formAction 
  } = state;

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const daysOfWeek = [
    { key: 'mon' }, { key: 'tue' }, { key: 'wed' }, 
    { key: 'thu' }, { key: 'fri' }, { key: 'sat' }, { key: 'sun' }
  ] as const;

  const toggleDay = (dayKey: string) => {
    const currentDays = formData.workDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const updatedDays = currentDays.includes(dayKey)
      ? currentDays.filter(d => d !== dayKey)
      : [...currentDays, dayKey];
    
    handleDaysChange(updatedDays);
  };

  const isDaySelected = (dayKey: string) => {
    return (formData.workDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']).includes(dayKey);
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-bg-main text-text-main transition-colors duration-500 pt-12 pb-12 px-4 md:px-8 print:bg-white print:p-0">
      <div className="flex items-start justify-center w-full max-w-6xl p-2 gap-0">
        
        <div className="relative w-full max-w-xl rounded-3xl bg-bg-surface p-6 md:p-10 border border-border-main/80 shadow-2xl z-10
          [&_input]:bg-bg-main/60! [&_input]:text-text-main! [&_input]:border-border-main/60! [&_input]:w-full [&_input]:rounded-xl! [&_input]:focus:border-brand-copper/50!
          [&_select]:bg-bg-main/60! [&_select]:text-text-main! [&_select]:border-border-main/60! [&_select]:w-full [&_select]:rounded-xl! [&_select]:focus:border-brand-copper/50!
          [&_input.border-red-500]:border-red-500! [&_select.border-red-500]:border-red-500!
          [&_label]:text-text-main/90! [&_label]:text-xs! [&_label]:font-bold! [&_label]:uppercase! [&_label]:tracking-wider! 
          [&_span.text-red-500]:text-red-600! [&_span.text-red-500]:font-bold!"
        >
          <button
            type="button"
            onClick={() => setSidebarPreview(!sidebarPreview)}
            className="absolute top-1/2 -right-3.5 -translate-y-1/2 flex h-14 w-7 items-center justify-end pr-1 rounded-r-2xl border-y border-r border-l-0 border-border-main bg-bg-surface text-brand-copper transition-all duration-300 hover:-right-4 hover:w-8 shadow-md group cursor-pointer outline-none z-20"
          >
            <ChevronRight className={`h-4 w-4 transition-transform duration-500 ${sidebarPreview ? 'rotate-180' : ''}`} />
          </button>

          <div className="mb-8 flex flex-col items-center text-center w-full">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-copper/20 to-brand-copper/5 text-brand-copper border border-brand-copper/20 shadow-xs">
              <Store className="h-6 w-6 stroke-[1.8]" />
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight bg-linear-to-r from-text-main to-text-main/80 bg-clip-text text-transparent">
              {t('organization.create.title')}
            </h1>
            <p className="text-xs text-text-muted mt-1.5 font-medium">{t('organization.create.subtitle')}</p>
          </div>

          <form action={formAction} className="space-y-5 w-full">
            <div className="space-y-4">
              <Input 
                id="name" 
                label={t('organization.create.nameLabel')} 
                placeholder={t('organization.create.namePlaceholder')} 
                value={formData.name || ''} 
                onChange={(e) => handleChange('name', e.target.value)} 
                error={errors.name} 
                disabled={isPending} 
                autoComplete="organization" 
              />
              
              <Input 
                id="slug" 
                label={t('organization.create.slugLabel')} 
                hint={t('organization.create.slugHint')} 
                value={formData.slug || ''} 
                onChange={(e) => handleChange('slug', e.target.value)} 
                error={errors.slug} 
                disabled={isPending} 
                autoComplete="off" 
                rightElement={
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-surface/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-border-main h-7 shrink-0 shadow-2xs">
                    <span>{process.env.NEXT_PUBLIC_DOMAIN_SUFFIX || '.gustio.com'}</span>
                    {isCheckingSlug && <Loader2 className="h-3 w-3 animate-spin text-brand-copper" />}
                    {slugAvailable === true && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                    {slugAvailable === false && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                  </div>
                } 
              />

              <div className="grid grid-cols-2 gap-4">
                <Select 
                  id="type" 
                  label={t('organization.create.typeLabel')} 
                  value={formData.type || ''} 
                  onChange={(e) => handleChange('type', e.target.value)} 
                  error={errors.type}
                  disabled={isPending}
                >
                  <option value="" disabled hidden>{t('organization.create.typePlaceholder')}</option>
                  <option value="FAST_FOOD">{t('organization.create.types.FAST_FOOD')}</option>
                  <option value="CASUAL_DINING">{t('organization.create.types.CASUAL_DINING')}</option>
                  <option value="FINE_DINING">{t('organization.create.types.FINE_DINING')}</option>
                  <option value="CAFE">{t('organization.create.types.CAFE')}</option>
                  <option value="BUFFET">{t('organization.create.types.BUFFET')}</option>
                  <option value="FOOD_TRUCK">{t('organization.create.types.FOOD_TRUCK')}</option>
                </Select>
                <Select 
                  id="currency" 
                  label={t('organization.create.currencyLabel')} 
                  value={formData.currency || ''} 
                  onChange={(e) => handleChange('currency', e.target.value)} 
                  error={errors.currency}
                  disabled={isPending}
                >
                  <option value="" disabled hidden>{t('organization.create.currencyPlaceholder')}</option>
                  <option value="UAH">{t('organization.create.currencies.UAH')}</option>
                  <option value="USD">{t('organization.create.currencies.USD')}</option>
                  <option value="EUR">{t('organization.create.currencies.EUR')}</option>
                  <option value="GBP">{t('organization.create.currencies.GBP')}</option>
                  <option value="JPY">{t('organization.create.currencies.JPY')}</option>
                  <option value="CNY">{t('organization.create.currencies.CNY')}</option>
                  <option value="RUB">{t('organization.create.currencies.RUB')}</option>
                  <option value="PLN">{t('organization.create.currencies.PLN')}</option>
                </Select>
              </div>
            </div>

            <div className="relative flex py-4 items-center select-none">
              <div className="grow border-t border-border-main/40"></div>
              <span className="shrink mx-4 text-[9px] font-extrabold uppercase tracking-widest text-brand-copper bg-brand-copper/5 px-3 py-1.5 border border-brand-copper/15 rounded-xl shadow-3xs">
                {t('organization.create.additionalSettings')}
              </span>
              <div className="grow border-t border-border-main/40"></div>
            </div>

            <div className="border border-border-main/50 rounded-2xl overflow-hidden bg-bg-main/10 shadow-3xs group/sec">
              <button type="button" onClick={() => toggleSection('media')} className="w-full flex items-center justify-between p-4.5 text-xs font-bold uppercase tracking-wider text-text-main/80 hover:bg-bg-hover/30 hover:text-text-main transition-all cursor-pointer outline-none">
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="h-4 w-4 text-brand-copper/80 group-hover/sec:text-brand-copper transition-colors" /> 
                  <span>{t('organization.create.mediaTitle')}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-300 ${openSections.media ? 'rotate-180 text-brand-copper' : ''}`} />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openSections.media ? 'grid-rows-[1fr] border-t border-border-main/40 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="p-4">
                    <div className="border border-dashed border-border-main/80 rounded-xl p-5 bg-bg-surface flex flex-col gap-2 hover:border-brand-copper/30 hover:bg-bg-main/5 transition-all relative">
                      <div className="flex items-center gap-4 w-full">
                        <div className="relative h-12 w-12 rounded-xl bg-bg-main border border-border-main flex items-center justify-center text-text-muted overflow-hidden shrink-0 shadow-inner">
                          {formData.imageUrl ? (
                            <Image src={formData.imageUrl} fill className="object-cover" alt="Preview" />
                          ) : (
                            <ImageIcon className="h-5 w-5 stroke-[1.5]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text-main/90">{t('organization.create.mediaLabel')}</p>
                          <p className="text-[10px] text-text-muted font-medium mt-0.5">{t('organization.create.mediaHint')}</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          disabled={isPending}
                          onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])} 
                          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border-main/50 rounded-2xl overflow-hidden bg-bg-main/10 shadow-3xs group/sec">
              <button type="button" onClick={() => toggleSection('schedule')} className="w-full flex items-center justify-between p-4.5 text-xs font-bold uppercase tracking-wider text-text-main/80 hover:bg-bg-hover/30 hover:text-text-main transition-all ease-in-out duration-200 cursor-pointer outline-none">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-brand-copper/80 group-hover/sec:text-brand-copper transition-colors" /> 
                  <span>{t('organization.create.scheduleTitle')}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-300 ${openSections.schedule ? 'rotate-180 text-brand-copper' : ''}`} />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openSections.schedule ? 'grid-rows-[1fr] border-t border-border-main/40 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="p-5 space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-bg-main/50 p-1.5 rounded-2xl border border-border-main/50 gap-1">
                        {daysOfWeek.map((day) => {
                          const selected = isDaySelected(day.key);
                          return (
                            <button
                              key={day.key}
                              type="button"
                              disabled={isPending}
                              onClick={() => toggleDay(day.key)}
                              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 cursor-pointer outline-none disabled:opacity-50 ${
                                selected ? 'bg-bg-surface text-brand-copper border border-border-main/60 shadow-xs font-bold' : 'bg-transparent text-text-muted border border-transparent hover:text-text-main'
                              }`}
                            >
                              <span className="text-xs tracking-tight">{t(`organization.create.days.${day.key}`)}</span>
                              <div className={`h-1 rounded-full mt-1.5 transition-all ${selected ? 'bg-brand-copper w-3' : 'bg-text-muted/30 w-1'}`} />
                            </button>
                          );
                        })}
                      </div>
                      {errors.workDays && <span className="text-xs text-red-500 block font-bold">{errors.workDays}</span>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-main/60 flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-brand-copper/80" /> {t('organization.create.hoursLabel')}
                      </label>
                      <div className="grid grid-cols-2 gap-4 bg-bg-main/30 p-4 rounded-2xl border border-border-main/40">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">{t('organization.create.openLabel')}</span>
                          <Input id="workHoursStart" type="time" value={formData.workHoursStart || '10:00'} onChange={(e) => handleChange('workHoursStart', e.target.value)} error={errors.workHoursStart} disabled={isPending} className="text-center font-mono font-bold border-none! bg-bg-surface!" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">{t('organization.create.closeLabel')}</span>
                          <Input id="workHoursEnd" type="time" value={formData.workHoursEnd || '22:00'} onChange={(e) => handleChange('workHoursEnd', e.target.value)} error={errors.workHoursEnd} disabled={isPending} className="text-center font-mono font-bold border-none! bg-bg-surface!" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border-main/50 rounded-2xl overflow-hidden bg-bg-main/10 shadow-3xs group/sec">
              <button type="button" onClick={() => toggleSection('address')} className="w-full flex items-center justify-between p-4.5 text-xs font-bold uppercase tracking-wider text-text-main/80 hover:bg-bg-hover/30 hover:text-text-main transition-all cursor-pointer outline-none">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-brand-copper/80 group-hover/sec:text-brand-copper transition-colors" /> 
                  <span>{t('organization.create.locationTitle')}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-300 ${openSections.address ? 'rotate-180 text-brand-copper' : ''}`} />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openSections.address ? 'grid-rows-[1fr] border-t border-border-main/40 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input id="city" label={t('organization.create.cityLabel')} placeholder={t('organization.create.cityPlaceholder')} value={formData.city || ''} onChange={(e) => handleChange('city', e.target.value)} error={errors.city} disabled={isPending} autoComplete="address-level2" />
                    <Input id="street" label={t('organization.create.streetLabel')} placeholder={t('organization.create.streetPlaceholder')} value={formData.street || ''} onChange={(e) => handleChange('street', e.target.value)} error={errors.street} disabled={isPending} autoComplete="address-line1" />
                    <Input id="building" label={t('organization.create.buildingLabel')} placeholder={t('organization.create.buildingPlaceholder')} value={formData.building || ''} onChange={(e) => handleChange('building', e.target.value)} error={errors.building} disabled={isPending} autoComplete="off" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border-main/50 rounded-2xl overflow-hidden bg-bg-main/10 shadow-3xs group/sec">
              <button type="button" onClick={() => toggleSection('socials')} className="w-full flex items-center justify-between p-4.5 text-xs font-bold uppercase tracking-wider text-text-main/80 hover:bg-bg-hover/30 hover:text-text-main transition-all cursor-pointer outline-none">
                <div className="flex items-center gap-2.5">
                  <Share2 className="h-4 w-4 text-brand-copper/80 group-hover/sec:text-brand-copper transition-colors" /> 
                  <span>{t('organization.create.socialsTitle')}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-300 ${openSections.socials ? 'rotate-180 text-brand-copper' : ''}`} />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openSections.socials ? 'grid-rows-[1fr] border-t border-border-main/40 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="p-4 space-y-4">
                    <Input id="phone" label={t('organization.create.phoneLabel')} placeholder={t('organization.create.phonePlaceholder')} value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} error={errors.phone} disabled={isPending} autoComplete="tel" />
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-main/80 block">{t('organization.create.mainChannel')}</label>
                      <div className="flex gap-2.5 items-center">
                        <div className="w-1/3">
                          <Select value={String(socialPlatform1)} disabled={isPending} onChange={(e) => { handleChange(socialPlatform1, ''); setSocialPlatform1(e.target.value as keyof CreateOrganizationValues); }}>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="telegram">Telegram</option>
                            <option value="tiktok">TikTok</option>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Input id={String(socialPlatform1)} placeholder="username" value={(formData[socialPlatform1] as string) || ''} onChange={(e) => handleChange(socialPlatform1, e.target.value)} error={errors[socialPlatform1]} disabled={isPending} autoComplete="off" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-main/80 block">{t('organization.create.additionalChannel')}</label>
                      <div className="flex gap-2.5 items-center">
                        <div className="w-1/3">
                          <Select value={String(socialPlatform2)} disabled={isPending} onChange={(e) => { handleChange(socialPlatform2, ''); setSocialPlatform2(e.target.value as keyof CreateOrganizationValues); }}>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="telegram">Telegram</option>
                            <option value="tiktok">TikTok</option>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Input id={String(socialPlatform2)} placeholder="username" value={(formData[socialPlatform2] as string) || ''} onChange={(e) => handleChange(socialPlatform2, e.target.value)} error={errors[socialPlatform2]} disabled={isPending} autoComplete="off" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 w-full">
              <Button variant="brand" type="submit" className="w-full h-12 rounded-xl text-sm font-bold shadow-md transition-all active:scale-98" isLoading={isPending} disabled={isPending || isCheckingSlug || slugAvailable === false}>
                {t('organization.create.submitBtn')}
              </Button>
            </div>
          </form>
        </div>

        <div className={`transition-all duration-500 ease-in-out origin-left flex items-start justify-center print:flex print:opacity-100 ${sidebarPreview ? 'w-110 opacity-100 pl-8 visible' : 'w-0 opacity-0 pl-0 overflow-hidden invisible'}`}>
          <CreateOrgCard formData={formData} />
        </div>

      </div>
    </div>
  );
};