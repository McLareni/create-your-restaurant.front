'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useModifiers } from './useModifiers';
import { modifierGroupSchema, modifierOptionSchema, INITIAL_GROUP_FORM, INITIAL_OPTION_FORM } from '../../schemas/modifiers.schema';
import toast from 'react-hot-toast';

export const useModifiersTab = () => {
  const { t } = useTranslation();
  const { groups, isLoading, createGroup, updateGroup, deleteGroup } = useModifiers();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [groupForm, setGroupForm] = useState<any>(INITIAL_GROUP_FORM);
  const [groupErrors, setGroupErrors] = useState<Record<string, string>>({});

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>('');
  const [optionForm, setOptionForm] = useState<any>(INITIAL_OPTION_FORM);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'group' | 'option'; id: string; groupId?: string } | null>(null);

  const toggleGroup = (id: string) => setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));

  const handleOpenGroupModal = (group?: any) => {
    setGroupErrors({});
    if (group) {
      setEditingGroup(group);
      setGroupForm({ name: group.name, isRequired: group.isRequired, minSelections: group.minSelections || '', maxSelections: group.maxSelections || '' });
    } else {
      setEditingGroup(null);
      setGroupForm(INITIAL_GROUP_FORM);
    }
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = () => {
    const validationPayload = {
      name: groupForm.name,
      isRequired: groupForm.isRequired,
      minSelections: groupForm.minSelections ? parseInt(groupForm.minSelections, 10) : 0,
      maxSelections: groupForm.maxSelections ? parseInt(groupForm.maxSelections, 10) : null,
      options: editingGroup ? editingGroup.options : []
    };

    const result = modifierGroupSchema.safeParse(validationPayload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = t(issue.message);
      });
      setGroupErrors(fieldErrors);
      toast.error(t('errors.formValidation'));
      return;
    }

    setGroupErrors({});
    const formattedData = {
      ...result.data,
      options: editingGroup ? undefined : []
    };

    if (editingGroup) updateGroup({ id: editingGroup.id, data: formattedData });
    else createGroup(formattedData);
    setIsGroupModalOpen(false);
  };

  const handleOpenOptionModal = (groupId: string, option?: any) => {
    setActiveGroupId(groupId);
    if (option) {
      setEditingOption(option);
      setOptionForm({ name: option.name, price: option.price || '', isAvailable: option.isAvailable });
    } else {
      setEditingOption(null);
      setOptionForm(INITIAL_OPTION_FORM);
    }
    setIsOptionModalOpen(true);
  };

  const handleSaveOption = () => {
    const group = groups.find((g: any) => g.id === activeGroupId);
    if (!group) return;

    const parsedPrice = optionForm.price ? parseFloat(optionForm.price) : 0;
    const validationPayload = {
      name: optionForm.name,
      price: parsedPrice,
      isAvailable: optionForm.isAvailable
    };

    const validationResult = modifierOptionSchema.safeParse(validationPayload);
    if (!validationResult.success) {
      toast.error(t('errors.formValidation'));
      return;
    }

    const formattedOption = { 
      ...optionForm, 
      price: parsedPrice 
    };
    let newOptions = [...group.options];

    if (editingOption) {
      newOptions = newOptions.map((opt: any) => opt.id === editingOption.id ? { ...opt, ...formattedOption } : opt);
    } else {
      newOptions.push({
        id: crypto.randomUUID(),
        ...formattedOption
      });
    }

    updateGroup({ 
      id: activeGroupId, 
      data: { 
        name: group.name,
        isRequired: group.isRequired,
        minSelections: group.minSelections,
        maxSelections: group.maxSelections,
        options: newOptions 
      } 
    });
    setIsOptionModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'group') {
      deleteGroup(deleteTarget.id);
    } else if (deleteTarget.type === 'option' && deleteTarget.groupId) {
      const group = groups.find((g: any) => g.id === deleteTarget.groupId);
      if (group) {
        const newOptions = group.options.filter((opt: any) => opt.id !== deleteTarget.id);
        updateGroup({ 
          id: group.id, 
          data: { 
            name: group.name,
            isRequired: group.isRequired,
            minSelections: group.minSelections,
            maxSelections: group.maxSelections,
            options: newOptions 
          } 
        });
      }
    }
    setDeleteTarget(null);
  };

  return {
    t,
    groups,
    isLoading,
    expandedGroups,
    toggleGroup,
    isGroupModalOpen,
    setIsGroupModalOpen,
    groupForm,
    setGroupForm,
    groupErrors,
    isOptionModalOpen,
    setIsOptionModalOpen,
    optionForm,
    setOptionForm,
    deleteTarget,
    setDeleteTarget,
    handleOpenGroupModal,
    handleSaveGroup,
    handleOpenOptionModal,
    handleSaveOption,
    handleConfirmDelete,
    editingGroup,
    editingOption,
  };
};