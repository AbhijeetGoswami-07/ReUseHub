import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MarketplaceListing } from '@/types';
import {
  ShieldCheck,
  Send,
  AlertCircle,
  HelpCircle,
  Repeat,
  Truck,
  DollarSign,
} from 'lucide-react';

export interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketplaceListing | null;
  onSubmit: (data: {
    listingId: string;
    listingTitle: string;
    sellerId: string;
    buyerName: string;
    buyerEmail: string;
    message: string;
    inquiryType: 'question' | 'offer' | 'pickup_request';
    proposedPrice?: number;
  }) => Promise<void>;
  defaultBuyer?: {
    name: string;
    email: string;
  };
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSubmit,
  defaultBuyer,
}) => {
  const [buyerName, setBuyerName] = useState(defaultBuyer?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(defaultBuyer?.email || '');
  const [inquiryType, setInquiryType] = useState<'question' | 'offer' | 'pickup_request'>('question');
  const [message, setMessage] = useState('');
  const [proposedPrice, setProposedPrice] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!listing) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!buyerName.trim()) {
      errs.buyerName = 'Your name is required.';
    }
    if (!buyerEmail.trim() || !buyerEmail.includes('@')) {
      errs.buyerEmail = 'A valid contact email is required.';
    }
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please provide a clear message (at least 10 characters).';
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
        listingId: listing.id,
        listingTitle: listing.productName || listing.title || 'Product Listing',
        sellerId: listing.sellerId,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        message: message.trim(),
        inquiryType,
        proposedPrice: proposedPrice ? parseFloat(proposedPrice) : undefined,
      });
      setMessage('');
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to send inquiry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={`Contact Seller: ${listing.productName || listing.title}`}
      description={`Reach out to ${listing.sellerName} in ${listing.city}, ${listing.state}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2 pb-2">
        {errors.form && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Listing preview pill */}
        <div className="p-3 rounded-xl bg-brand-bg border border-brand-border flex items-center gap-3">
          <ImageWithFallback
            src={listing.imageUrl}
            alt={listing.productName || listing.title}
            className="w-12 h-12 rounded-lg object-cover border border-brand-border shrink-0"
          />
          <div className="truncate text-xs">
            <div className="font-bold text-brand-primary truncate">{listing.productName || listing.title}</div>
            <div className="text-brand-muted">
              {listing.listingType === 'Sale' ? `Listed for $${listing.price.toFixed(2)}` : listing.listingType} • {listing.condition}
            </div>
          </div>
        </div>

        {/* Inquiry Type Radio Chips */}
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            What is your inquiry about?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setInquiryType('question')}
              className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                inquiryType === 'question'
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-white text-brand-text border-brand-border hover:bg-forest-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Question</span>
            </button>

            <button
              type="button"
              onClick={() => setInquiryType('pickup_request')}
              className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                inquiryType === 'pickup_request'
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-white text-brand-text border-brand-border hover:bg-forest-50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Pickup</span>
            </button>

            <button
              type="button"
              onClick={() => setInquiryType('offer')}
              className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                inquiryType === 'offer'
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-white text-brand-text border-brand-border hover:bg-forest-50'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Offer / Trade</span>
            </button>
          </div>
        </div>

        {/* Proposed Price if Offer / Trade */}
        {inquiryType === 'offer' && (
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Proposed Price or Cash Offer (Optional)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
              <input
                type="number"
                min="0"
                step="0.5"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                placeholder="e.g. 15.00"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-border text-xs text-brand-text focus:outline-none focus:border-brand-secondary"
              />
            </div>
          </div>
        )}

        {/* Buyer Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Your Name *
            </label>
            <Input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="e.g. Jane Doe"
              error={errors.buyerName}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Your Email *
            </label>
            <Input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              placeholder="e.g. jane@example.com"
              error={errors.buyerEmail}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Your Message *
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              inquiryType === 'pickup_request'
                ? 'Hi! I would love to pick this up this Saturday afternoon if still available...'
                : inquiryType === 'offer'
                ? 'Hi! Would you be willing to trade for my woodworking clamps or accept $15?'
                : 'Hi! Could you let me know the exact dimensions of this item?'
            }
            className={`w-full p-3 rounded-xl border text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-1 transition-all ${
              errors.message
                ? 'border-red-400 focus:ring-red-500'
                : 'border-brand-border focus:border-brand-secondary focus:ring-brand-secondary'
            }`}
          />
          {errors.message && (
            <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>
          )}
        </div>

        {/* Security & Contact Protection Reassurance */}
        <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 flex items-start gap-2 text-xs text-brand-muted">
          <ShieldCheck className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
          <p className="text-[11px]">
            Your email is securely forwarded to {listing.sellerName}. We never publish personal contact details publicly on listings.
          </p>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            leftIcon={isSubmitting ? undefined : <Send className="w-3.5 h-3.5" />}
          >
            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
