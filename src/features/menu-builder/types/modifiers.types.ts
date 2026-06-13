import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';
import { modifierOptionSchema, modifierGroupSchema } from '@/features/menu-builder/schemas/modifiers.schema';

export type ModifierOption = z.infer<typeof modifierOptionSchema> & { id: string };

export type ModifierGroup = Omit<z.infer<typeof modifierGroupSchema>, 'options'> & {
  id: string;
  options: ModifierOption[];
};

export type CreateModifierGroupDTO = z.infer<typeof modifierGroupSchema>;
export type UpdateModifierGroupDTO = Partial<CreateModifierGroupDTO>;

export type ModifierTabDeleteTarget = {
  type: 'group' | 'option';
  id: string;
  groupId?: string;
} | null;

export interface ModifierCardProps {
  group: ModifierGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onOpenOptionModal: () => void;
  onEditOption: (option: ModifierOption) => void;
  onDeleteOption: (optionId: string) => void;
}

export interface GroupFormState {
  name: string;
  isRequired: boolean;
  minSelections: string;
  maxSelections: string;
}

export interface OptionFormState {
  name: string;
  price: string;
  isAvailable: boolean;
}

export interface ModifierGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: GroupFormState;
  setForm: Dispatch<SetStateAction<GroupFormState>>;
  onSave: () => void;
  errors?: Record<string, string>;
  isLoading?: boolean;
}

export interface ModifierOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: OptionFormState;
  setForm: Dispatch<SetStateAction<OptionFormState>>;
  onSave: () => void;
  isLoading?: boolean;
}