import { useState, MouseEvent } from 'react';
import { useStaff } from '@/features/staff/hooks/useStaff';

export const useStaffRoles = () => {
  const { createRole, deleteRole } = useStaff();
  const [newRoleName, setNewRoleName] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  const handleAddRoleClick = async () => {
    if (!newRoleName.trim() || isCreatingRole) return;
    setIsCreatingRole(true);
    try {
      await createRole(newRoleName.trim());
      setNewRoleName('');
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
    newRoleName,
    setNewRoleName,
    isCreatingRole,
    handleAddRoleClick,
    handleRemoveRoleClick,
  };
};