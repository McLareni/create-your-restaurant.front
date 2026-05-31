import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useTables } from './useTables';
import { useCrudModal } from '@/shared/hooks/useCrudModal';
import { tableSchema } from '../schemas/tables.schema';
import { Table, CreateTableDTO } from '../types/tables.types';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA: CreateTableDTO = { tableNumber: '', type: '', isActive: true, zoneId: null };

export const useQrTablesTabLogic = () => {
  const { t } = useTranslation();
  const { tables, zones, createTable, updateTable, deleteTable, createZone, isTableNumberUnique, isLoading } = useTables();
  
  const [errorMsg, setErrorMsg] = useState('');
  const [newZoneName, setNewZoneName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printingDataUrls, setPrintingDataUrls] = useState<Record<string, string>>({});
  const printTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isModalOpen,
    setIsModalOpen,
    editingItem: editingTable,
    formData,
    setFormData,
    deleteId,
    setDeleteId,
    isSubmitting,
    openCreateModal,
    openEditModal,
    confirmDelete,
  } = useCrudModal<Table, CreateTableDTO>({
    initialFormData: INITIAL_FORM_DATA,
    createItem: () => {},
    updateItem: () => {},
    deleteItem: deleteTable,
  });

  useEffect(() => {
    return () => {
      if (printTimeoutRef.current) clearTimeout(printTimeoutRef.current);
    };
  }, []);

  const onOpenCreate = () => {
    setErrorMsg('');
    setNewZoneName('');
    openCreateModal();
  };

  const onOpenEdit = (table: Table) => {
    setErrorMsg('');
    setNewZoneName('');
    openEditModal(table, (item) => ({
      tableNumber: item.tableNumber,
      type: item.type,
      isActive: item.isActive,
      zoneId: item.zoneId || null
    }));
  };

  const handleAddZone = async () => {
    if (!newZoneName.trim()) return;
    try {
      const created = await createZone(newZoneName.trim());
      handleFormDataChange({
        zoneId: created.id,
        type: created.name
      });
      setNewZoneName('');
      toast.success(t('qr.notifications.zoneCreateSuccess' as any) || 'Зону успішно створено');
    } catch (err) {
      console.error(err);
      toast.error(t('auth.errors.defaultError'));
    }
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

    const mutationOptions = {
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success(editingTable ? t('qr.notifications.updateSuccess') : t('qr.notifications.createSuccess'));
      },
      onError: (err: any) => {
        const apiError = err?.response?.data?.message || t('auth.errors.defaultError');
        setErrorMsg(apiError);
        toast.error(apiError);
      }
    };

    if (editingTable) {
      updateTable({ id: editingTable.id, data: formData }, mutationOptions);
    } else {
      createTable(formData, mutationOptions);
    }
  };

  const onDeleteConfirm = async () => {
    if (deleteId) {
      try {
        setSelectedIds(prev => prev.filter(id => id !== deleteId));
        await confirmDelete();
        toast.success(t('qr.notifications.deleteSuccess'));
      } catch {
        toast.error(t('auth.errors.defaultError'));
      }
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => id !== i) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? tables.map(t => t.id) : []);
  };

  const handlePrint = async () => {
    if (printTimeoutRef.current) {
      clearTimeout(printTimeoutRef.current);
    }

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
    updateTable({ id, data: { isActive } });
  };

  const handleFormDataChange = (fields: Partial<CreateTableDTO>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  return {
    t,
    tables,
    zones,
    isLoading,
    isSubmitting,
    errorMsg,
    setErrorMsg,
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