import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import {
  EcoActivityType,
  EcoVerificationStatus,
  RecordActivityInput,
  ECO_SCORING_RULES,
  calculateEcoScorePoints,
} from '@/services/ecoScoreService';
import {
  CheckCircle2,
  AlertCircle,
  Scale,
  Sparkles,
  Info,
  ShieldCheck,
  Upload,
} from 'lucide-react';

export interface RecordActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecordActivityInput) => Promise<void>;
}

const CATEGORIES = [
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

const WEIGHT_PRESETS = [
  { label: 'Small (~0.5 kg)', weight: 0.5, hint: 'T-shirt, phone, small jar' },
  { label: 'Medium (~2.0 kg)', weight: 2.0, hint: 'Laptop, jeans, blender' },
  { label: 'Large (~8.0 kg)', weight: 8.0, hint: 'Chair, heavy desktop, microwave' },
  { label: 'Bulky (~18.0 kg)', weight: 18.0, hint: 'Desk, mattress, dresser' },
];

export const RecordActivityModal: React.FC<RecordActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [activityType, setActivityType] = useState<EcoActivityType>('repair');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Furniture');
  const [estimatedWeightKg, setEstimatedWeightKg] = useState('2.0');
  const [verificationStatus, setVerificationStatus] = useState<EcoVerificationStatus>('user_reported');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Transparent Score Calculation
  const calculation = useMemo(() => {
    const numWeight = parseFloat(estimatedWeightKg) || 1.0;
    return calculateEcoScorePoints(activityType, numWeight, verificationStatus);
  }, [activityType, estimatedWeightKg, verificationStatus]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, proofImage: 'File size exceeds 5 MB limit.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProofImageUrl(event.target.result as string);
        setVerificationStatus('photo_verified');
        setErrors((prev) => {
          const next = { ...prev };
          delete next.proofImage;
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!productName.trim()) {
      errs.productName = 'Product name is required.';
    }
    const weightNum = parseFloat(estimatedWeightKg);
    if (isNaN(weightNum) || weightNum <= 0) {
      errs.weight = 'Please provide a valid estimated weight greater than 0 kg.';
    }
    if (verificationStatus === 'photo_verified' && !proofImageUrl.trim()) {
      errs.proofImage = 'Please upload a photo or provide an image URL for photo verification.';
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
        activityType,
        productName: productName.trim(),
        productCategory,
        estimatedWeightKg: parseFloat(estimatedWeightKg),
        verificationStatus,
        proofImageUrl: proofImageUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      // Reset form
      setProductName('');
      setNotes('');
      setProofImageUrl('');
      setVerificationStatus('user_reported');
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to record activity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRule = ECO_SCORING_RULES[activityType];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Record & Confirm Completed Circular Activity"
      description="Earn transparent EcoScore points by confirming a product you repaired, reused, upcycled, donated, or recycled."
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-2">
        {errors.form && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* 1. Activity Type Segmented Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-brand-text">
              Activity Type (Circular Priority) *
            </label>
            <span className="text-[11px] text-brand-muted">
              Hierarchy: Repair &gt; Upcycle &gt; Reuse &gt; Donate &gt; Recycle
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['repair', 'upcycle', 'reuse', 'donate', 'recycle'] as EcoActivityType[]).map((type) => {
              const rule = ECO_SCORING_RULES[type];
              const isSelected = activityType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActivityType(type)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary shadow-soft-xs font-bold'
                      : 'bg-white text-brand-text border-brand-border hover:bg-forest-50'
                  }`}
                >
                  <span className="text-xs capitalize">{type}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-brand-muted'}`}>
                    +{rule.basePoints} base pts
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-brand-muted mt-1.5 italic">
            {activeRule.title}: {activeRule.description}
          </p>
        </div>

        {/* 2. Product Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Product Name *
            </label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Wobbly dining chair, winter coat, mason jar"
              error={errors.productName}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Product Category *
            </label>
            <Select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
        </div>

        {/* 3. Estimated Weight (kg) with Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-brand-text flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Estimated Weight Diverted (kg) *</span>
            </label>
            <span className="text-[11px] text-brand-muted">
              Earns +{activeRule.pointsPerKg} pts per kg
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Input
              type="number"
              step="0.1"
              min="0.1"
              max="500"
              value={estimatedWeightKg}
              onChange={(e) => setEstimatedWeightKg(e.target.value)}
              placeholder="2.0"
              className="w-36 font-semibold"
              error={errors.weight}
            />
            <span className="text-xs font-medium text-brand-muted">Kilograms</span>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-brand-muted mr-1">Quick Presets:</span>
            {WEIGHT_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setEstimatedWeightKg(String(p.weight))}
                className="px-2.5 py-1 rounded-lg bg-brand-bg hover:bg-forest-50 border border-brand-border text-[11px] text-brand-text font-medium transition-colors"
                title={p.hint}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Verification Level Selection */}
        <div className="space-y-3 p-4 rounded-xl bg-forest-50/70 border border-forest-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-brand-secondary" />
              <span>Activity Verification Level</span>
            </span>
            <span className="text-[11px] text-brand-muted">Transparent Trust Standards</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* User-Reported */}
            <label
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                verificationStatus === 'user_reported'
                  ? 'bg-white border-brand-primary ring-1 ring-brand-primary text-brand-text shadow-soft-xs'
                  : 'bg-white/60 border-brand-border text-brand-muted hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <input
                  type="radio"
                  name="verificationStatus"
                  value="user_reported"
                  checked={verificationStatus === 'user_reported'}
                  onChange={() => setVerificationStatus('user_reported')}
                  className="accent-brand-primary"
                />
                <span className="text-[10px] font-bold text-brand-muted uppercase">Base</span>
              </div>
              <div>
                <strong className="block text-brand-primary">User-Reported</strong>
                <p className="text-[11px] text-brand-muted leading-tight">
                  Standard self-declaration (+0 bonus pts)
                </p>
              </div>
            </label>

            {/* Photo-Verified */}
            <label
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                verificationStatus === 'photo_verified'
                  ? 'bg-white border-brand-primary ring-1 ring-brand-primary text-brand-text shadow-soft-xs'
                  : 'bg-white/60 border-brand-border text-brand-muted hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <input
                  type="radio"
                  name="verificationStatus"
                  value="photo_verified"
                  checked={verificationStatus === 'photo_verified'}
                  onChange={() => setVerificationStatus('photo_verified')}
                  className="accent-brand-primary"
                />
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                  +15 pts
                </span>
              </div>
              <div>
                <strong className="block text-brand-primary">Photo-Verified</strong>
                <p className="text-[11px] text-brand-muted leading-tight">
                  Before/after or drop-off photo proof (+15 bonus)
                </p>
              </div>
            </label>

            {/* Community-Confirmed */}
            <label
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                verificationStatus === 'community_confirmed'
                  ? 'bg-white border-brand-primary ring-1 ring-brand-primary text-brand-text shadow-soft-xs'
                  : 'bg-white/60 border-brand-border text-brand-muted hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <input
                  type="radio"
                  name="verificationStatus"
                  value="community_confirmed"
                  checked={verificationStatus === 'community_confirmed'}
                  onChange={() => setVerificationStatus('community_confirmed')}
                  className="accent-brand-primary"
                />
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  +25 pts
                </span>
              </div>
              <div>
                <strong className="block text-brand-primary">Community-Confirmed</strong>
                <p className="text-[11px] text-brand-muted leading-tight">
                  Partner center or marketplace recipient (+25 bonus)
                </p>
              </div>
            </label>
          </div>

          {/* Photo upload input if photo-verified */}
          {verificationStatus === 'photo_verified' && (
            <div className="pt-2 border-t border-forest-100 space-y-2">
              <label className="block text-xs font-semibold text-brand-text">
                Upload Photo Proof or Paste Image URL *
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <label className="w-full sm:w-auto flex-1 cursor-pointer border border-dashed border-brand-border hover:border-brand-secondary rounded-xl p-2.5 bg-white text-center transition-colors flex items-center justify-center gap-2 text-xs text-brand-muted">
                  <Upload className="w-4 h-4 text-brand-secondary" />
                  <span>Choose Photo Proof</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="w-full sm:w-auto flex-1">
                  <input
                    type="url"
                    value={proofImageUrl}
                    onChange={(e) => setProofImageUrl(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary bg-white"
                  />
                </div>
              </div>

              {proofImageUrl && (
                <div className="flex items-center gap-2 text-xs text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Photo evidence attached successfully</span>
                </div>
              )}
              {errors.proofImage && (
                <p className="text-[11px] text-red-600">{errors.proofImage}</p>
              )}
            </div>
          )}
        </div>

        {/* 5. Notes / Description */}
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Activity Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share details of your repair technique, creative transformation, or donation venue..."
            className="w-full p-2.5 rounded-xl border border-brand-border text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary"
          />
        </div>

        {/* 6. REAL-TIME TRANSPARENT SCORE PREVIEW (Crucial Requirement) */}
        <div className="p-4 rounded-xl bg-white border-2 border-brand-primary/20 shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-secondary" />
              <span>Transparent EcoScore Calculation</span>
            </span>
            <div className="text-right">
              <span className="text-xl font-display font-extrabold text-brand-primary">
                +{calculation.total} Points
              </span>
            </div>
          </div>

          {/* Mathematical breakdown */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-brand-bg text-center text-xs">
            <div>
              <span className="text-[10px] text-brand-muted block">Base Points</span>
              <strong className="text-brand-primary font-bold">+{calculation.basePoints}</strong>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted block">
                Weight ({estimatedWeightKg} kg × {activeRule.pointsPerKg})
              </span>
              <strong className="text-brand-primary font-bold">+{calculation.weightPoints}</strong>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted block">Verification Bonus</span>
              <strong className="text-emerald-700 font-bold">+{calculation.verificationBonus}</strong>
            </div>
          </div>

          {/* Non-invented lifecycle disclaimer */}
          <div className="flex items-start gap-2 text-[11px] text-brand-muted bg-stone-50 p-2 rounded-lg border border-stone-200">
            <Info className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
            <p>
              <strong>Illustrative LCA Benchmark:</strong> ~{calculation.illustrativeCo2Kg} kg CO2e offset reference derived from EPA WARM v15 circular factors. We explicitly distinguish user-estimated weight from exact carbon measurements.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
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
            {isSubmitting ? 'Confirming Activity...' : 'Confirm & Earn Points'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
