'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { useStaff } from '@/features/staff/hooks/useStaff';
import { useStaffMutations } from '@/features/staff/hooks/useStaffMutations';
import { useTranslation } from '@/shared/hooks/useTranslation';

export const useStaffRoles = () => {
  const { t } = useTranslation();
  const { permissions } = useStaff();
  const mutations = useStaffMutations();
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleAddRoleClick = async () => {
    if (editingRoleId) {
      setIsCreatingRole(true);
      try {
        await mutations.updateRoleAsync({ id: editingRoleId, permissions: selectedPermissions });
        setNewRoleName('');
        setSelectedPermissions([]);
        setEditingRoleId(null);
      } catch {
        toast.error(t('auth.errors.defaultError'));
      } finally {
        setIsCreatingRole(false);
      }
      return;
    }

    if (!newRoleName.trim() || isCreatingRole) return;
    setIsCreatingRole(true);
    try {
      await mutations.createRoleAsync({ name: newRoleName.trim(), permissions: selectedPermissions });
      setNewRoleName('');
      setSelectedPermissions([]);
    } catch {
      toast.error(t('auth.errors.defaultError'));
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleRemoveRoleClick = async (e: MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await mutations.deleteRoleAsync(id);
      if (editingRoleId === id) {
        setNewRoleName('');
        setSelectedPermissions([]);
        setEditingRoleId(null);
      }
    } catch {
      toast.error(t('auth.errors.defaultError'));
    }
  };

  const loadRoleForEditing = (role: { id: string; name: string; permissions?: string[] }) => {
    setEditingRoleId(role.id);
    setNewRoleName(role.name);
    setSelectedPermissions(role.permissions || []);
  };

  const cancelEditing = () => {
    setEditingRoleId(null);
    setNewRoleName('');
    setSelectedPermissions([]);
  };

  return {
    permissions,
    newRoleName,
    setNewRoleName,
    isCreatingRole,
    selectedPermissions,
    togglePermission,
    handleAddRoleClick,
    handleRemoveRoleClick,
    editingRoleId,
    loadRoleForEditing,
    cancelEditing,
  };
};