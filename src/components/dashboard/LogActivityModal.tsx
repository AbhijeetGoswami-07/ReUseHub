import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { ReuseAction } from '@/types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    actionType: ReuseAction | 'marketplace_rehome';
    productName: string;
    category?: string;
    co2SavedKg: number;
    wasteDivertedKg: number;
    notes?: string;
    completed: boolean;
  }) => Promise<void>;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [actionType, setActionType] = useState<ReuseAction | 'marketplace_rehome'>('reuse');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [co2SavedKg, setCo2SavedKg] = useState('8.5');
  const [wasteDivertedKg, setWasteDivertedKg] = useState('3.0');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError('Product name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        actionType,
        productName: productName.trim(),
        category,
        co2SavedKg: parseFloat(co2SavedKg) || 0,
        wasteDivertedKg: parseFloat(wasteDivertedKg) || 0,
        notes: notes.trim() || undefined,
        completed: true,
      });
      setProductName('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to log activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Log Completed Circular Action"
      description="Record a product you repaired, reused, upcycled, donated, or rehomed to track your actual environmental impact."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 pb-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Action Type *
          </label>
          <Select
            value={actionType}
            onChange={(e) => setActionType(e.target.value as any)}
            options={[
              { value: 'reuse', label: 'Reuse (Alternative use)' },
              { value: 'repair', label: 'Repair (Fixed or restored)' },
              { value: 'upcycle', label: 'Upcycle (Creative transformation)' },
              { value: 'donate', label: 'Donate (Community contribution)' },
              { value: 'recycle', label: 'Recycle (Certified diversion)' },
              { value: 'marketplace_rehome', label: 'Marketplace Rehome (Trade/Free/Sale)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Product Name *
            </label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Wobbly wooden chair"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Furniture', label: 'Furniture' },
                { value: 'Clothing', label: 'Clothing' },
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Glass', label: 'Glass' },
                { value: 'Plastic', label: 'Plastic' },
                { value: 'Paper', label: 'Paper' },
                { value: 'Metal', label: 'Metal' },
                { value: 'Household Items', label: 'Household Items' },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Est. CO2 Avoided (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={co2SavedKg}
              onChange={(e) => setCo2SavedKg(e.target.value)}
              placeholder="8.5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Waste Diverted (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={wasteDivertedKg}
              onChange={(e) => setWasteDivertedKg(e.target.value)}
              placeholder="3.0"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Notes & Details
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe what you did (e.g. replaced broken dowel pin, converted into tote bag)..."
            className="w-full p-2.5 rounded-xl border border-brand-border text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary"
          />
        </div>

        <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            {isSubmitting ? 'Logging...' : 'Save Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
