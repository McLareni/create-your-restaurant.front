'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Button, ConfirmModal } from '@/shared/ui';
import { Plus, Pencil, Trash2, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import { useModifiers } from '../../hooks/useModifiers';
import { ModifierGroupModal } from './modifierGroupModal';
import { ModifierOptionModal } from './modifierOptionModal';
import { modifierOptionSchema, modifierGroupSchema } from '../../schemas/modifiers.schema';
import toast from 'react-hot-toast';

const INITIAL_GROUP_FORM = { name: '', isRequired: false, minSelections: '', maxSelections: '' };
const INITIAL_OPTION_FORM = { name: '', price: '', isAvailable: true };

export const ModifiersTab = () => {
  const { t } = useTranslation();
  const { groups, isLoading, createGroup, updateGroup, deleteGroup } = useModifiers();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [groupForm, setGroupForm] = useState<any>(INITIAL_GROUP_FORM);
  const [groupErrors, setGroupErrors] = useState<Record<string, string>>({});

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>('');
  const [optionForm, setOptionForm] = useState<any>(INITIAL_OPTION_FORM);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'group' | 'option'; id: string; groupId?: string } | null>(null);

  const toggleGroup = (id: string) => setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-2 w-full">
        <div className="h-16 w-full rounded-xl bg-brand-gray/10 animate-pulse"></div>
        <div className="h-48 w-full rounded-xl bg-brand-gray/5 animate-pulse mt-4"></div>
      </div>
    );
  }

  const handleOpenGroupModal = (group?: any) => {
    setGroupErrors({});
    if (group) {
      setEditingGroup(group);
      setGroupForm({ name: group.name, isRequired: group.isRequired, minSelections: group.minSelections || '', maxSelections: group.maxSelections || '' });
    } else {
      setEditingGroup(null);
      setGroupForm(INITIAL_GROUP_FORM);
    }
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = () => {
    const validationPayload = {
      name: groupForm.name,
      isRequired: groupForm.isRequired,
      minSelections: groupForm.minSelections ? parseInt(groupForm.minSelections, 10) : 0,
      maxSelections: groupForm.maxSelections ? parseInt(groupForm.maxSelections, 10) : null,
      options: editingGroup ? editingGroup.options : []
    };

    const result = modifierGroupSchema.safeParse(validationPayload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = t(issue.message);
      });
      setGroupErrors(fieldErrors);
      toast.error(t('errors.formValidation'));
      return;
    }

    setGroupErrors({});
    const formattedData = {
      ...result.data,
      options: editingGroup ? undefined : []
    };

    if (editingGroup) updateGroup({ id: editingGroup.id, data: formattedData });
    else createGroup(formattedData);
    setIsGroupModalOpen(false);
  };

  const handleOpenOptionModal = (groupId: string, option?: any) => {
    setActiveGroupId(groupId);
    if (option) {
      setEditingOption(option);
      setOptionForm({ name: option.name, price: option.price || '', isAvailable: option.isAvailable });
    } else {
      setEditingOption(null);
      setOptionForm(INITIAL_OPTION_FORM);
    }
    setIsOptionModalOpen(true);
  };

  const handleSaveOption = () => {
    const group = groups.find((g: any) => g.id === activeGroupId);
    if (!group) return;

    const parsedPrice = optionForm.price ? parseFloat(optionForm.price) : 0;
    const validationPayload = {
      name: optionForm.name,
      price: parsedPrice,
      isAvailable: optionForm.isAvailable
    };

    const validationResult = modifierOptionSchema.safeParse(validationPayload);
    if (!validationResult.success) {
      toast.error(t('errors.formValidation'));
      return;
    }

    const formattedOption = { 
      ...optionForm, 
      price: parsedPrice 
    };
    let newOptions = [...group.options];

    if (editingOption) {
      newOptions = newOptions.map((opt: any) => opt.id === editingOption.id ? { ...opt, ...formattedOption } : opt);
    } else {
      newOptions.push({
        id: crypto.randomUUID(),
        ...formattedOption
      });
    }

    updateGroup({ 
      id: activeGroupId, 
      data: { 
        name: group.name,
        isRequired: group.isRequired,
        minSelections: group.minSelections,
        maxSelections: group.maxSelections,
        options: newOptions 
      } 
    });
    setIsOptionModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'group') {
      deleteGroup(deleteTarget.id);
    } else if (deleteTarget.type === 'option' && deleteTarget.groupId) {
      const group = groups.find((g: any) => g.id === deleteTarget.groupId);
      if (group) {
        const newOptions = group.options.filter((opt: any) => opt.id !== deleteTarget.id);
        updateGroup({ 
          id: group.id, 
          data: { 
            name: group.name,
            isRequired: group.isRequired,
            minSelections: group.minSelections,
            maxSelections: group.maxSelections,
            options: newOptions 
          } 
        });
      }
    }
    setDeleteTarget(null);
  };

  return (
    <div className="flex h-full flex-col pb-10">
      <div className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-brand-cream/80 dark:bg-brand-espresso/80 backdrop-blur-md py-3 border-b border-brand-gray/10 -mx-2 px-2 sm:-mx-6 sm:px-6">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-xl font-bold text-brand-espresso dark:text-brand-cream tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-copper" />
            {t('menu.constructor.modifiers.title')}
          </h2>
          <p className="text-sm text-brand-gray mt-1">{t('menu.constructor.modifiers.emptyDesc')}</p>
        </div>
        <Button variant="brand" onClick={() => handleOpenGroupModal()} className="h-10 px-5 rounded-lg text-sm shadow-md" icon={<Plus className="h-4 w-4" />}>
          {t('menu.constructor.modifiers.addBtn')}
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 mt-4 rounded-3xl border-2 border-dashed border-brand-gray/20 bg-white/50 dark:bg-brand-mocha/20 text-center">
          <div className="h-16 w-16 bg-brand-cream dark:bg-brand-gray/10 rounded-full flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-brand-copper" />
          </div>
          <h3 className="text-xl font-bold text-brand-espresso dark:text-brand-cream mb-2">{t('menu.constructor.modifiers.emptyTitle')}</h3>
          <p className="text-brand-gray max-w-sm mb-6 text-sm">{t('menu.constructor.modifiers.emptyStateDesc')}</p>
          <Button variant="outline" onClick={() => handleOpenGroupModal()} className="border-brand-copper text-brand-copper" icon={<Plus className="h-4 w-4" />}>
            {t('menu.constructor.modifiers.addFirstBtn')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group: any) => (
            <div key={group.id} className="flex flex-col rounded-xl bg-white dark:bg-brand-mocha border border-brand-gray/10 shadow-xs transition-all">
              <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-brand-cream/30 dark:hover:bg-brand-gray/5 transition-colors rounded-xl">
                <div className="flex items-center gap-2 flex-1 cursor-pointer select-none" onClick={() => toggleGroup(group.id)}>
                  <div className="p-1 rounded-md text-brand-gray">
                    {expandedGroups[group.id] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-espresso dark:text-brand-cream flex items-center gap-2">
                      {group.name}
                      {group.isRequired && <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-50 text-red-600 border border-red-100">{t('menu.constructor.modifiers.requiredBadge')}</span>}
                    </h3>
                    <p className="text-xs text-brand-gray mt-0.5">
                      {t('menu.constructor.modifiers.minSelect')} {group.minSelections} | {t('menu.constructor.modifiers.maxSelect')} {group.maxSelections || t('menu.constructor.modifiers.unlimited')} • {group.options.length} {t('menu.constructor.modifiers.optionsCount')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => handleOpenGroupModal(group)} className="p-2 rounded-lg text-brand-gray hover:text-brand-copper hover:bg-brand-cream dark:hover:bg-brand-gray/10 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget({ type: 'group', id: group.id })} className="p-2 rounded-lg text-brand-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={`transition-all duration-300 ease-in-out origin-top ${expandedGroups[group.id] ? 'max-h-500 opacity-100 border-t border-brand-gray/10' : 'max-h-0 opacity-0 overflow-hidden border-t-0'}`}>
                <div className="p-2 sm:p-4 flex flex-col gap-2">
                  {group.options.length === 0 ? (
                    <div className="p-4 text-center text-sm text-brand-gray">{t('menu.constructor.modifiers.emptyOptions')}</div>
                  ) : (
                    group.options.map((option: any) => (
                      <div key={option.id} className={`flex items-center justify-between p-3 rounded-lg border border-brand-gray/10 bg-brand-cream/10 dark:bg-brand-gray/5 hover:border-brand-copper/30 transition-colors ${!option.isAvailable ? 'opacity-60' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${option.isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
                          <span className={`text-sm font-medium ${!option.isAvailable ? 'text-brand-gray line-through' : 'text-brand-espresso dark:text-brand-cream'}`}>
                            {option.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className="text-sm font-bold text-brand-copper">
                            {option.price > 0 ? `+ ${option.price} ${t('menu.currency')}` : t('menu.constructor.modifiers.free')}
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleOpenOptionModal(group.id, option)} className="p-1.5 rounded-md text-brand-gray hover:text-brand-copper hover:bg-white transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setDeleteTarget({ type: 'option', id: option.id, groupId: group.id })} className="p-1.5 rounded-md text-brand-gray hover:text-red-500 hover:bg-white transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  <Button 
                    variant="outline" 
                    onClick={() => handleOpenOptionModal(group.id)}
                    className="mt-2 h-9 border-dashed border-2 border-brand-gray/30 text-brand-gray hover:border-brand-copper hover:text-brand-copper bg-transparent transition-colors"
                    icon={<Plus className="h-4 w-4" />}
                  >
                    {t('menu.constructor.modifiers.addOptionBtn')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModifierGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} isEditing={!!editingGroup} form={groupForm} setForm={setGroupForm} onSave={handleSaveGroup} errors={groupErrors} />
      <ModifierOptionModal isOpen={isOptionModalOpen} onClose={() => setIsOptionModalOpen(false)} isEditing={!!editingOption} form={optionForm} setForm={setOptionForm} onSave={handleSaveOption} />
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} description={deleteTarget?.type === 'group' ? t('menu.constructor.modifiers.deleteConfirm') : t('menu.constructor.modifiers.deleteOptionConfirm')} />
    </div>
  );
};