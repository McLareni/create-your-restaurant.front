'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Switch } from '@/shared/ui/switch';
import { Pencil, Trash2, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import type { StaffCardProps } from '@/features/staff/types/staff.types';

export const StaffCard = ({ member, onEdit, onDelete, onStatusChange }: StaffCardProps) => {
  const { t } = useTranslation();
  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div 
      className={`p-5 flex flex-col justify-between w-full h-[255px] rounded-2xl bg-bg-surface border transition-all duration-300 group select-none relative shadow-table ${
        !member.isActive 
          ? 'border-border-main/40 dark:border-border-main/30 opacity-70' 
          : 'border-border-main/60 dark:border-border-main hover:border-border-main'
      }`}
    >
      <div className="flex justify-between items-center w-full h-7 shrink-0 mb-3">
        <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider bg-brand-emerald/10 px-2.5 py-0.5 rounded-lg border border-brand-emerald/5">
          {member.role}
        </span>
        
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-bg-element/60 dark:bg-neutral-900/40 px-1 py-0.5 rounded-xl border border-neutral-200/20 dark:border-neutral-700/20">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(member); }} 
            className="p-1.5 rounded-lg text-text-muted hover:text-brand-emerald transition-colors cursor-pointer border-0 bg-transparent"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(member.id); }} 
            className="p-1.5 rounded-lg text-text-muted hover:text-red-500 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 min-w-0 flex-1">
        {member.photo ? (
          <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border border-border-main/60 bg-bg-element">
            <Image src={member.photo} alt={member.firstName} fill sizes="56px" className="object-cover" />
          </div>
        ) : (
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white font-bold text-base shadow-xs ${member.avatarColor}`}>
            {initials}
          </div>
        )}
        
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-text-main truncate leading-tight">
            {member.firstName} {member.lastName}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-solid border-border-main pt-3 mb-4 text-xs text-text-muted shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Mail className="h-3.5 w-3.5 shrink-0 text-text-muted/60" />
          <span className="truncate font-light text-text-main/90">{member.email}</span>
        </div>
        {member.phone && (
          <div className="flex items-center gap-2 min-w-0">
            <Phone className="h-3.5 w-3.5 shrink-0 text-text-muted/60" />
            <span className="truncate font-light text-text-main/90">{member.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-solid border-border-main pt-3 flex items-center justify-between w-full relative z-10 shrink-0 h-9">
        <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
          member.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
        }`}>
          {member.isActive ? t('staff.statusActive') : t('staff.statusInactive')}
        </span>
        <Switch 
          id={`status-switch-${member.id}`}
          checked={member.isActive} 
          onChange={(val: boolean) => onStatusChange(member.id, val)} 
          className={member.isActive ? 'bg-brand-emerald!' : ''}
        />
      </div>
    </div>
  );
};