import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ConfirmActionModal } from '@/components/admin/ConfirmActionModal';
import { AdminCategory } from '@/types';
import {
  Layers,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Scale,
} from 'lucide-react';

export interface AdminCategoriesViewProps {
  categories: AdminCategory[];
  onCreateCategory: (cat: Omit<AdminCategory, 'createdAt'>) => Promise<void>;
  onUpdateCategory: (id: string, updates: Partial<AdminCategory>) => Promise<void>;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
}) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    description: string;
    wasteFactor: number;
    sortOrder: number;
    isActive: boolean;
  }>({
    id: '',
    name: '',
    description: '',
    wasteFactor: 1.0,
    sortOrder: categories.length + 1,
    isActive: true,
  });

  const [confirmToggleTarget, setConfirmToggleTarget] = useState<AdminCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      wasteFactor: 1.0,
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setModalMode('create');
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setFormData({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      wasteFactor: cat.wasteFactor,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setModalMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const slug = formData.id.toLowerCase().replace(/[^a-z0-9_-]/g, '') || formData.name.toLowerCase().replace(/\s+/g, '-');
        await onCreateCategory({
          ...formData,
          id: slug,
        });
      } else if (modalMode === 'edit' && editingCategory) {
        await onUpdateCategory(editingCategory.id, {
          name: formData.name,
          description: formData.description,
          wasteFactor: Number(formData.wasteFactor),
          sortOrder: Number(formData.sortOrder),
          isActive: formData.isActive,
        });
      }
      setModalMode(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmToggleActive = async () => {
    if (!confirmToggleTarget) return;
    setIsSubmitting(true);
    try {
      await onUpdateCategory(confirmToggleTarget.id, {
        isActive: !confirmToggleTarget.isActive,
      });
      setConfirmToggleTarget(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Taxonomy Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
            Reuse & Sorting Categories ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted">
            Configure system categories, density waste factors (kg multipliers), and active states.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Product Category
        </Button>
      </div>

      {/* Categories Grid/Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} variant="bordered" className="p-5 bg-white space-y-3 relative group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-forest-500 uppercase">slug: {cat.id}</span>
                <h3 className="text-sm font-bold text-forest-900">{cat.name}</h3>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  cat.isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-forest-100 text-forest-600'
                }`}
              >
                {cat.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {cat.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>

            <p className="text-xs text-dark-muted leading-relaxed line-clamp-2">
              {cat.description}
            </p>

            <div className="pt-2 border-t border-forest-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-forest-800 font-semibold">
                <Scale className="w-3.5 h-3.5 text-forest-500" />
                <span>{cat.wasteFactor} kg / unit</span>
              </div>
              <div className="text-[11px] text-dark-subtle">
                Order: #{cat.sortOrder}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] px-2 py-1 h-7 text-forest-700 hover:text-forest-900"
                onClick={() => setConfirmToggleTarget(cat)}
              >
                {cat.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] px-2.5 py-1 h-7"
                onClick={() => handleOpenEdit(cat)}
                leftIcon={<Edit2 className="w-3 h-3" />}
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create / Edit Category Modal */}
      {modalMode && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'create' ? 'Add New Product Category' : `Edit Category: ${editingCategory?.name}`}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {modalMode === 'create' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">
                  Unique Slug Identifier (e.g. ceramic, textiles)
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g. ceramics"
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-900">Category Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ceramic & Stoneware"
                className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-900">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe product items and material characteristics in this category..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">
                  Default Waste Factor (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={formData.wasteFactor}
                  onChange={(e) => setFormData({ ...formData, wasteFactor: parseFloat(e.target.value) || 1.0 })}
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">Sort Priority</label>
                <input
                  type="number"
                  min="1"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isCatActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-forest-300 text-forest-600 focus:ring-forest-500 h-4 w-4"
              />
              <label htmlFor="isCatActive" className="text-xs font-medium text-forest-900">
                Category is actively visible in analyzer and marketplace filters
              </label>
            </div>

            <div className="pt-3 border-t border-forest-100 flex items-center justify-end gap-2.5">
              <Button variant="ghost" size="sm" onClick={() => setModalMode(null)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                {modalMode === 'create' ? 'Create Category' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmation Dialog for Category Toggle */}
      <ConfirmActionModal
        isOpen={!!confirmToggleTarget}
        onClose={() => setConfirmToggleTarget(null)}
        onConfirm={handleConfirmToggleActive}
        isLoading={isSubmitting}
        title={`${confirmToggleTarget?.isActive ? 'Deactivate' : 'Activate'} Category`}
        description={`Are you sure you want to ${
          confirmToggleTarget?.isActive ? 'deactivate' : 'activate'
        } "${confirmToggleTarget?.name}"? Deactivating removes it from public dropdown menus.`}
        confirmLabel={confirmToggleTarget?.isActive ? 'Deactivate' : 'Activate'}
        isDestructive={confirmToggleTarget?.isActive}
      />
    </div>
  );
};
