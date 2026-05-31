import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { UseTableCardLogicProps } from '@/features/qr-tables/types/tables.types';

export const useTableCardLogic = ({
  table,
  onToggleSelect,
  onEdit,
  onDelete,
  onStatusChange,
}: UseTableCardLogicProps) => {
  const [qrImage, setQrImage] = useState<string>('');

  useEffect(() => {
    if (table.qrUrl) {
      QRCode.toDataURL(table.qrUrl, { margin: 1, width: 200 })
        .then((url) => setQrImage(url))
        .catch((err) => console.error(err));
    }
  }, [table.qrUrl]);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect(table.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(table);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(table.id);
  };

  const handleToggleStatus = (val: boolean) => {
    onStatusChange(table.id, val);
  };

  return {
    qrImage,
    handleCheckboxClick,
    handleEditClick,
    handleDeleteClick,
    handleToggleStatus,
  };
};