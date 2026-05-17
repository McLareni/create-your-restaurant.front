'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { Switch, Card } from '@/shared/ui';
import { Pencil, Trash2, Mail, Phone, ChefHat, ClipboardSignature, Wine, ShieldCheck } from 'lucide-react';
import { StaffMember, StaffRole } from '../types/staff.types';

interface StaffCardProps {
  member: StaffMember;
  onEdit: (member: StaffMember) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, isActive: boolean) => void;
}

const roleIcons: Record<StaffRole, React.ElementType> = {
  MANAGER: ShieldCheck,
  CHEF: ChefHat,
  WAITER: ClipboardSignature,
  BARTENDER: Wine
};

export const StaffCard = ({ member, onEdit, onDelete, onStatusChange }: StaffCardProps) => {
  const { t } = useTranslation();
  const Icon = roleIcons[member.role];
  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase();

  return (
    <Card className={`!p-5 ${!member.isActive ? 'border-brand-gray/20 opacity-80 grayscale-[20%]' : ''}`}>
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 z-10">
        <button onClick={(e) => { e.stopPropagation(); onEdit(member); }} className="rounded-md bg-white p-1.5 text-brand-gray shadow-sm hover:text-brand-copper outline-none">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(member.id); }} className="rounded-md bg-white p-1.5 text-brand-gray shadow-sm hover:text-red-500 outline-none">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5 relative z-0">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white font-bold text-lg shadow-inner ${member.avatarColor}`}>
          {initials}
        </div>
        <div className="flex flex-col pr-12">
          <h3 className="text-lg font-bold text-brand-espresso line-clamp-1">
            {member.firstName} {member.lastName}
          </h3>
          <div className="flex items-center gap-1.5 text-brand-copper mt-0.5">
            <Icon className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wide">{t(`staff.roles.${member.role}`)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 mb-5 relative z-0">
        <div className="flex items-center gap-3 text-sm text-brand-gray">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
        {member.phone && (
          <div className="flex items-center gap-3 text-sm text-brand-gray">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{member.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-brand-gray/10 pt-4 flex items-center justify-between relative z-0">
        <span className={`text-xs font-medium ${member.isActive ? 'text-green-600' : 'text-red-500'}`}>
          {member.isActive ? t('staff.statusActive') : t('staff.statusInactive')}
        </span>
        <Switch checked={member.isActive} onChange={(val) => onStatusChange(member.id, val)} />
      </div>
    </Card>
  );
};