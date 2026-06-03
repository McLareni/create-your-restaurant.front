'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { modifiersApi } from '../../api/modifiers.api';
import { modifierGroupSchema, modifierOptionSchema, INITIAL_GROUP_FORM, INITIAL_OPTION_FORM } from '../../schemas/modifiers.schema';
import toast from 'react-hot-toast';

export const useModifiersManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;

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

  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ['modifierGroups', restaurantId],
    queryFn: () => modifiersApi.getGroups(restaurantId!),
    enabled: !!restaurantId,
  });

  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['modifierGroups', restaurantId] });
    await queryClient.invalidateQueries({ queryKey: ['fullMenu', restaurantId] });
  };

  const createGroupMutation = useMutation({
    mutationFn: (data: any) => modifiersApi.createGroup(restaurantId!, data),
    onSuccess: async () => {
      await invalidateAll();
      setIsGroupModalOpen(false);
      toast.success(t('common.success') || 'Групу модифікаторів збережено');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('auth.errors.defaultError'));
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => modifiersApi.updateGroup(restaurantId!, id, data),
    onSuccess: async () => {
      await invalidateAll();
      setIsGroupModalOpen(false);
      setIsOptionModalOpen(false);
      toast.success(t('common.success') || 'Оновлено успішно');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('auth.errors.defaultError'));
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => modifiersApi.deleteGroup(restaurantId!, id),
    onSuccess: async () => {
      await invalidateAll();
      toast.success(t('common.success') || 'Успішно видалено');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('auth.errors.defaultError'));
    }
  });

  const toggleGroup = (id: string) => setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));

  const handleOpenGroupModal = (group?: any) => {
    setGroupErrors({});
    if (group) {
      setEditingGroup(group);
      setGroupForm({
        name: group.name,
        isRequired: group.isRequired,
        minSelections: group.minSelections.toString(),
        maxSelections: group.maxSelections ? group.maxSelections.toString() : ''
      });
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

    if (editingGroup) {
      updateGroupMutation.mutate({ id: editingGroup.id, data: result.data });
    } else {
      createGroupMutation.mutate(result.data);
    }
  };

  const handleOpenOptionModal = (groupId: string, option?: any) => {
    setActiveGroupId(groupId);
    if (option) {
      setEditingOption(option);
      setOptionForm({ name: option.name, price: option.price.toString(), isAvailable: option.isAvailable });
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
    const validationPayload = { name: optionForm.name, price: parsedPrice, isAvailable: optionForm.isAvailable };
    const validationResult = modifierOptionSchema.safeParse(validationPayload);
    if (!validationResult.success) {
      toast.error(t('errors.formValidation'));
      return;
    }

    const formattedOption = { id: editingOption?.id || crypto.randomUUID(), name: optionForm.name, price: parsedPrice, isAvailable: optionForm.isAvailable };
    let newOptions = [...group.options];
    if (editingOption) {
      newOptions = newOptions.map((opt: any) => opt.id === editingOption.id ? formattedOption : opt);
    } else {
      newOptions.push(formattedOption);
    }

    updateGroupMutation.mutate({
      id: activeGroupId,
      data: {
        name: group.name,
        isRequired: group.isRequired,
        minSelections: group.minSelections,
        maxSelections: group.maxSelections,
        options: newOptions
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'group') {
      deleteGroupMutation.mutate(deleteTarget.id);
    } else if (deleteTarget.type === 'option' && deleteTarget.groupId) {
      const group = groups.find((g: any) => g.id === deleteTarget.groupId);
      if (group) {
        const newOptions = group.options.filter((opt: any) => opt.id !== deleteTarget.id);
        updateGroupMutation.mutate({
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

  const isMutationPending = createGroupMutation.isPending || updateGroupMutation.isPending || deleteGroupMutation.isPending;

  return {
    t,
    groups,
    isLoading: isGroupsLoading || isMutationPending,
    isSubmitting: isMutationPending,
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