'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useUserStore } from '@/shared/store/useUserStore';
import { tableSchema } from '../schemas/tables.schema';
import { Table, CreateTableDTO, UpdateTableDTO, Zone } from '../types/tables.types';
import { tablesApi } from '../api/tables.api';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA: CreateTableDTO = { 
  tableNumber: '', 
  type: '', 
  isActive: true, 
  zoneId: null 
};

export const useQrTablesManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const userRestaurants = useUserStore((state) => state.user?.restaurants);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;
  const restaurantSlug = activeRestaurant?.slug || (userRestaurants || []).find((r) => Number(r.id) === restaurantId)?.slug;

  const [errorMsg, setErrorMsg] = useState('');
  const [newZoneName, setNewZoneName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printingDataUrls, setPrintingDataUrls] = useState<Record<string, string>>({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<CreateTableDTO>(INITIAL_FORM_DATA);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const printTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: tables = [], isLoading: isTablesLoading } = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => tablesApi.getAll(restaurantId!, restaurantSlug),
    enabled: !!restaurantId,
  });

  const { data: zones = [], isLoading: isZonesLoading } = useQuery({
    queryKey: ['zones', restaurantId],
    queryFn: () => tablesApi.getAllZones(restaurantId!),
    enabled: !!restaurantId,
  });

  const createTableMutation = useMutation({
    mutationFn: (data: CreateTableDTO) => tablesApi.create(restaurantId!, data, restaurantSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      setIsModalOpen(false);
      toast.success(t('qr.notifications.createSuccess'));
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.message || t('auth.errors.defaultError');
      setErrorMsg(apiError);
      toast.error(apiError);
    }
  });

  const updateTableMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableDTO }) => 
      tablesApi.update(restaurantId!, id, data, restaurantSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      setIsModalOpen(false);
      toast.success(t('qr.notifications.updateSuccess'));
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.message || t('auth.errors.defaultError');
      setErrorMsg(apiError);
      toast.error(apiError);
    }
  });

  const deleteTableMutation = useMutation({
    mutationFn: (id: string) => tablesApi.delete(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      setDeleteId(null);
      toast.success(t('qr.notifications.deleteSuccess'));
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    }
  });

  const createZoneMutation = useMutation({
    mutationFn: (name: string) => tablesApi.createZone(restaurantId!, name),
    onSuccess: (createdZone) => {
      queryClient.invalidateQueries({ queryKey: ['zones', restaurantId] });
      setFormData(prev => ({ ...prev, zoneId: createdZone.id, type: createdZone.name }));
      setNewZoneName('');
      toast.success(t('qr.notifications.zoneCreateSuccess'));
    },
    onError: () => {
      toast.error(t('auth.errors.defaultError'));
    }
  });

  useEffect(() => {
    return () => {
      if (printTimeoutRef.current) clearTimeout(printTimeoutRef.current);
    };
  }, []);

  const isTableNumberUnique = (tableNumber: string, excludeId?: string) => {
    return !tables.some((table) => table.tableNumber === tableNumber && table.id !== excludeId);
  };

  const onOpenCreate = () => {
    setErrorMsg('');
    setNewZoneName('');
    setEditingTable(null);
    setFormData(INITIAL_FORM_DATA);
    setIsModalOpen(true);
  };

  const onOpenEdit = (table: Table) => {
    setErrorMsg('');
    setNewZoneName('');
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      type: table.type,
      isActive: table.isActive,
      zoneId: table.zoneId || null
    });
    setIsModalOpen(true);
  };

  const handleAddZone = async () => {
    if (!newZoneName.trim()) return;
    await createZoneMutation.mutateAsync(newZoneName.trim());
  };

  const onSave = async () => {
    setErrorMsg('');
    const validationResult = tableSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      setErrorMsg(t(firstError || 'common.errors.formValidation'));
      return;
    }

    if (!isTableNumberUnique(formData.tableNumber, editingTable?.id)) {
      setErrorMsg(t('qr.errors.numberUnique'));
      return;
    }

    if (editingTable) {
      updateTableMutation.mutate({ id: editingTable.id, data: formData });
    } else {
      createTableMutation.mutate(formData);
    }
  };

  const onDeleteConfirm = async () => {
    if (!deleteId) return;
    setSelectedIds(prev => prev.filter(id => id !== deleteId));
    await deleteTableMutation.mutateAsync(deleteId);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => id !== i) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? tables.map(t => t.id) : []);
  };

  const handlePrint = async () => {
    if (printTimeoutRef.current) clearTimeout(printTimeoutRef.current);
    const urls: Record<string, string> = {};
    const tablesToPrint = tables.filter(t => selectedIds.includes(t.id));
    
    for (const table of tablesToPrint) {
      if (!table.qrUrl) continue;
      try {
        urls[table.id] = await QRCode.toDataURL(table.qrUrl, { margin: 0, width: 300 });
      } catch (err) {
        console.error(err);
      }
    }
    setPrintingDataUrls(urls);
    printTimeoutRef.current = setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleStatusChange = (id: string, isActive: boolean) => {
    updateTableMutation.mutate({ id, data: { isActive } });
  };

  const handleFormDataChange = (fields: Partial<CreateTableDTO>) => {
    setFormData(prev => ({ ...prev, ...fields }));
    setErrorMsg('');
  };

  const isMutationPending = createTableMutation.isPending || updateTableMutation.isPending || deleteTableMutation.isPending || createZoneMutation.isPending;

  return {
    t,
    tables,
    zones,
    isLoading: isTablesLoading || isZonesLoading || isMutationPending,
    isSubmitting: isMutationPending,
    errorMsg,
    newZoneName,
    setNewZoneName,
    selectedIds,
    printingDataUrls,
    isModalOpen,
    setIsModalOpen,
    editingTable,
    formData,
    deleteId,
    setDeleteId,
    onOpenCreate,
    onOpenEdit,
    handleAddZone,
    onSave,
    onDeleteConfirm,
    handleToggleSelect,
    handleSelectAll,
    handlePrint,
    handleStatusChange,
    handleFormDataChange,
  };
};