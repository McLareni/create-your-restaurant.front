'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Grid, Download, Trash2, Printer, GripHorizontal, ExternalLink, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { QrGeneratorModalProps } from '@/features/qr-tables/types/tables.types';
import { useQrGeneratorModal } from '@/features/qr-tables/hooks/useQrGeneratorModal';

export const QrGeneratorModal = (props: QrGeneratorModalProps) => {
  const { 
    isOpen, 
    onClose, 
    errorMsg, 
    onDelete, 
    onPrint, 
    formData, 
    handleFormDataChange, 
    filteredTypes, 
    showTypeSuggestions, 
    setShowTypeSuggestions, 
    editingTableId, 
    tables 
  } = props;
  
  const { t } = useTranslation();
  
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    patternType,
    setPatternType,
    logoOverlay,
    setLogoOverlay,
    qrImage,
    isDragging,
    isPending,
    modalRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleFormAction,
  } = useQrGeneratorModal(props);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent pointer-events-none select-none">
      <div
        ref={modalRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`w-full max-w-4xl mx-auto shrink-0 bg-bg-surface rounded-3xl border border-border-main text-text-main overflow-hidden grid grid-cols-1 md:grid-cols-12 pointer-events-auto cursor-grab active:cursor-grabbing relative z-50 ${
          isDragging 
            ? 'shadow-[0_35px_70px_-10px_rgba(28,25,23,0.25)] dark:shadow-[0_35px_70px_-10px_rgba(0,0,0,0.9)] ring-1 ring-emerald-500/30' 
            : 'shadow-[0_25px_60px_-15px_rgba(28,25,23,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]'
        }`}
      >
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 border border-emerald-500/30 rounded-full text-[10px] text-emerald-400 font-semibold tracking-wide pointer-events-none">
          <GripHorizontal className="h-3 w-3 animate-pulse text-emerald-500" />
          <span>{t('qr.modal.draggablePanel')}</span>
        </div>

        <div className="md:col-span-5 bg-neutral-950 p-8 pt-14 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-neutral-900 min-h-112.5 md:min-h-145 pointer-events-none">
          <div className="w-full text-left">
            <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 uppercase">
              {t('qr.modal.livePreview')}
            </span>
            <h3 className="text-2xl font-semibold text-white mt-1">
              {t('qr.modal.brandStyle')}
            </h3>
          </div>

          <div className="flex flex-col items-center gap-5 my-auto pointer-events-auto">
            <div className="relative p-5 bg-white rounded-3xl shadow-xl w-56 h-56 flex items-center justify-center border border-transparent">
              {qrImage ? (
                <Image src={qrImage} alt={t('qr.modal.brandStyle')} width={224} height={224} unoptimized className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div className="h-44 w-44 bg-neutral-800 animate-pulse rounded-xl" />
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                type="button"
                disabled={!qrImage}
                onClick={handleDownload}
                className="h-9 w-9 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-white rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={t('qr.actions.download')}
              >
                <Download className="h-4 w-4" />
              </button>
              {onPrint && editingTableId && (
                <button
                  type="button"
                  onClick={onPrint}
                  className="h-9 w-9 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-white rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  title={t('qr.actions.print')}
                >
                  <Printer className="h-4 w-4" />
                </button>
              )}
              {activeTableUrl && (
                <a
                  href={activeTableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-white rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  title={t('qr.actions.showQr')}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-xs text-neutral-400 italic text-center max-w-60 leading-relaxed">
            {t('qr.modal.styleDescription')}
          </p>
        </div>

        <form action={handleFormAction} className="md:col-span-7 p-8 pt-14 flex flex-col justify-between bg-bg-surface cursor-default">
          <div className="absolute top-4 right-4 z-20">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:bg-bg-element hover:text-text-main transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="w-full mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-text-main">
              {editingTableId ? t('qr.modal.editTitle') : t('qr.modal.createTitle')}
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {t('qr.modal.subtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-500 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-5 flex-1 relative">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2">
                {t('qr.modal.numberLabel')}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-text-muted">
                  <Grid className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder={t('qr.modal.numberPlaceholder')}
                  value={formData.tableNumber}
                  onChange={(e) => handleFormDataChange({ tableNumber: e.target.value })}
                  className="w-full h-12 pl-11 pr-4 bg-bg-element border border-border-main rounded-xl text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <div 
              className="relative flex flex-col" 
              onFocusCapture={() => {
                if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                setShowTypeSuggestions(true);
              }} 
              onBlurCapture={() => {
                blurTimeoutRef.current = setTimeout(() => setShowTypeSuggestions(false), 250);
              }}
            >
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2">
                {t('qr.modal.typeLabel')}
              </label>
              <input
                type="text"
                required
                placeholder={t('qr.modal.typePlaceholder')}
                value={formData.type}
                onChange={(e) => handleFormDataChange({ type: e.target.value })}
                className="w-full h-12 px-4 bg-bg-element border border-border-main rounded-xl text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              
              {showTypeSuggestions && filteredTypes.length > 0 && (
                <div className="suggestions-dropdown absolute top-full left-0 right-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border-main bg-bg-surface p-1 shadow-xl custom-scrollbar">
                  {filteredTypes.map((typeName) => {
                    const translatedType = t(`tables.types.${typeName}`) !== `tables.types.${typeName}` ? t(`tables.types.${typeName}`) : typeName;
                    return (
                      <button
                        key={typeName}
                        type="button"
                        onClick={() => {
                          handleFormDataChange({ type: typeName });
                          setShowTypeSuggestions(false);
                        }}
                        className="flex w-full items-center px-3 h-9 text-xs font-semibold text-text-main rounded-lg hover:bg-bg-hover text-left cursor-pointer outline-none transition-colors duration-150"
                      >
                        {translatedType}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2">
                {t('qr.modal.patternLabel')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['dots', 'squares', 'lines'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setPatternType(style)}
                    className={`h-11 rounded-xl text-xs font-medium border capitalize tracking-wide transition-colors duration-150 cursor-pointer ${
                      patternType === style
                        ? 'border-emerald-600 text-emerald-600 bg-emerald-500/5 font-semibold'
                        : 'border-border-main text-text-muted hover:bg-bg-hover hover:text-text-main'
                    }`}
                  >
                    {style === 'dots' ? t('qr.modal.pattern.dots') : style === 'squares' ? t('qr.modal.pattern.squares') : t('qr.modal.pattern.lines')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-main block">{t('qr.modal.logoLabel')}</span>
                  <span className="text-[11px] text-text-muted">{t('qr.modal.logoDesc')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLogoOverlay(!logoOverlay)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    logoOverlay ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-800'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                    logoOverlay ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-main block">{t('qr.statusActive')}</span>
                  <span className="text-[11px] text-text-muted">{t('qr.modal.statusDesc')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleFormDataChange({ isActive: !formData.isActive })}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    formData.isActive ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-800'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                    formData.isActive ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border-main dark:border-neutral-800/60 mt-6">
            <div>
              {onDelete && editingTableId && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isPending}
                  className="h-11 px-4 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors duration-150 flex items-center gap-2 cursor-pointer border border-transparent hover:border-red-500/20 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('qr.modal.deleteBtn')}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-5 h-11 text-xs font-semibold tracking-wide text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-50"
              >
                {t('qr.modal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 h-11 text-xs font-bold tracking-wide text-white bg-linear-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:brightness-110 active:scale-98 rounded-xl flex items-center justify-center shadow-lg transition-all cursor-pointer border border-emerald-600/20 disabled:opacity-50"
              >
                {t('qr.modal.save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};