'use client';

import { useState, startTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useActiveRestaurantId } from '@/shared/hooks/useActiveRestaurantId';
import { modifiersApi } from '@/features/menu-builder/api/modifiers.api';
import { modifierGroupSchema, modifierOptionSchema, INITIAL_OPTION_FORM } from '@/features/menu-builder/schemas/modifiers.schema';
import { useModifierGroupsQuery } from '@/features/menu-builder/hooks/modifiers/useModifierGroupsQuery';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import { useAppActionState } from '@/shared/hooks/useAppActionState';
import type { ModifierGroup, ModifierOption, ModifierTabDeleteTarget, OptionFormState, CreateModifierGroupDTO, UpdateModifierGroupDTO } from '@/features/menu-builder/types/modifiers.types';

export const useModifiersManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const restaurantId = useActiveRestaurantId();
  
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ModifierOption | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [optionForm, setOptionForm] = useState<OptionFormState>(INITIAL_OPTION_FORM);
  const [deleteTarget, setDeleteTarget] = useState<ModifierTabDeleteTarget | null>(null);
  
  const { data: groups = [], isLoading: isGroupsLoading } = useModifierGroupsQuery();

  const toggleGroup = (id: string): void => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const createGroupMutation = useMutation({
    mutationFn: (data: CreateModifierGroupDTO) => modifiersApi.createGroup(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.modifierGroups(restaurantId) });
      toast.success(t('menu.constructor.modifiers.notifications.createGroupSuccess'));
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModifierGroupDTO }) => modifiersApi.updateGroup(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.modifierGroups(restaurantId) });
      toast.success(t('menu.constructor.modifiers.notifications.updateGroupSuccess'));
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => modifiersApi.deleteGroup(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.modifierGroups(restaurantId) });
      toast.success(t('menu.constructor.modifiers.notifications.deleteSuccess'));
    },
  });

  const handleOpenGroupModal = (group?: ModifierGroup): void => {
    setEditingGroup(group || null);
    setIsGroupModalOpen(true);
  };

  const [groupFormState, groupFormAction, isGroupPending] = useAppActionState(
    async (formData) => {
      const name = (formData.get('name') as string).trim();
      const isRequired = formData.get('isRequired') === 'on';
      const minSelectionsRaw = parseInt(formData.get('minSelections') as string, 10);
      const minSelections = isNaN(minSelectionsRaw) ? 0 : minSelectionsRaw;
      const maxSelectionsRaw = formData.get('maxSelections') as string;
      const maxSelectionsParsed = maxSelectionsRaw ? parseInt(maxSelectionsRaw, 10) : null;
      const maxSelections = (maxSelectionsParsed === null || isNaN(maxSelectionsParsed)) ? null : maxSelectionsParsed;

      const rawPayload = {
        name,
        isRequired,
        minSelections: isRequired && minSelections < 1 ? 1 : minSelections,
        maxSelections,
        options: editingGroup ? (editingGroup.options || []) : [],
      };

      const parsedPayload = modifierGroupSchema.parse(rawPayload);

      if (editingGroup) {
        await updateGroupMutation.mutateAsync({ id: editingGroup.id, data: parsedPayload as UpdateModifierGroupDTO });
      } else {
        await createGroupMutation.mutateAsync(parsedPayload as CreateModifierGroupDTO);
      }
    },
    { t, onSuccess: () => setIsGroupModalOpen(false) }
  );

  const handleOpenOptionModal = (groupId: string, option?: ModifierOption): void => {
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

  const handleSaveOption = (): void => {
    if (!activeGroupId) return;
    const group = groups.find((g) => g.id === activeGroupId);
    if (!group) return;
    
    const newOptionPayload = {
      name: optionForm.name,
      price: parseFloat(optionForm.price) || 0,
      isAvailable: optionForm.isAvailable,
    };
    
    const validationResult = modifierOptionSchema.safeParse(newOptionPayload);
    
    if (!validationResult.success) {
      toast.error(t('menu.constructor.modifiers.notifications.formValidation'));
      return;
    }

    const currentOptions = group.options || [];
    let updatedOptions = currentOptions.map(opt => ({ ...opt }));

    if (editingOption) {
      updatedOptions = updatedOptions.map((opt) => (opt.id === editingOption.id ? { ...opt, ...validationResult.data } : opt));
    } else {
      updatedOptions.push({ id: `temp-${Date.now()}`, ...validationResult.data });
    }

    startTransition(async () => {
      try {
        await updateGroupMutation.mutateAsync({
          id: group.id,
          data: {
            name: group.name,
            isRequired: group.isRequired,
            minSelections: group.minSelections,
            maxSelections: group.maxSelections,
            options: updatedOptions.map(({ id, ...opt }) => id.startsWith('temp-') ? opt : { id, ...opt })
          },
        });
        setIsOptionModalOpen(false);
      } catch {
        toast.error(t('errors.unknown'));
      }
    });
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        if (deleteTarget.type === 'group') {
          await deleteGroupMutation.mutateAsync(deleteTarget.id);
        } else if (deleteTarget.type === 'option' && deleteTarget.groupId) {
          const group = groups.find((g) => g.id === deleteTarget.groupId);
          if (group) {
            const currentOptions = group.options || [];
            const newOptions = currentOptions.filter((opt) => opt.id !== deleteTarget.id);
            await updateGroupMutation.mutateAsync({
              id: group.id,
              data: {
                name: group.name,
                isRequired: group.isRequired,
                minSelections: group.minSelections,
                maxSelections: group.maxSelections,
                options: newOptions.map(({ id, ...opt }) => id.startsWith('temp-') ? opt : { id, ...opt })
              },
            });
          }
        }
        setDeleteTarget(null);
      } catch {
        toast.error(t('errors.unknown'));
      }
    });
  };

  const isMutationPending = createGroupMutation.isPending || updateGroupMutation.isPending || deleteGroupMutation.isPending || isGroupPending;
  
  return {
    t,
    groups,
    isLoading: isGroupsLoading || isMutationPending || restaurantId === null,
    isSubmitting: isMutationPending,
    expandedGroups,
    toggleGroup,
    isGroupModalOpen,
    setIsGroupModalOpen,
    editingGroup,
    groupErrors: groupFormState?.errors || {},
    isOptionModalOpen,
    setIsOptionModalOpen,
    editingOption,
    optionForm,
    setOptionForm,
    deleteTarget,
    setDeleteTarget,
    handleOpenGroupModal,
    handleOpenOptionModal,
    handleSaveOption,
    handleConfirmDelete,
    groupFormAction,
  };
};