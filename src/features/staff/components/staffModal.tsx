'use client';

import { useStaffModal } from '../hooks/useStaffModal';
import { StaffModalView } from './staffModalView';
import { StaffModalProps } from '../types/staff.types';

export const StaffModal = (props: StaffModalProps) => {
  const modalLogic = useStaffModal({
    formData: props.formData,
    setFormData: props.setFormData,
    onPhotoFileChange: props.onPhotoFileChange,
    onCreateRole: props.onCreateRole,
    onDeleteRole: props.onDeleteRole,
    onClose: props.onClose,
    isLoading: props.isLoading ?? false
  });

  return <StaffModalView {...props} {...modalLogic} />;
};