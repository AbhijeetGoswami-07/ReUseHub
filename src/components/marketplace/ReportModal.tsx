import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { MarketplaceListing } from '@/types';
import { Flag, AlertTriangle } from 'lucide-react';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketplaceListing | null;
  onSubmit: (data: {
    listingId: string;
    listingTitle: string;
    reason: 'hazardous_material' | 'fraud_scam' | 'prohibited_item' | 'inaccurate_description' | 'other';
    details: string;
    reporterEmail?: string;
  }) => Promise<void>;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSubmit,
}) => {
  const [reason, setReason] = useState<
    'hazardous_material' | 'fraud_scam' | 'prohibited_item' | 'inaccurate_description' | 'other'
  >('inaccurate_description');
  const [details, setDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || details.trim().length < 10) {
      setError('Please provide at least 10 characters explaining your report.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        listingId: listing.id,
        listingTitle: listing.productName || listing.title || 'Product Listing',
        reason,
        details: details.trim(),
        reporterEmail: reporterEmail.trim() || undefined,
      });
      setDetails('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Report This Listing"
      description={`Flag "${listing.productName || listing.title}" for safety, fraud, or policy violations.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 pb-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Reason for Report *
          </label>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value as any)}
            options={[
              { value: 'hazardous_material', label: 'Hazardous Material / Safety Risk' },
              { value: 'fraud_scam', label: 'Fraudulent Activity or Scam' },
              { value: 'prohibited_item', label: 'Prohibited Item' },
              { value: 'inaccurate_description', label: 'Inaccurate or Misleading Description' },
              { value: 'other', label: 'Other Concern' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Explanation & Details *
          </label>
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please provide specific details to help our safety moderators investigate..."
            className="w-full p-3 rounded-xl border border-brand-border text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Your Email (Optional, for follow-up)
          </label>
          <input
            type="email"
            value={reporterEmail}
            onChange={(e) => setReporterEmail(e.target.value)}
            placeholder="e.g. you@example.com"
            className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-text focus:outline-none focus:border-brand-secondary"
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
            leftIcon={<Flag className="w-3.5 h-3.5" />}
            className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
