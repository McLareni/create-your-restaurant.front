'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useUserStore } from '@/shared/store/useUserStore';
import { tableSchema } from '@/features/qr-tables/schemas/tables.schema';
import { Table, CreateTableDTO, UpdateTableDTO } from '@/features/qr-tables/types/tables.types';
import { tablesApi } from '@/features/qr-tables/api/tables.api';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA: CreateTableDTO = { 
  tableNumber: '', 
  type: '', 
  isActive: true, 
};

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
  message: string;
}

export const useQrTablesManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeRestaurant = useRestaurantStore((state) => state.activeRestaurant);
  const userRestaurants = useUserStore((state) => state.user?.restaurants);
  const restaurantId = activeRestaurant?.id ? Number(activeRestaurant.id) : null;
  const restaurantSlug = activeRestaurant?.slug || (userRestaurants || []).find((r) => Number(r.id) === restaurantId)?.slug;

  const [errorMsg, setErrorMsg] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<CreateTableDTO>(INITIAL_FORM_DATA);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);

  const printTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: tables = [], isLoading: isTablesLoading } = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => tablesApi.getAll(restaurantId!, restaurantSlug),
    enabled: !!restaurantId,
  });

  const existingTypes = useMemo<string[]>(() => {
    const typesSet = new Set<string>();
    tables.forEach((t) => {
      if (t.type && t.type.trim()) {
        typesSet.add(t.type.trim());
      }
    });
    return Array.from(typesSet);
  }, [tables]);

  const filteredTypes = useMemo<string[]>(() => {
    const query = (formData.type || '').trim().toLowerCase();
    if (!query) return existingTypes;
    return existingTypes.filter((z) => z.toLowerCase().includes(query));
  }, [formData.type, existingTypes]);

  const extractErrorMessage = (error: ApiErrorResponse): string => {
    const serverMessage = error.response?.data?.message;
    if (Array.isArray(serverMessage)) return serverMessage[0];
    if (typeof serverMessage === 'string') return serverMessage;
    return error.message;
  };

  const createTableMutation = useMutation<Table, ApiErrorResponse, CreateTableDTO>({
    mutationFn: (data: CreateTableDTO) => tablesApi.create(restaurantId!, data, restaurantSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      setIsModalOpen(false);
      toast.success(t('qr.notifications.createSuccess'));
    },
    onError: (error) => {
      const msg = extractErrorMessage(error);
      setErrorMsg(msg);
      toast.error(msg);
    }
  });

  const updateTableMutation = useMutation<Table, ApiErrorResponse, { id: string; data: UpdateTableDTO }>({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableDTO }) => 
      tablesApi.update(restaurantId!, id, data, restaurantSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      setIsModalOpen(false);
      toast.success(t('qr.notifications.updateSuccess'));
    },
    onError: (error) => {
      const msg = extractErrorMessage(error);
      setErrorMsg(msg);
      toast.error(msg);
    }
  });

  const deleteTableMutation = useMutation<void, ApiErrorResponse, string>({
    mutationFn: (id: string) => tablesApi.delete(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
      setDeleteId(null);
      toast.success(t('qr.notifications.deleteSuccess'));
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
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
    setEditingTable(null);
    setFormData(INITIAL_FORM_DATA);
    setIsModalOpen(true);
  };

  const onOpenEdit = (table: Table) => {
    setErrorMsg('');
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      type: table.type,
      isActive: table.isActive,
    });
    setIsModalOpen(true);
  };

  const onSave = async () => {
    setErrorMsg('');
    const validationResult = tableSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      setErrorMsg(t(firstError || 'qr.errors.formValidation'));
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

  const handlePrint = () => {
    if (printTimeoutRef.current) clearTimeout(printTimeoutRef.current);
    printTimeoutRef.current = setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleStatusChange = (id: string, isActive: boolean) => {
    updateTableMutation.mutate({ id, data: { isActive } });
  };

  const handleFormDataChange = (fields: Partial<CreateTableDTO>) => {
    setFormData(prev => ({ ...prev, ...fields }));
    setErrorMsg('');
  };

  const isMutationPending = createTableMutation.isPending || updateTableMutation.isPending || deleteTableMutation.isPending;

  return {
    t,
    tables,
    isLoading: isTablesLoading || isMutationPending,
    isSubmitting: isMutationPending,
    errorMsg,
    selectedIds,
    isModalOpen,
    setIsModalOpen,
    editingTable,
    formData,
    deleteId,
    setDeleteId,
    onOpenCreate,
    onOpenEdit,
    onSave,
    onDeleteConfirm,
    handleToggleSelect,
    handleSelectAll,
    handlePrint,
    handleStatusChange,
    handleFormDataChange,
    filteredTypes,
    showTypeSuggestions,
    setShowTypeSuggestions,
  };
};