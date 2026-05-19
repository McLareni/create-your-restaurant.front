'use client';

import { Button, Modal, Input, Switch } from '@/shared/ui';

interface ModifierOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
}

export const ModifierOptionModal = ({ isOpen, onClose, isEditing, form, setForm, onSave }: ModifierOptionModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Редагувати опцію" : "Додати опцію"}>
      <div className="flex flex-col gap-4">
        <Input 
          id="optName" 
          label="Назва опції (напр. Екстра сир)" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
        />
        <Input 
          id="optPrice" 
          type="number" 
          label="Додаткова вартість (₴)" 
          placeholder="0" 
          value={form.price} 
          onChange={(e) => setForm({ ...form, price: e.target.value })} 
        />
        <div className="flex items-center justify-between border-t border-brand-gray/10 pt-4 mt-2">
          <span className="text-sm font-medium text-brand-espresso dark:text-brand-cream">В наявності</span>
          <Switch checked={form.isAvailable} onChange={(val) => setForm({ ...form, isAvailable: val })} />
        </div>
        <div className="flex justify-end gap-2 pt-4 mt-2">
          <Button variant="ghost" onClick={onClose} className="h-9 text-sm">Скасувати</Button>
          <Button variant="brand" onClick={onSave} className="h-9 text-sm" disabled={!form.name.trim()}>Зберегти</Button>
        </div>
      </div>
    </Modal>
  );
};