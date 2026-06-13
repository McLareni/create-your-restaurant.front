import { useState, MouseEvent } from 'react';
import { useStaff } from '@/features/staff/hooks/useStaff';

export const useStaffRoles = () => {
  const { createRole, deleteRole, permissions } = useStaff();
  const [newRoleName, setNewRoleName] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleAddRoleClick = async () => {
    if (!newRoleName.trim() || isCreatingRole) return;
    setIsCreatingRole(true);
    try {
      await createRole({ name: newRoleName.trim(), permissions: selectedPermissions });
      setNewRoleName('');
      setSelectedPermissions([]);
    } catch {} finally {
      setIsCreatingRole(false);
    }
  };

  const handleRemoveRoleClick = async (e: MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteRole(id);
    } catch {}
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
  };
};