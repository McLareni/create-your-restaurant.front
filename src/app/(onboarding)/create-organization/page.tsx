'use client';

import { Input, Button, Select } from '@/shared/ui';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useCreateOrganization } from '@/features/organizations/hooks/useCreateOrganization';
import { Loader2, CheckCircle2, XCircle, Store } from 'lucide-react';

export default function CreateOrganizationPage() {
  const { t } = useTranslation();
  const { 
    formData, errors, isCheckingSlug, slugAvailable, animationStep, 
    handleChange, handleSubmit 
  } = useCreateOrganization();

  if (animationStep > 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-espresso text-brand-cream">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="relative mx-auto h-24 w-24">
            {animationStep === 4 ? (
              <CheckCircle2 className="h-full w-full text-brand-copper animate-in zoom-in duration-500" />
            ) : (
              <Loader2 className="h-full w-full text-brand-copper animate-spin" />
            )}
          </div>
          
          <h2 className="text-2xl font-serif font-medium transition-all duration-300">
            {animationStep === 1 && t('organization.animation.step1')}
            {animationStep === 2 && `${t('organization.animation.step2')} ${formData.slug}${process.env.NEXT_PUBLIC_DOMAIN_SUFFIX || '.gastro.com'}...`}
            {animationStep === 3 && t('organization.animation.step3')}
            {animationStep === 4 && t('organization.animation.step4')}
          </h2>

          <div className="h-2 w-full bg-brand-mocha rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-copper transition-all duration-1000 ease-in-out"
              style={{ width: `${(animationStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-xl border border-brand-gray/20">
        
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-espresso text-brand-copper">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-espresso">
            {t('organization.create.title')}
          </h1>
          <p className="mt-3 text-brand-gray">
            {t('organization.create.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="col-span-1 md:col-span-2">
              <Input
                id="name"
                label={t('organization.create.nameLabel')}
                placeholder={t('organization.create.namePlaceholder')}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Input
                id="slug"
                label={t('organization.create.slugLabel')}
                hint={t('organization.create.slugHint')}
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                error={errors.slug}
                className={slugAvailable ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
                rightElement={
                  <>
                    <span>{process.env.NEXT_PUBLIC_DOMAIN_SUFFIX || '.gastro.com'}</span>
                    {isCheckingSlug && <Loader2 className="h-4 w-4 animate-spin text-brand-copper" />}
                    {slugAvailable === true && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {slugAvailable === false && <XCircle className="h-4 w-4 text-red-500" />}
                  </>
                }
              />
            </div>

            <Select 
              id="type"
              label={t('organization.create.typeLabel')}
              value={formData.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              error={errors.type}
              className={!formData.type ? 'text-brand-gray/60' : ''}
            >
              <option value="" disabled>{t('organization.create.typePlaceholder')}</option>
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
              className={!formData.currency ? 'text-brand-gray/60' : ''}
            >
              <option value="" disabled>{t('organization.create.currencyPlaceholder')}</option>
              <option value="USD">{t('organization.create.currencies.USD')}</option>
              <option value="EUR">{t('organization.create.currencies.EUR')}</option>
              <option value="GBP">{t('organization.create.currencies.GBP')}</option>
              <option value="JPY">{t('organization.create.currencies.JPY')}</option>
              <option value="CNY">{t('organization.create.currencies.CNY')}</option>
              <option value="RUB">{t('organization.create.currencies.RUB')}</option>
              <option value="PLN">{t('organization.create.currencies.PLN')}</option>
              <option value="UAH">{t('organization.create.currencies.UAH')}</option>
            </Select>

            <div className="col-span-1 md:col-span-2">
              <Select 
                id="language"
                label={t('organization.create.languageLabel')}
                value={formData.language || ''}
                onChange={(e) => handleChange('language', e.target.value)}
                error={errors.language}
                className={!formData.language ? 'text-brand-gray/60' : ''}
              >
                <option value="" disabled>{t('organization.create.languagePlaceholder')}</option>
                <option value="EN">{t('organization.create.languages.EN')}</option>
                <option value="FR">{t('organization.create.languages.FR')}</option>
                <option value="ES">{t('organization.create.languages.ES')}</option>
                <option value="DE">{t('organization.create.languages.DE')}</option>
                <option value="IT">{t('organization.create.languages.IT')}</option>
                <option value="RU">{t('organization.create.languages.RU')}</option>
                <option value="CN">{t('organization.create.languages.CN')}</option>
                <option value="JP">{t('organization.create.languages.JP')}</option>
                <option value="PL">{t('organization.create.languages.PL')}</option>
                <option value="UA">{t('organization.create.languages.UA')}</option>
              </Select>
            </div>

            <div>
              <Input
                id="city"
                label={t('organization.create.cityLabel')}
                placeholder={t('organization.create.cityPlaceholder')}
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                error={errors.city}
              />
            </div>

            <div>
              <Input
                id="phone"
                label={t('organization.create.phoneLabel')}
                placeholder={t('organization.create.phonePlaceholder')}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              variant="brand" 
              type="submit" 
              className="w-full h-14 text-lg"
              disabled={isCheckingSlug || slugAvailable === false}
            >
              {t('organization.create.submitBtn')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}