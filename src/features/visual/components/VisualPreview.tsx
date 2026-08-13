'use client';

import { useState } from 'react';
import { VisualSettings } from '@/shared/config/visual.constants';
import { Search, Plus, X, ShoppingBag } from 'lucide-react';

interface VisualPreviewProps {
  settings: VisualSettings;
}

import { useTranslation } from '@/shared/hooks/useTranslation';

export const VisualPreview = ({ settings }: VisualPreviewProps) => {
  const { t } = useTranslation();
  const [selectedDish, setSelectedDish] = useState<number | null>(null);
  const themeClass = settings.theme === 'dark' ? 'dark' : 'force-light';
  const fontClass = settings.fontFamily || 'font-sans';
  const buttonStyleClass = `button-style-${settings.buttonStyle || 'solid'}`;
  const cardStyle = settings.cardStyle || 'standard';

  const generateCssVars = () => {
    let css = `.preview-theme-root {\n`;
    
    // Force Light Mode variables if dashboard is dark but preview is light
    if (settings.theme === 'light') {
      css += `  --bg-main: #FDFDFB;
  --bg-surface: #FFFFFF;
  --bg-element: #F4F1EC;
  --text-main: #1C1917;
  --text-muted: #78716C;
  --border-main: #E7E5E4;
  --brand-espresso: #0A0A0A;
  --brand-mocha: #1A1A1A;
  --brand-cream: #F4F1EC;
  --brand-gray: #78716C;\n`;
    }
    
    if (settings.primaryColor) {
      const pc = settings.primaryColor;
      css += `  --brand-copper: ${pc};\n`;
      css += `  --brand-emerald: ${pc};\n`;
      css += `  --brand-brown: ${pc};\n`;
      css += `  --color-brand-copper: ${pc};\n`;
      css += `  --color-brand-emerald: ${pc};\n`;
      css += `  --color-brand-brown: ${pc};\n`;
    }
    
    if (settings.borderRadius) {
      const r = settings.borderRadius;
      if (r === '9999px') {
        css += `  --radius-sm: 8px;\n  --radius-md: 12px;\n  --radius-lg: 16px;\n  --radius-xl: 24px;\n  --radius-2xl: 32px;\n  --radius-3xl: 40px;\n`;
      } else {
        css += `  --radius-sm: calc(${r} * 0.5);\n  --radius-md: calc(${r} * 0.75);\n  --radius-lg: ${r};\n  --radius-xl: calc(${r} * 1.25);\n  --radius-2xl: calc(${r} * 1.5);\n  --radius-3xl: calc(${r} * 2);\n`;
      }
    }
    
    if (settings.shadowIntensity === 'none') {
      css += `  --shadow-sm: none;\n  --shadow-md: none;\n  --shadow-lg: none;\n`;
    } else if (settings.shadowIntensity === 'prominent') {
      css += `  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);\n  --shadow-md: 0 12px 32px rgba(0, 0, 0, 0.2);\n  --shadow-lg: 0 20px 48px rgba(0, 0, 0, 0.25);\n`;
    }
    
    css += `}\n`;
    return css;
  };

  const getAddButtonClass = () => {
    if (settings.buttonStyle === 'outline') return 'bg-transparent border border-solid border-brand-copper text-brand-copper';
    if (settings.buttonStyle === 'soft') return 'bg-brand-copper/15 text-brand-copper';
    return 'bg-brand-copper text-white shadow-xs';
  };

  const getCardClasses = () => {
    let base = "group relative flex flex-col justify-between overflow-hidden transition-all p-2.5 ";
    if (cardStyle === 'standard') {
      base += "bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-solid border-brand-espresso/5";
    } else if (cardStyle === 'outline') {
      base += "bg-transparent rounded-2xl border border-solid border-brand-espresso/15";
    } else if (cardStyle === 'flat') {
      base += "bg-transparent rounded-2xl"; // no background, no border
    }
    return base;
  };

  return (
    <div className="relative mx-auto w-[320px] h-[640px] rounded-[2.5rem] border-[8px] border-solid border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden shrink-0">
      {/* Phone Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
        <div className="w-32 h-5 bg-neutral-800 rounded-b-xl"></div>
      </div>
      
      {/* Scrollable Content */}
      <div 
        className={`w-full h-full overflow-y-auto overflow-x-hidden preview-theme-root ${themeClass} ${fontClass} ${buttonStyleClass} bg-brand-cream dark:bg-brand-mocha text-brand-espresso dark:text-brand-cream`}
      >
        <style dangerouslySetInnerHTML={{ __html: generateCssVars() }} />
        
        {/* Header */}
        <div className="bg-brand-cream dark:bg-brand-mocha sticky top-0 z-10 px-4 pt-10 pb-3 border-b border-solid border-brand-espresso/5 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black tracking-tight text-brand-espresso dark:text-brand-cream">
              {t('visual.mock.restaurant')}
            </h1>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-brand-espresso/5 flex items-center justify-center border-0">
                <Search className="w-4 h-4 text-brand-espresso dark:text-brand-cream" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x">
            <div className="snap-start shrink-0 px-4 py-1.5 rounded-full bg-brand-copper text-white text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
              {t('visual.mock.allDishes')}
            </div>
            <div className="snap-start shrink-0 px-4 py-1.5 rounded-full border border-solid border-brand-espresso/10 text-[11px] font-bold uppercase tracking-wider text-brand-gray whitespace-nowrap">
              {t('visual.mock.salads')}
            </div>
            <div className="snap-start shrink-0 px-4 py-1.5 rounded-full border border-solid border-brand-espresso/10 text-[11px] font-bold uppercase tracking-wider text-brand-gray whitespace-nowrap">
              {t('visual.mock.drinks')}
            </div>
            <div className="snap-start shrink-0 px-4 py-1.5 rounded-full border border-solid border-brand-espresso/10 text-[11px] font-bold uppercase tracking-wider text-brand-gray whitespace-nowrap">
              {t('visual.mock.desserts')}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-24">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-espresso dark:text-brand-cream border-b border-solid border-brand-copper/10 pb-2 mb-4">
            {t('visual.mock.popular')}
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                onClick={() => setSelectedDish(i)}
                className={`cursor-pointer ${getCardClasses()}`}
                style={{ borderRadius: `var(--radius-xl)` }}
              >
                <div className="aspect-square w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 mb-3 flex items-center justify-center border border-solid border-brand-espresso/5 overflow-hidden relative">
                  <span className="text-[9px] text-brand-gray opacity-50 font-medium">{t('visual.previewTabs.photo')}</span>
                  {cardStyle === 'flat' && (
                    <div className="absolute inset-0 bg-brand-espresso/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div>
                  <h3 className="mb-1 text-[11px] font-bold leading-tight text-brand-espresso dark:text-brand-cream">
                    {i === 1 ? t('visual.mock.dish1') : i === 2 ? t('visual.mock.dish2') : i === 3 ? t('visual.mock.dish3') : t('visual.mock.dish4')}
                  </h3>
                  <p className="line-clamp-2 text-[9px] font-medium text-brand-gray/80 mb-2">
                    {t('visual.mock.dishDesc')}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-[11px] font-bold text-brand-copper">
                      {i * 125} ₴
                    </span>
                    <button 
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-0 outline-none ${getAddButtonClass()}`}
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      {settings.buttonStyle === 'soft' ? <ShoppingBag className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fixed Bottom Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
           <button
             className="w-full h-12 rounded-2xl bg-brand-copper text-[11px] font-extrabold uppercase tracking-widest text-white shadow-lg flex items-center justify-center gap-2 border-0 outline-none"
             style={{ borderRadius: `var(--radius-xl)` }}
           >
             {t('visual.mock.cart')} (2) • 250 ₴
           </button>
        </div>

        {/* Dummy Modal */}
        {selectedDish !== null && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDish(null)}>
            <div 
              className="w-full h-[80%] bg-brand-cream dark:bg-brand-mocha rounded-t-3xl overflow-hidden flex flex-col transition-transform duration-300"
              style={{ borderRadius: `var(--radius-3xl) var(--radius-3xl) 0 0` }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video bg-neutral-200 dark:bg-neutral-800">
                <button 
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center border-0 outline-none"
                  onClick={() => setSelectedDish(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-2 text-brand-espresso dark:text-brand-cream">
                   {selectedDish === 1 ? t('visual.mock.dish1') : selectedDish === 2 ? t('visual.mock.dish2') : selectedDish === 3 ? t('visual.mock.dish3') : t('visual.mock.dish4')}
                </h2>
                <p className="text-sm text-brand-gray flex-1">
                  {t('visual.mock.detailsDesc')}
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="font-mono text-xl font-bold text-brand-copper flex-1">
                    {selectedDish * 125} ₴
                  </div>
                  <button className="h-12 px-6 rounded-full bg-brand-copper text-white font-bold text-xs uppercase tracking-wider border-0 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> {t('visual.previewCard.add')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
