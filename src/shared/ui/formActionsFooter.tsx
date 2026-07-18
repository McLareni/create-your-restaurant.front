'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslation } from '@/shared/hooks/useTranslation';

interface FormActionsFooterProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export const FormActionsFooter = ({
  onCancel,
  submitLabel,
  cancelLabel,
  className = '',
}: FormActionsFooterProps) => {
  const { t } = useTranslation();
  const { pending } = useFormStatus();

  return (
    <div className={`flex justify-end gap-3 pt-4 border-t border-solid border-border-main/60 shrink-0 bg-bg-surface ${className}`}>
      <button
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="h-10 px-4 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-element rounded-xl transition-all cursor-pointer border-0 bg-transparent outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelLabel || t('actions.cancel')}
      </button>
      <button
        type="submit"
        disabled={pending}
        className="h-10 px-5 text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-hover active:scale-98 rounded-xl shadow-md transition-all cursor-pointer border border-brand-emerald/10 select-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
      >
        {pending ? (
          <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : null}
        <span>{submitLabel || t('actions.save')}</span>
      </button>
    </div>
  );
};