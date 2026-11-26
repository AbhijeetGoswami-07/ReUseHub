import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { CommunityPost, ProductCategory } from '@/types';
import { CreatePostInput } from '@/services/communityService';
import { uploadImageFile } from '@/services/storageService';
import {
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostInput) => Promise<void>;
  initialData?: CommunityPost | null;
  mode?: 'create' | 'edit';
}

const CATEGORIES: ProductCategory[] = [
  'Clothing',
  'Plastic',
  'Electronics',
  'Furniture',
  'Glass',
  'Paper',
  'Metal',
  'Household Items',
  'Other',
];

const DIFFICULTIES: ('Easy' | 'Moderate' | 'Advanced')[] = ['Easy', 'Moderate', 'Advanced'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Furniture');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Advanced'>('Moderate');
  const [estimatedTime, setEstimatedTime] = useState('1.5 hrs');
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Materials & Instructions dynamic arrays
  const [materials, setMaterials] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category as ProductCategory || 'Furniture');
      setDifficulty(initialData.difficulty || 'Moderate');
      setEstimatedTime(initialData.estimatedTime || '1.5 hrs');
      setImages(initialData.images && initialData.images.length > 0 ? initialData.images : [initialData.primaryImage]);
      setMaterials(initialData.requiredMaterials.length > 0 ? initialData.requiredMaterials : ['']);
      setInstructions(initialData.instructions.length > 0 ? initialData.instructions : ['']);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Furniture');
      setDifficulty('Moderate');
      setEstimatedTime('1.5 hrs');
      setImages([
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      ]);
      setMaterials(['Reclaimed material or product', 'Fasteners or non-toxic adhesive']);
      setInstructions([
        'Inspect and clean the base item to prepare surfaces.',
        'Cut or deconstruct damaged areas and assemble new structure.',
      ]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Image Upload File
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, images: 'Image exceeds maximum 5 MB limit.' }));
      return;
    }

    try {
      const res = await uploadImageFile({
        bucket: 'community-images',
        file,
        userId: initialData?.authorId,
      });
      setImages((prev) => [...prev, res.url]);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        return next;
      });
    } catch (uploadErr: any) {
      setErrors((prev) => ({ ...prev, images: uploadErr.message || 'Image upload failed.' }));
    }
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    try {
      new URL(customImageUrl);
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
      setErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        return next;
      });
    } catch {
      setErrors((prev) => ({ ...prev, images: 'Please enter a valid HTTP/HTTPS image URL.' }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Material helpers
  const handleMaterialChange = (index: number, val: string) => {
    setMaterials((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddMaterial = () => {
    setMaterials((prev) => [...prev, '']);
  };

  const handleRemoveMaterial = (index: number) => {
    if (materials.length <= 1) return;
    setMaterials((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Instruction helpers
  const handleInstructionChange = (index: number, val: string) => {
    setInstructions((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddInstruction = () => {
    setInstructions((prev) => [...prev, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length <= 1) return;
    setInstructions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Project title is required.';
    }
    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Please provide an inspiring description (at least 15 characters).';
    }
    if (images.length === 0) {
      errs.images = 'At least one project photograph is required.';
    }
    const cleanMaterials = materials.map((m) => m.trim()).filter(Boolean);
    if (cleanMaterials.length === 0) {
      errs.materials = 'Please list at least one required material.';
    }
    const cleanInstructions = instructions.map((i) => i.trim()).filter(Boolean);
    if (cleanInstructions.length === 0) {
      errs.instructions = 'Please provide at least one project instruction step.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        estimatedTime: estimatedTime.trim() || '1 hr',
        images,
        requiredMaterials: materials.map((m) => m.trim()).filter(Boolean),
        instructions: instructions.map((i) => i.trim()).filter(Boolean),
      });
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save post. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={mode === 'create' ? 'Share a Circular Reuse or Upcycle Project' : 'Edit Your Project Post'}
      description="Inspire fellow makers with your DIY transformation, required materials, and step-by-step instructions."
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-2">
        {errors.form && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Project Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Reclaimed Pallet Wood Vertical Herb Garden Planter"
            error={errors.title}
          />
        </div>

        {/* Category, Difficulty, Estimated Time (3 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Product Category *
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Difficulty Level
            </label>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Estimated Time
            </label>
            <Input
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="e.g. 2 hrs"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Project Description & Story *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What inspired you to reuse this item? What was the original product, and how does your transformation extend its utility?"
            className={`w-full p-3 rounded-xl border text-xs sm:text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-1 transition-all ${
              errors.description
                ? 'border-red-400 focus:ring-red-500'
                : 'border-brand-border focus:border-brand-secondary focus:ring-brand-secondary'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Project Photographs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-brand-text">
              Project Photographs ({images.length}) *
            </label>
            <span className="text-[11px] text-brand-muted">Max 5 MB each (JPG, PNG, WEBP)</span>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border border-brand-border group bg-forest-50"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Project shot ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-brand-primary/90 text-white text-[9px] font-bold">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Image Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="w-full sm:w-auto flex-1 cursor-pointer border border-dashed border-brand-border hover:border-brand-secondary rounded-xl p-3 bg-brand-bg/50 hover:bg-forest-50 text-center transition-colors flex items-center justify-center gap-2 text-xs text-brand-muted">
              <Upload className="w-4 h-4 text-brand-secondary" />
              <span>Choose Photo from Device</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="w-full sm:w-auto flex-1 flex items-center gap-1.5">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Or paste photo URL..."
                className="flex-1 px-3 py-2.5 rounded-xl border border-brand-border text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImageUrl}
                className="shrink-0 text-xs"
              >
                Add
              </Button>
            </div>
          </div>
          {errors.images && (
            <p className="text-[11px] text-red-600">{errors.images}</p>
          )}
        </div>

        {/* Required Materials List */}
        <div className="space-y-2 p-4 rounded-xl bg-brand-bg/70 border border-brand-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-brand-primary flex items-center gap-1.5 uppercase tracking-wide">
              <Layers className="w-4 h-4 text-brand-secondary" />
              <span>Required Materials & Tools *</span>
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMaterial}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs bg-white py-1 px-2.5"
            >
              Add Material
            </Button>
          </div>

          <div className="space-y-2">
            {materials.map((mat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-brand-muted w-5 text-right">{idx + 1}.</span>
                <input
                  type="text"
                  value={mat}
                  onChange={(e) => handleMaterialChange(idx, e.target.value)}
                  placeholder="e.g. 1 discarded wooden shipping pallet, 120-grit sandpaper"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-text bg-white focus:outline-none focus:border-brand-secondary"
                />
                {materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(idx)}
                    className="p-1 text-brand-muted hover:text-red-600"
                    title="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.materials && (
            <p className="text-[11px] text-red-600">{errors.materials}</p>
          )}
        </div>

        {/* Project Instructions Steps */}
        <div className="space-y-2 p-4 rounded-xl bg-brand-bg/70 border border-brand-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-brand-primary flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-secondary" />
              <span>Step-by-Step Instructions *</span>
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddInstruction}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs bg-white py-1 px-2.5"
            >
              Add Step
            </Button>
          </div>

          <div className="space-y-2.5">
            {instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  {idx + 1}
                </span>
                <textarea
                  rows={2}
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  placeholder={`Step ${idx + 1}: Explain this part of the build or disassembly...`}
                  className="flex-1 p-2.5 rounded-lg border border-brand-border text-xs text-brand-text bg-white focus:outline-none focus:border-brand-secondary leading-relaxed"
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="p-1 text-brand-muted hover:text-red-600 mt-2"
                    title="Remove step"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.instructions && (
            <p className="text-[11px] text-red-600">{errors.instructions}</p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            leftIcon={isSubmitting ? undefined : <CheckCircle2 className="w-4 h-4" />}
          >
            {isSubmitting ? 'Publishing...' : mode === 'create' ? 'Publish Project' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
