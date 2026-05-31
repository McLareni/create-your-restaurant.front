import { z } from 'zod';
import { modifierOptionSchema, modifierGroupSchema } from '../schemas/modifiers.schema';

export type ModifierOption = z.infer<typeof modifierOptionSchema>;
export type ModifierGroup = z.infer<typeof modifierGroupSchema> & { id: string };

export type CreateModifierGroupDTO = z.infer<typeof modifierGroupSchema>;
export type UpdateModifierGroupDTO = Partial<CreateModifierGroupDTO>;

export type ModifierTabDeleteTarget = {
  type: 'group' | 'option';
  id: string;
  groupId?: string;
} | null;

export interface ModifierCardProps {
  group: any;
  isExpanded: boolean;
  onToggle: () => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onOpenOptionModal: () => void;
  onEditOption: (option: any) => void;
  onDeleteOption: (optionId: string) => void;
}

export interface ModifierGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
  errors?: Record<string, string>;
  isLoading?: boolean;
}

export interface ModifierOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
  isLoading?: boolean;
}