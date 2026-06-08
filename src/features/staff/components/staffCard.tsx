'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Switch } from '@/shared/ui/switch';
import { Card } from '@/shared/ui/card';
import { Pencil, Trash2, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import type { StaffCardProps } from '@/features/staff/types/staff.types';

export const StaffCard = ({ member, onEdit, onDelete, onStatusChange }: StaffCardProps) => {
  const { t } = useTranslation();
  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase();

  return (
    <Card className={`p-5 relative group ${!member.isActive ? 'border-brand-gray/20 opacity-80 grayscale-25' : ''}`}>
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 z-10">
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(member); }} 
          className="rounded-md bg-white dark:bg-brand-espresso border border-brand-gray/10 p-1.5 text-brand-gray dark:text-brand-gray/80 shadow-sm hover:text-brand-copper outline-none cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(member.id); }} 
          className="rounded-md bg-white dark:bg-brand-espresso border border-brand-gray/10 p-1.5 text-brand-gray dark:text-brand-gray/80 shadow-sm hover:text-red-500 outline-none cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5 relative z-0 min-w-0">
        {member.photo ? (
          <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border border-brand-gray/20 shadow-inner bg-brand-cream/20">
            <Image 
              src={member.photo} 
              alt={member.firstName} 
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white font-bold text-lg shadow-inner ${member.avatarColor}`}>
            {initials}
          </div>
        )}
        
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-brand-espresso dark:text-brand-cream truncate">
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-xs font-semibold text-brand-copper mt-0.5 truncate">{member.role}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-brand-gray/10 pt-3 mb-4 text-sm text-brand-gray dark:text-brand-gray/80">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-brand-gray/60" />
          <span className="truncate">{member.email}</span>
        </div>
        {member.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-brand-gray/60" />
            <span className="truncate">{member.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-brand-gray/10 pt-3 flex items-center justify-between relative z-10">
        <span className={`text-xs font-medium ${member.isActive ? 'text-green-600 dark:text-green-500' : 'text-red-500'}`}>
          {member.isActive ? t('staff.statusActive') : t('staff.statusInactive')}
        </span>
        <Switch 
          id={`status-switch-${member.id}`}
          checked={member.isActive} 
          onChange={(val: boolean) => onStatusChange(member.id, val)} 
        />
      </div>
    </Card>
  );
};