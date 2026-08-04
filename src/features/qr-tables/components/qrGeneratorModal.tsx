'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Grid, Download, Trash2, Printer, GripHorizontal, ExternalLink, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useQrGeneratorModal } from '@/features/qr-tables/hooks/useQrGeneratorModal';
import { FloatingSidePanel, FloatingSidePanelHeader } from '@/shared/ui/floatingSidePanel';
import type { QrGeneratorModalProps } from '@/features/qr-tables/types/tables.types';

export const QrGeneratorModal = (props: QrGeneratorModalProps) => {
  const { isOpen, onClose, errorMsg, onDelete, onPrint, formData, handleFormDataChange, filteredTypes, showTypeSuggestions, setShowTypeSuggestions, editingTableId, tables } = props;
  const { t } = useTranslation();
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { patternType, setPatternType, logoOverlay, setLogoOverlay, isSidePanelOpen, setIsSidePanelOpen, qrImage, isDragging, isPending, modalRef, handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel, handleFormAction } = useQrGeneratorModal(props);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrImage) return;
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `qr-table-${formData.tableNumber || 'code'}.png`;
    link.click();
  };

  const activeTableUrl = editingTableId ? tables.find(t => t.id === editingTableId)?.qrUrl : null;
  const displayZoneName = formData.type ? (t(`tables.types.${formData.type}`) !== `tables.types.${formData.type}` ? t(`tables.types.${formData.type}`) : formData.type) : '';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent pointer-events-none select-none">
        <div
          ref={modalRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`w-full max-w-4xl mx-auto shrink-0 bg-bg-surface rounded-xl border border-border-main text-text-main overflow-hidden grid grid-cols-1 md:grid-cols-12 pointer-events-auto cursor-grab active:cursor-grabbing relative z-50 main-qr-panel transition-shadow duration-200 ${
            isDragging ? 'shadow-[0_35px_70px_-10px_rgba(28,25,23,0.25)] dark:shadow-[0_35px_70px_-10px_rgba(0,0,0,0.9)] ring-1 ring-brand-emerald/30' : 'shadow-[0_25px_60px_-15px_rgba(28,25,23,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]'
          }`}
        >
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-brand-emerald/5 border border-brand-emerald/30 rounded-full text-[10px] text-brand-emerald font-semibold tracking-wide pointer-events-none">
            <GripHorizontal className="h-3 w-3 animate-pulse text-brand-emerald" />
            <span>{t('qr.modal.draggablePanel')}</span>
          </div>

          <div className="md:col-span-5 bg-neutral-950 p-8 pt-14 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-neutral-900 min-h-112.5 md:min-h-145 pointer-events-none">
            <div className="w-full text-left">
              <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 uppercase">{t('qr.modal.livePreview')}</span>
              <h3 className="text-2xl font-semibold text-white mt-1">{t('qr.modal.brandStyle')}</h3>
            </div>

            <div className="flex flex-col items-center gap-5 my-auto pointer-events-auto">
              <div className="relative p-5 bg-white rounded-xl shadow-xl w-56 h-56 flex items-center justify-center border border-transparent">
                {qrImage ? (
                  <Image src={qrImage} alt={t('qr.modal.brandStyle')} width={224} height={224} unoptimized className="w-full h-full object-contain rounded-md select-none pointer-events-none" />
                ) : (
                  <div className="h-44 w-44 bg-neutral-800 animate-pulse rounded-md" />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button type="button" disabled={!qrImage || isPending} onClick={handleDownload} className="h-9 w-9 bg-neutral-900 border border-neutral-800 hover:border-brand-emerald/50 text-white rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none focus:ring-1 focus:ring-brand-emerald/30">
                  <Download className="h-4 w-4" />
                </button>
                {onPrint && editingTableId && (
                  <button type="button" disabled={isPending} onClick={onPrint} className="h-9 w-9 bg-neutral-900 border border-neutral-800 hover:border-brand-emerald/50 text-white rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer outline-none focus:ring-1 focus:ring-brand-emerald/30 disabled:opacity-40">
                    <Printer className="h-4 w-4" />
                  </button>
                )}
                {activeTableUrl && (
                  <a href={activeTableUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 bg-neutral-900 border border-neutral-800 hover:border-brand-emerald/50 text-white rounded-xl transition-colors duration-200 cursor-pointer outline-none focus:ring-1 focus:ring-brand-emerald/30 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-xs text-neutral-400 italic text-center max-w-60 leading-relaxed">{t('qr.modal.styleDescription')}</p>
          </div>

          <form action={handleFormAction} className="md:col-span-7 p-8 pt-14 flex flex-col justify-between bg-bg-surface cursor-default">
            <div className="absolute top-4 right-4 z-20">
              <button type="button" onClick={onClose} disabled={isPending} className="p-2 rounded-md text-text-muted hover:bg-bg-element hover:text-text-main transition-colors cursor-pointer outline-none disabled:opacity-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="w-full mb-4 select-none">
              <h2 className="text-2xl font-bold tracking-tight text-text-main">{editingTableId ? t('qr.modal.editTitle') : t('qr.modal.createTitle')}</h2>
              <p className="text-xs text-text-muted mt-1">{t('qr.modal.subtitle')}</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2.5 text-xs font-semibold text-red-500 animate-fade-in select-none">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-5 flex-1 relative">
              <div className="select-none">
                <label htmlFor="tableNumberInput" className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2">{t('qr.modal.numberLabel')}</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-text-muted/40 pointer-events-none"><Grid className="h-4 w-4" /></div>
                  <input id="tableNumberInput" type="text" required disabled={isPending} placeholder={t('qr.modal.numberPlaceholder')} value={formData.tableNumber} onChange={(e) => handleFormDataChange({ tableNumber: e.target.value })} className="w-full h-12 pl-11 pr-4 bg-bg-main/40 border border-solid border-neutral-300 dark:border-neutral-700 rounded-md text-sm text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20 transition-all disabled:opacity-50" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0 select-none">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-0.5">{t('qr.modal.typeLabel')} & {t('qr.modal.patternLabel')}</span>
                <button type="button" disabled={isPending} onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className={`h-11 w-full border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer outline-none rounded-md disabled:opacity-50 ${isSidePanelOpen || formData.type ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald shadow-2xs' : 'border-border-main/60 bg-bg-main/20 text-brand-emerald hover:text-brand-emerald-hover hover:bg-brand-emerald/5'}`}>
                  <Plus className={`h-4 w-4 transition-transform duration-200 ${isSidePanelOpen ? 'rotate-45' : ''}`} />
                  <span>{formData.type ? `${t('qr.modal.typeLabel')}: ${displayZoneName}` : t('qr.modal.typePlaceholder')}</span>
                </button>
              </div>

              <div className="space-y-4 pt-2 select-none">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-text-main block">{t('qr.modal.logoLabel')}</span>
                    <span className="text-[11px] text-text-muted">{t('qr.modal.logoDesc')}</span>
                  </div>
                  <button type="button" disabled={isPending} role="switch" aria-checked={logoOverlay} onClick={() => setLogoOverlay(!logoOverlay)} className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${logoOverlay ? 'bg-brand-emerald' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${logoOverlay ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-text-main block">{t('qr.statusActive')}</span>
                    <span className="text-[11px] text-text-muted">{t('qr.modal.statusDesc')}</span>
                  </div>
                  <button type="button" disabled={isPending} role="switch" aria-checked={formData.isActive} onClick={() => handleFormDataChange({ isActive: !formData.isActive })} className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${formData.isActive ? 'bg-brand-emerald' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${formData.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border-main dark:border-neutral-800/60 mt-6 select-none">
              <div>
                {onDelete && editingTableId && (
                  <button type="button" disabled={isPending} onClick={onDelete} className="h-11 px-4 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors duration-150 flex items-center gap-2 cursor-pointer border border-transparent hover:border-red-500/20 disabled:opacity-50">
                    <Trash2 className="h-4 w-4" />
                    {t('qr.modal.deleteBtn')}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} disabled={isPending} className="px-5 h-11 text-xs font-semibold tracking-wide text-text-muted hover:text-text-main hover:bg-bg-element rounded-md transition-colors duration-150 cursor-pointer disabled:opacity-50">{t('qr.modal.cancel')}</button>
                <button type="submit" disabled={isPending} className="px-6 h-11 text-xs font-bold tracking-wide text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-md flex items-center justify-center shadow-md transition-all cursor-pointer border border-brand-emerald/10 disabled:opacity-70 gap-2">
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{t('qr.modal.save')}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <FloatingSidePanel id="qr-style-zone-side-panel" isOpen={isOpen && isSidePanelOpen} targetSelector=".main-qr-panel" side="right" width={320} className={`bg-bg-surface text-text-main border-l border-border-main transition-none! animate-in slide-in-from-right duration-200 ${isDragging ? 'ring-1 ring-brand-emerald/30 shadow-[0_35px_70px_-10px_rgba(28,25,23,0.25)] dark:shadow-[0_35px_70px_-10px_rgba(0,0,0,0.9)]' : ''}`}>
        <FloatingSidePanelHeader title={t('qr.modal.brandStyle')} onClose={() => setIsSidePanelOpen(false)} />
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 custom-scrollbar select-text bg-bg-surface">
          <div className="relative flex flex-col" onFocusCapture={() => { if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current); setShowTypeSuggestions(true); }} onBlurCapture={() => { blurTimeoutRef.current = setTimeout(() => setShowTypeSuggestions(false), 250); }}>
            <label htmlFor="zoneTypeInput" className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2 select-none">{t('qr.modal.typeLabel')}</label>
            <input id="zoneTypeInput" type="text" required disabled={isPending} placeholder={t('qr.modal.typePlaceholder')} value={formData.type} onChange={(e) => handleFormDataChange({ type: e.target.value })} className="w-full h-12 px-4 bg-bg-element border border-border-main rounded-md text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all disabled:opacity-50" />
            
            {showTypeSuggestions && filteredTypes.length > 0 && (
              <div className="suggestions-dropdown absolute top-full left-0 right-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-md border border-border-main bg-bg-surface p-1 shadow-xl custom-scrollbar select-none">
                {filteredTypes.map((typeName) => {
                  const translatedType = t(`tables.types.${typeName}`) !== `tables.types.${typeName}` ? t(`tables.types.${typeName}`) : typeName;
                  return (
                    <button key={typeName} type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); handleFormDataChange({ type: typeName }); setShowTypeSuggestions(false); }} className="flex w-full items-center px-3 h-9 text-xs font-semibold text-text-main rounded-md hover:bg-bg-hover text-left cursor-pointer outline-none transition-colors duration-150">
                      {translatedType}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-solid border-border-main/50 pt-4 select-none">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2">{t('qr.modal.patternLabel')}</label>
            <div className="grid grid-cols-1 gap-2">
              {(['dots', 'squares', 'lines', 'rounded', 'diamonds'] as const).map((style) => (
                <button key={style} type="button" disabled={isPending} onClick={() => setPatternType(style)} className={`h-11 rounded-md text-xs font-medium border capitalize tracking-wide transition-colors duration-150 cursor-pointer text-center outline-none focus:ring-1 focus:ring-brand-emerald/30 disabled:opacity-50 ${patternType === style ? 'border-brand-emerald text-brand-emerald bg-brand-emerald/5 font-semibold' : 'border-border-main text-text-muted hover:bg-bg-hover hover:text-text-main'}`}>
                  {style === 'dots' ? t('qr.modal.pattern.dots') : style === 'squares' ? t('qr.modal.pattern.squares') : style === 'lines' ? t('qr.modal.pattern.lines') : style === 'rounded' ? t('qr.modal.pattern.rounded') : t('qr.modal.pattern.diamonds')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 pb-8 px-4 border-t border-solid border-border-main/60 dark:border-neutral-800/60 flex justify-end shrink-0 mt-auto bg-bg-surface select-none">
          <button type="button" disabled={isPending} onClick={() => setIsSidePanelOpen(false)} className="px-6 h-11 w-full text-xs font-bold tracking-wide text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-md flex items-center justify-center shadow-md transition-all cursor-pointer border border-brand-emerald/10 disabled:opacity-50">
            {t('qr.modal.doneBtn')}
          </button>
        </div>
      </FloatingSidePanel>
    </>
  );
};