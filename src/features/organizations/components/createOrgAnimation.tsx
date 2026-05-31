'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Loader2 } from 'lucide-react';
import { CreateOrgAnimationProps } from '../types/organization.types';

export const CreateOrgAnimation = ({ state }: CreateOrgAnimationProps) => {
  const { t } = useTranslation();
  const { animationStep, formData } = state;

  const getStepText = () => {
    switch (animationStep) {
      case 1:
        return t('organization.animation.step1');
      case 2:
        return `${t('organization.animation.step2')} ${formData.slug}${process.env.NEXT_PUBLIC_DOMAIN_SUFFIX || '.gastro.com'}...`;
      case 3:
        return t('organization.animation.step3');
      case 4:
        return t('organization.animation.step4');
      default:
        return '';
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-brand-cream dark:bg-brand-espresso p-6 text-center transition-colors">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-brand-mocha p-8 shadow-xl border border-brand-gray/20 flex flex-col items-center gap-6">
        {animationStep < 4 ? (
          <Loader2 className="h-12 w-12 animate-spin text-brand-copper" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-2xl font-bold">✓</div>
        )}
        <p className="text-base font-medium text-brand-espresso dark:text-brand-cream animate-pulse">
          {getStepText()}
        </p>
      </div>
    </div>
  );
};