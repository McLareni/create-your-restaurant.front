'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface CreateOrgAnimationProps {
  state: any; 
}

export const CreateOrgAnimation = ({ state }: CreateOrgAnimationProps) => {
  const { t } = useTranslation();
  const { animationStep, formData } = state;

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
};