'use client';

import { useStaffList } from '../hooks/useStaffList';
import { StaffListView } from './staffListView';

export const StaffList = () => {
  const listLogic = useStaffList();

  return <StaffListView {...listLogic} />;
};