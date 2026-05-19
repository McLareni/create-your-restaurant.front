'use client';

import { Button, Modal, Input, Checkbox } from '@/shared/ui';

interface ModifierGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
}

export const ModifierGroupModal = ({ isOpen, onClose, isEditing, form, setForm, onSave }: ModifierGroupModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Редагувати групу" : "Створити групу модифікаторів"}>
      <div className="flex flex-col gap-4">
        <Input 
          id="groupName" 
          label="Назва групи (напр. Ступінь просмаження)" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
        />
        <div className="flex gap-4">
          <Input 
            id="minSel" 
            type="number" 
            label="Мінімум виборів" 
            placeholder="0" 
            value={form.minSelections} 
            onChange={(e) => setForm({ ...form, minSelections: e.target.value })} 
          />
          <Input 
            id="maxSel" 
            type="number" 
            label="Максимум виборів" 
            placeholder="Безліміт" 
            value={form.maxSelections} 
            onChange={(e) => setForm({ ...form, maxSelections: e.target.value })} 
          />
        </div>
        <Checkbox 
          id="req" 
          label="Обов'язковий вибір (Клієнт не зможе замовити без вибору)" 
          checked={form.isRequired} 
          onChange={(e) => setForm({ ...form, isRequired: e.target.checked })} 
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-brand-gray/10 mt-2">
          <Button variant="ghost" onClick={onClose} className="h-9 text-sm">Скасувати</Button>
          <Button variant="brand" onClick={onSave} className="h-9 text-sm" disabled={!form.name.trim()}>Зберегти</Button>
        </div>
      </div>
    </Modal>
  );
};