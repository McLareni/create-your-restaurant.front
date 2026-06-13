'use client';

import { useState } from 'react';
import { Phone, MapPin, Printer, Globe, Clock, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { CreateOrgCardProps } from '@/features/organizations/types/organization.types';

const formatPhone = (raw: string | undefined): string => {
  if (!raw) return '';
  const clean = raw.replace(/\D/g, '');
  
  if (clean.startsWith('380') && clean.length === 12) {
    return `+380 ${clean.substring(3, 5)} ${clean.substring(5, 8)} ${clean.substring(8, 10)} ${clean.substring(10, 12)}`;
  }
  if (clean.startsWith('48') && clean.length === 11) {
    return `+48 ${clean.substring(2, 5)} ${clean.substring(5, 8)} ${clean.substring(8, 11)}`;
  }
  if (clean.length === 9) {
    return `${clean.substring(0, 3)} ${clean.substring(3, 6)} ${clean.substring(6, 9)}`;
  }
  return raw.startsWith('+') ? raw : '+' + clean;
};

const formatWorkDays = (days: string[] | undefined, t: (key: string) => string): string => {
  if (!days || days.length === 0) return t('organization.create.days.all');
  const order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const sorted = [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return sorted.map(d => t(`organization.create.days.${d}`)).join(', ');
};

export const CreateOrgCard = ({ formData }: CreateOrgCardProps) => {
  const { t } = useTranslation();
  const [variant, setVariant] = useState<'classic' | 'elegant'>('elegant');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const isElegant = variant === 'elegant';

  const domainSuffix = process.env.NEXT_PUBLIC_DOMAIN_SUFFIX || '.gustio.com';

  const styles = {
    cardBg: isElegant 
      ? 'bg-zinc-950 text-[#F5EFE6] border-zinc-800/80 shadow-2xl relative' 
      : 'bg-[#FAF9F6] text-zinc-900 border-zinc-300 shadow-2xl relative',
    titleText: 'text-lg font-black tracking-tight truncate leading-none relative z-10 text-white',
    goldText: isElegant ? 'text-brand-emerald font-semibold tracking-wide relative z-10' : 'text-brand-emerald font-semibold tracking-wide relative z-10',
    badge: isElegant ? 'bg-white/5 border-white/10 text-brand-emerald backdrop-blur-md relative z-10' : 'bg-brand-emerald/5 border-brand-emerald/10 text-brand-emerald relative z-10',
    iconColor: isElegant ? 'text-brand-emerald relative z-10' : 'text-brand-emerald relative z-10',
  };

  const fullAddress = [
    formData.city,
    formData.street ? `${t('organization.create.addressStreetPrefix')} ${formData.street}` : '',
    formData.building ? formData.building : ''
  ].filter(Boolean).join(', ') || t('organization.create.cardAddressPlaceholder');

  const workDaysText = formatWorkDays(formData.workDays, t);
  const initialLetter = formData.name ? formData.name[0].toUpperCase() : 'G';

  return (
    <div className="flex flex-col items-start pt-2 w-100 shrink-0 relative select-none print:pt-0 print:w-[85mm] print:h-[55mm]">
      <div className="w-full flex items-center justify-between mb-5 print:hidden gap-3">
        <div className="flex bg-bg-element p-1 rounded-xl border border-border-main gap-1 shadow-inner h-9 items-center">
          {(['classic', 'elegant'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`px-3 h-7 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer outline-none border-0 select-none ${
                variant === v 
                  ? 'bg-brand-emerald text-white shadow-xs' 
                  : 'text-text-muted hover:text-text-main bg-transparent'
              }`}
            >
              {t(`organization.create.variants.${v}`)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 h-9">
          <button 
            type="button"
            onClick={() => setIsFlipped(!isFlipped)} 
            className="h-9 text-[11px] font-bold px-3.5 gap-1.5 border border-border-main bg-bg-surface text-text-main hover:bg-bg-hover rounded-xl shadow-2xs active:scale-95 flex items-center justify-center transition-all cursor-pointer outline-none select-none"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-text-muted transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
            <span>{t('organization.create.cardFlipBtn')}</span>
          </button>
          <button 
            type="button" 
            onClick={() => window.print()} 
            className="h-9 text-[11px] font-bold px-3.5 gap-1.5 border border-border-main bg-bg-surface text-text-main hover:bg-bg-hover rounded-xl shadow-2xs active:scale-95 flex items-center justify-center transition-all cursor-pointer outline-none select-none"
          >
            <Printer className="h-3.5 w-3.5 text-text-muted" /> 
            <span>{t('organization.create.cardPrintBtn')}</span>
          </button>
        </div>
      </div>

      <div className="w-100 h-64 group cursor-pointer perspective-[1000px] print:w-[85mm] print:h-[55mm]">
        <div className={`w-full h-full relative transition-transform duration-500 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''} print:transform-none`}>
          <div className={`absolute inset-0 w-full h-full rounded-3xl border p-6 flex flex-col justify-between overflow-hidden backface-hidden print:inset-auto ${styles.cardBg}`}>
            
            {isElegant && formData.imageUrl && (
              <>
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center opacity-25 scale-105"
                  style={{ backgroundImage: `url(${formData.imageUrl})` }}
                />
                <div className="absolute inset-0 z-0 bg-linear-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
              </>
            )}

            <div className="flex justify-between items-start w-full relative z-10 border-b border-border-main/10 pb-3">
              <div className="flex gap-3.5 items-center min-w-0 flex-1">
                <div className={`h-11 w-11 rounded-xl shrink-0 flex items-center justify-center border border-white/20 font-extrabold text-base shadow-md ${isElegant ? 'bg-white/10 text-brand-emerald backdrop-blur-md' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                  {initialLetter}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <h2 className={isElegant ? styles.titleText : 'text-lg font-black tracking-tight truncate leading-none text-zinc-900'}>
                    {formData.name || t('organization.create.nameLabel')}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest border shadow-2xs ${styles.badge}`}>
                      {formData.type ? t(`organization.create.types.${formData.type}`) : t('organization.create.cardMenuBadge')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 relative z-10 w-full mt-auto">
              <div className="flex items-center gap-3 text-xs">
                <Globe className={`h-3.5 w-3.5 shrink-0 stroke-[2.2] ${styles.iconColor}`} />
                <span className={styles.goldText}>{formData.slug ? `${formData.slug}${domainSuffix}` : `address${domainSuffix}`}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Clock className={`h-3.5 w-3.5 shrink-0 stroke-[2.2] ${styles.iconColor}`} />
                <span className={styles.goldText}>{workDaysText}: {formData.workHoursStart || '10:00'} — {formData.workHoursEnd || '22:00'}</span>
              </div>
              <div className="flex items-center gap-3 w-full text-xs">
                <MapPin className={`h-3.5 w-3.5 shrink-0 stroke-[2.2] ${styles.iconColor}`} />
                <span className={`truncate block ${styles.goldText}`}>{fullAddress}</span>
              </div>
              <div className="flex items-center gap-3 w-full text-xs">
                <Phone className={`h-3.5 w-3.5 shrink-0 stroke-[2.2] ${styles.iconColor}`} />
                <span className={`truncate block font-medium tracking-wide ${styles.goldText}`}>
                  {formData.phone ? formatPhone(formData.phone) : t('organization.create.cardPhonePlaceholder')}
                </span>
              </div>
            </div>
          </div>

          <div className={`absolute inset-0 w-full h-full rounded-3xl border p-6 flex items-center justify-center overflow-hidden backface-hidden transform-[rotateY(180deg)] print:inset-auto ${styles.cardBg}`}>
            <div className="text-center relative z-10 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col items-center gap-2">
              <div className="w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center">
                <Globe className="h-16 w-16 text-zinc-900 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-medium tracking-wider uppercase text-brand-emerald">
                {formData.slug ? `${formData.slug}${domainSuffix}` : 'gustio.com'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};