import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImageFile } from '@/services/storageService';
import {
  MarketplaceListing,
  MarketplaceListingType,
  ProductCategory,
  ProductCondition,
  ProductMaterial,
} from '@/types';
import {
  Upload,
  X,
  AlertCircle,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export interface ListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    productName: string;
    description: string;
    category: ProductCategory;
    material: ProductMaterial;
    condition: ProductCondition;
    listingType: MarketplaceListingType;
    price: number;
    city: string;
    state: string;
    images: string[];
  }) => Promise<void>;
  initialData?: MarketplaceListing | null;
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

const MATERIALS: ProductMaterial[] = [
  'Cotton',
  'Plastic',
  'Wood',
  'Glass',
  'Metal',
  'Paper',
  'Leather',
  'Electronic Components',
  'Mixed Material',
  'Unknown',
];

const CONDITIONS: ProductCondition[] = [
  'Like New',
  'Good',
  'Needs Repair',
  'Damaged',
  'Unusable',
];

const LISTING_TYPES: MarketplaceListingType[] = [
  'Free Donation',
  'Product Exchange',
  'Sale',
];

export const ListingFormModal: React.FC<ListingFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}) => {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Furniture');
  const [material, setMaterial] = useState<ProductMaterial>('Wood');
  const [condition, setCondition] = useState<ProductCondition>('Good');
  const [listingType, setListingType] = useState<MarketplaceListingType>('Free Donation');
  const [price, setPrice] = useState<string>('0');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Furniture');
      setMaterial(initialData.material || 'Wood');
      setCondition(initialData.condition || 'Good');
      setListingType(initialData.listingType || 'Free Donation');
      setPrice(initialData.price ? String(initialData.price) : '0');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      setImages(initialData.images && initialData.images.length > 0 ? initialData.images : [initialData.imageUrl]);
    } else {
      // Default reset
      setProductName('');
      setDescription('');
      setCategory('Furniture');
      setMaterial('Wood');
      setCondition('Good');
      setListingType('Free Donation');
      setPrice('0');
      setCity('Seattle');
      setState('WA');
      setImages([
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      ]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const uploadResult = await uploadImageFile({
        bucket: 'marketplace-images',
        file,
        userId: user?.id,
      });

      setImages((prev) => [...prev, uploadResult.url]);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        return next;
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
      setErrors((prev) => ({
        ...prev,
        images: message,
      }));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
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
      setErrors((prev) => ({
        ...prev,
        images: 'Please enter a valid HTTP/HTTPS image URL.',
      }));
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!productName.trim()) {
      errs.productName = 'Product name is required.';
    }
    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Please provide a descriptive explanation (at least 15 characters).';
    }
    if (!city.trim()) {
      errs.city = 'City is required for local pickup.';
    }
    if (!state.trim()) {
      errs.state = 'State or region is required.';
    }
    if (listingType === 'Sale') {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        errs.price = 'Please specify a valid sale price greater than 0.';
      }
    }
    if (images.length === 0) {
      errs.images = 'At least one product image is required.';
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
        productName: productName.trim(),
        description: description.trim(),
        category,
        material,
        condition,
        listingType,
        price: listingType === 'Sale' ? parseFloat(price) : 0,
        city: city.trim(),
        state: state.trim(),
        images,
      });
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save listing. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={mode === 'create' ? 'Post a Circular Marketplace Listing' : 'Edit Your Listing'}
      description="Connect with local community members to donate, trade, or sell usable second-hand goods."
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-2">
        {errors.form && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Product Name *
          </label>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Solid Pine Study Desk & Drawer Organizer"
            error={errors.productName}
          />
        </div>

        {/* Listing Type Segmented Selection */}
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Listing Type *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LISTING_TYPES.map((type) => {
              const isSelected = listingType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setListingType(type)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary shadow-soft-xs'
                      : 'bg-brand-bg text-brand-text border-brand-border hover:bg-forest-50'
                  }`}
                >
                  <span>{type}</span>
                  <span
                    className={`text-[10px] font-normal ${
                      isSelected ? 'text-white/80' : 'text-brand-muted'
                    }`}
                  >
                    {type === 'Free Donation' && '100% Free / Rehome'}
                    {type === 'Product Exchange' && 'Trade for other items'}
                    {type === 'Sale' && 'Direct cash/online'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price (Only if Sale) */}
        {listingType === 'Sale' && (
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 animate-in fade-in duration-200 space-y-1.5">
            <label className="block text-xs font-bold text-emerald-900">
              Sale Price (USD) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25.00"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-emerald-300 text-sm font-semibold text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              />
            </div>
            {errors.price && (
              <p className="text-[11px] text-red-600">{errors.price}</p>
            )}
            <p className="text-[11px] text-emerald-800">
              Fair, affordable pricing encourages circular reuse instead of landfill disposal.
            </p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Detailed Description *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product's story, dimensions, condition, reason for rehoming, and any specific pickup guidelines..."
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

        {/* Category, Material, Condition 3-col Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Category *
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Primary Material *
            </label>
            <Select
              value={material}
              onChange={(e) => setMaterial(e.target.value as ProductMaterial)}
              options={MATERIALS.map((m) => ({ value: m, label: m }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Condition *
            </label>
            <Select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ProductCondition)}
              options={CONDITIONS.map((c) => ({ value: c, label: c }))}
            />
          </div>
        </div>

        {/* Location (City & State) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              City *
            </label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Seattle"
              error={errors.city}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              State / Region *
            </label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. WA"
              error={errors.state}
            />
          </div>
        </div>

        {/* Images Upload & Gallery Management */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-brand-text">
              Product Images ({images.length}) *
            </label>
            <span className="text-[11px] text-brand-muted">Max 5 MB each (JPG, PNG, WEBP)</span>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border border-brand-border group bg-forest-50"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Preview ${idx + 1}`}
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

          {/* Add Image Controls: File upload + URL input */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className={`w-full sm:w-auto flex-1 cursor-pointer border border-dashed border-brand-border hover:border-brand-secondary rounded-xl p-3 bg-brand-bg/50 hover:bg-forest-50 text-center transition-colors flex items-center justify-center gap-2 text-xs text-brand-muted ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 text-brand-secondary animate-spin" />
                  <span>Uploading to Storage...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-brand-secondary" />
                  <span>Choose Image from Device</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <div className="w-full sm:w-auto flex-1 flex items-center gap-1.5">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Or paste image URL..."
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

        {/* Security & Contact Protection Notice */}
        <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-100 flex items-start gap-2.5 text-xs text-brand-muted">
          <ShieldCheck className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-brand-primary">Privacy Protected Exchange:</strong>
            <p>
              Your personal email and phone number are never made public. Potential buyers communicate through ReUseHub platform inquiries.
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            leftIcon={isSubmitting ? undefined : <CheckCircle2 className="w-4 h-4" />}
          >
            {isSubmitting ? 'Saving Listing...' : mode === 'create' ? 'Publish Listing' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
