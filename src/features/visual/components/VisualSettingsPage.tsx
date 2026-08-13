'use client';

import { useState } from 'react';
import { useVisual } from '@/features/visual/hooks/useVisual';
import { 
  AVAILABLE_THEMES, 
  AVAILABLE_COLORS, 
  AVAILABLE_BORDER_RADII,
  AVAILABLE_FONTS,
  AVAILABLE_BUTTON_STYLES,
  AVAILABLE_SHADOWS,
  AVAILABLE_CARD_STYLES,
  DEFAULT_VISUAL_SETTINGS,
  VisualSettings 
} from '@/shared/config/visual.constants';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Loader2, Palette, Droplet, Scaling, Save, Smartphone, Check, Type, MousePointerClick, Cloud } from 'lucide-react';
import { VisualPreview } from './VisualPreview';
import { LayoutTemplate } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function VisualSettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useVisual();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-bg-main">
        <Loader2 className="h-8 w-8 animate-spin text-brand-emerald" />
      </div>
    );
  }

  return (
    <VisualSettingsForm 
      key={settings ? 'loaded' : 'default'} 
      initialSettings={settings} 
      updateSettings={updateSettings} 
      isUpdating={isUpdating} 
    />
  );
}

function VisualSettingsForm({ initialSettings, updateSettings, isUpdating }: { initialSettings: VisualSettings | null | undefined, updateSettings: (settings: VisualSettings) => void, isUpdating: boolean }) {
  const { t } = useTranslation();
  const [localSettings, setLocalSettings] = useState<VisualSettings>({
    ...DEFAULT_VISUAL_SETTINGS,
    ...(initialSettings || {}),
  });
  const [activeTab, setActiveTab] = useState<'colors' | 'shapes' | 'typography'>('colors');

  const handleSave = () => {
    updateSettings(localSettings);
  };



  return (
    <div className="flex h-full flex-col bg-bg-main p-6 text-text-main transition-colors duration-300">
      <div className="mb-8 border-b border-solid border-border-main/60 pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-brand-emerald/10 rounded-xl text-brand-emerald border border-solid border-brand-emerald/20">
              <Palette className="h-6 w-6" />
            </div>
            {t('visual.title')}
          </h1>
          <p className="mt-2 text-xs text-text-muted font-light max-w-2xl leading-relaxed">
            {t('visual.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center">
          <Button 
            onClick={handleSave} 
            disabled={isUpdating}
            variant="brand" 
            className="h-11 px-6 text-xs font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-xl shadow-md border-0 cursor-pointer flex items-center gap-2"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isUpdating ? t('visual.savingBtn') : t('visual.saveBtn')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Settings Column */}
        <div className="flex flex-col gap-6">
          {/* Tabs Navigation */}
          <div className="flex bg-bg-surface p-1 rounded-xl border border-solid border-border-main/60 w-fit">
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors border-0 outline-none cursor-pointer ${activeTab === 'colors' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-transparent text-text-muted hover:text-text-main'}`}
            >
              {t('visual.tabs.colors')}
            </button>
            <button
              onClick={() => setActiveTab('shapes')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors border-0 outline-none cursor-pointer ${activeTab === 'shapes' ? 'bg-purple-500/10 text-purple-600' : 'bg-transparent text-text-muted hover:text-text-main'}`}
            >
              {t('visual.tabs.shapes')}
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors border-0 outline-none cursor-pointer ${activeTab === 'typography' ? 'bg-orange-500/10 text-orange-600' : 'bg-transparent text-text-muted hover:text-text-main'}`}
            >
              {t('visual.tabs.typography')}
            </button>
          </div>

          {activeTab === 'colors' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
              <Smartphone className="h-4 w-4 text-brand-emerald" />
              <h3 className="font-bold text-sm text-text-main tracking-tight">{t('visual.theme')}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AVAILABLE_THEMES.map((theme) => {
                const isActive = localSettings.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setLocalSettings({ ...localSettings, theme: theme.id })}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-solid transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "border-brand-emerald bg-brand-emerald/10 shadow-sm"
                        : "border-border-main/60 bg-bg-main hover:border-brand-emerald/50"
                    }`}
                  >
                    <div className={`p-3 rounded-full ${isActive ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-bg-surface text-text-muted'}`}>
                      {theme.id === 'light' ? (
                        <div className="w-5 h-5 rounded-full border-2 border-current bg-white" />
                      ) : theme.id === 'dark' ? (
                        <div className="w-5 h-5 rounded-full border-2 border-current bg-neutral-800" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current bg-gradient-to-tr from-neutral-800 to-white" />
                      )}
                    </div>
                    <span className={`text-xs font-bold ${isActive ? 'text-brand-emerald' : 'text-text-main'}`}>
                      {t(theme.label)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
              <Droplet className="h-4 w-4 text-blue-500" />
              <h3 className="font-bold text-sm text-text-main tracking-tight">{t('visual.accentColor')}</h3>
            </div>
            
            <p className="text-[10px] text-text-muted font-light mb-4">
              {t('visual.accentDesc')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {AVAILABLE_COLORS.map((color) => {
                const isActive = localSettings.primaryColor === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => setLocalSettings({ ...localSettings, primaryColor: color.id })}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 cursor-pointer shadow-sm ${
                      isActive
                        ? "scale-110 border-text-main shadow-md"
                        : "border-transparent hover:scale-105 hover:shadow-md"
                    }`}
                    style={{ backgroundColor: color.id }}
                    title={t(color.label)}
                  >
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
          </div>
          )}

          {activeTab === 'shapes' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <Scaling className="h-4 w-4 text-purple-500" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{t('visual.cornerRadius')}</h3>
          </div>
          
          <p className="text-[10px] text-text-muted font-light mb-5">
            {t('visual.cornerDesc')}
          </p>

          <div className="flex flex-col gap-4">
            {AVAILABLE_BORDER_RADII.map((radius) => {
              const isActive = localSettings.borderRadius === radius.id;
              return (
                <button
                  key={radius.id}
                  onClick={() => setLocalSettings({ ...localSettings, borderRadius: radius.id })}
                  className={`relative flex items-center justify-between p-4 border border-solid transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-purple-500 bg-purple-500/5 shadow-sm"
                      : "border-border-main/60 bg-bg-main hover:border-purple-500/50"
                  }`}
                  style={{ borderRadius: radius.id }}
                >
                  <span className={`text-xs font-bold ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-text-main'}`}>
                    {t(radius.label)}
                  </span>
                  
                  {isActive && (
                    <div className="bg-purple-500/10 p-1 rounded-full">
                      <Check className="h-4 w-4 text-purple-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          </Card>



        <Card className="p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <MousePointerClick className="h-4 w-4 text-pink-500" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{t('visual.buttonStyle')}</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {AVAILABLE_BUTTON_STYLES.map((style) => {
              const isActive = localSettings.buttonStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setLocalSettings({ ...localSettings, buttonStyle: style.id })}
                  className={`relative flex items-center justify-between p-4 border border-solid transition-all duration-200 cursor-pointer rounded-xl ${
                    isActive
                      ? "border-pink-500 bg-pink-500/5 shadow-sm"
                      : "border-border-main/60 bg-bg-main hover:border-pink-500/50"
                  }`}
                >
                  <span className={`text-xs font-bold ${isActive ? 'text-pink-600 dark:text-pink-400' : 'text-text-main'}`}>
                    {t(style.label)}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <Cloud className="h-4 w-4 text-indigo-500" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{t('visual.shadows')}</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {AVAILABLE_SHADOWS.map((shadow) => {
              const isActive = localSettings.shadowIntensity === shadow.id;
              return (
                <button
                  key={shadow.id}
                  onClick={() => setLocalSettings({ ...localSettings, shadowIntensity: shadow.id })}
                  className={`relative flex items-center justify-between p-4 border border-solid transition-all duration-200 cursor-pointer rounded-xl ${
                    isActive
                      ? "border-indigo-500 bg-indigo-500/5 shadow-sm"
                      : "border-border-main/60 bg-bg-main hover:border-indigo-500/50"
                  }`}
                >
                  <span className={`text-xs font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-text-main'}`}>
                    {t(shadow.label)}
                  </span>
                </button>
              );
            })}
          </div>
          </Card>
          
          <Card className="p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <LayoutTemplate className="h-4 w-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{t('visual.cardStyle')}</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {AVAILABLE_CARD_STYLES.map((style) => {
              const isActive = localSettings.cardStyle === style.id || (!localSettings.cardStyle && style.id === 'standard');
              return (
                <button
                  key={style.id}
                  onClick={() => setLocalSettings({ ...localSettings, cardStyle: style.id })}
                  className={`relative flex items-center justify-between p-4 border border-solid transition-all duration-200 cursor-pointer rounded-xl ${
                    isActive
                      ? "border-emerald-500 bg-emerald-500/5 shadow-sm"
                      : "border-border-main/60 bg-bg-main hover:border-emerald-500/50"
                  }`}
                >
                  <span className={`text-xs font-bold ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-main'}`}>
                    {t(style.label)}
                  </span>
                </button>
              );
            })}
          </div>
          </Card>
          </div>
          )}

          {activeTab === 'typography' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="p-6! bg-bg-surface border border-solid border-border-main/60 rounded-xl shadow-table flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-solid border-border-main/60">
            <Type className="h-4 w-4 text-orange-500" />
            <h3 className="font-bold text-sm text-text-main tracking-tight">{t('visual.fontFamily')}</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {AVAILABLE_FONTS.map((font) => {
              const isActive = localSettings.fontFamily === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => setLocalSettings({ ...localSettings, fontFamily: font.id })}
                  className={`relative flex flex-col items-start p-4 border border-solid transition-all duration-200 cursor-pointer rounded-xl ${
                    isActive
                      ? "border-orange-500 bg-orange-500/5 shadow-sm"
                      : "border-border-main/60 bg-bg-main hover:border-orange-500/50"
                  } ${font.id}`}
                >
                  <span className={`text-sm font-bold ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-text-main'}`}>
                    {t(font.label)}
                  </span>
                  <span className="text-[10px] text-text-muted mt-1">{t('visual.fontSample')}</span>
                </button>
              );
            })}
          </div>
          </Card>
          </div>
          )}
        </div>
        
        {/* Preview Column */}
        <div className="sticky top-6 flex justify-center xl:justify-end">
          <VisualPreview settings={localSettings} />
        </div>
      </div>
    </div>
  );
}
