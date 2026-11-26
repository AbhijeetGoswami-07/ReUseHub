import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MarketplaceListing } from '@/types';
import {
  MapPin,
  Clock,
  Tag,
  Layers,
  Heart,
  Flag,
  MessageSquare,
  ShieldCheck,
  Edit3,
  Trash2,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketplaceListing | null;
  currentUserId?: string;
  isSaved?: boolean;
  onToggleSave?: (listing: MarketplaceListing) => void;
  onOpenInquiry?: (listing: MarketplaceListing) => void;
  onOpenReport?: (listing: MarketplaceListing) => void;
  onEdit?: (listing: MarketplaceListing) => void;
  onDelete?: (listingId: string) => void;
  onStatusChange?: (listingId: string, status: 'active' | 'reserved' | 'completed') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  listing,
  currentUserId,
  isSaved = false,
  onToggleSave,
  onOpenInquiry,
  onOpenReport,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!listing) return null;

  const images = listing.images && listing.images.length > 0 ? listing.images : [listing.imageUrl];
  const activeImage = images[selectedImageIndex] || listing.imageUrl;

  const isOwner = Boolean(
    currentUserId && (listing.sellerId === currentUserId || listing.sellerId === 'demo-user-id')
  );

  const listingTypeBadgeStyle: Record<string, { bg: string; text: string; border: string }> = {
    'Free Donation': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Product Exchange': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Sale: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  };

  const conditionBadgeStyle: Record<string, string> = {
    'Like New': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Good: 'bg-blue-100 text-blue-800 border-blue-200',
    'Needs Repair': 'bg-amber-100 text-amber-800 border-amber-200',
    Damaged: 'bg-orange-100 text-orange-800 border-orange-200',
    Unusable: 'bg-red-100 text-red-800 border-red-200',
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={listing.productName || listing.title}
      description={`Listed in ${listing.city}, ${listing.state} • ${listing.listingType}`}
    >
      <div className="space-y-6 pt-2 pb-4">
        {/* Top: Status Alert if reserved or completed */}
        {listing.status !== 'active' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <span className="font-semibold uppercase tracking-wide">
              Notice: This listing is currently marked as {listing.status}.
            </span>
            {isOwner && onStatusChange && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(listing.id, 'active')}
                className="text-xs bg-white"
              >
                Reactivate Listing
              </Button>
            )}
          </div>
        )}

        {/* Gallery Section */}
        <div className="space-y-3">
          {/* Main Large Image */}
          <div className="relative aspect-video sm:h-80 w-full rounded-2xl overflow-hidden bg-forest-50 border border-brand-border group">
            <ImageWithFallback
              src={activeImage}
              alt={listing.productName || listing.title}
              className="w-full h-full object-cover"
            />

            {/* Listing Type & Price Pill */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border shadow-soft-xs backdrop-blur-sm ${
                  listingTypeBadgeStyle[listing.listingType]?.bg || 'bg-white'
                } ${listingTypeBadgeStyle[listing.listingType]?.text || 'text-brand-primary'} ${
                  listingTypeBadgeStyle[listing.listingType]?.border || 'border-brand-border'
                }`}
              >
                {listing.listingType === 'Sale'
                  ? `For Sale: $${listing.price.toFixed(2)}`
                  : listing.listingType}
              </span>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${
                  conditionBadgeStyle[listing.condition] || 'bg-white text-brand-text'
                }`}
              >
                {listing.condition}
              </span>
            </div>

            {/* Bookmark & Share Overlay Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-brand-text flex items-center justify-center shadow-soft-sm transition-all"
                title="Share listing link"
              >
                <Share2 className="w-4 h-4 text-brand-muted" />
              </button>

              {onToggleSave && (
                <button
                  type="button"
                  onClick={() => onToggleSave(listing)}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-brand-text flex items-center justify-center shadow-soft-sm transition-all"
                  title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isSaved ? 'fill-red-500 text-red-500' : 'text-brand-muted'
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Location strip */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-white flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{listing.city}, {listing.state}</span>
            </div>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-brand-primary ring-2 ring-brand-primary/20 scale-105'
                      : 'border-brand-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta Specification Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-brand-bg/70 border border-brand-border text-xs">
          <div className="space-y-0.5">
            <span className="text-brand-muted flex items-center gap-1">
              <Tag className="w-3 h-3 text-brand-secondary" />
              Category
            </span>
            <strong className="text-brand-primary block">{listing.category}</strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-brand-muted flex items-center gap-1">
              <Layers className="w-3 h-3 text-brand-secondary" />
              Material
            </span>
            <strong className="text-brand-primary block">{listing.material}</strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-brand-muted flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-brand-secondary" />
              Condition
            </span>
            <strong className="text-brand-primary block">{listing.condition}</strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-brand-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-secondary" />
              Posted
            </span>
            <strong className="text-brand-primary block">{listing.createdAt}</strong>
          </div>
        </div>

        {/* Product Description */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-bold text-brand-muted tracking-wider">
            Product Description & Story
          </h4>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>

        {/* Seller Profile Information & Trust Banner */}
        <div className="p-4 rounded-xl bg-white border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={
                listing.sellerAvatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              fallbackType="avatar"
              alt={listing.sellerName}
              className="w-12 h-12 rounded-full object-cover border border-brand-border"
            />
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-sm text-brand-primary">
                  {listing.sellerName}
                </h5>
                <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                  Verified Neighbor
                </span>
              </div>
              <p className="text-xs text-brand-muted">
                Member since {listing.sellerJoinedDate || 'Nov 2026'} • Local in {listing.city}, {listing.state}
              </p>
            </div>
          </div>

          {/* Protected Contact Badge */}
          <div className="flex items-center gap-2 text-xs text-brand-muted bg-forest-50 px-3 py-2 rounded-lg border border-forest-100">
            <ShieldCheck className="w-4 h-4 text-brand-secondary shrink-0" />
            <span>Private inquiry protection active</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onOpenReport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenReport(listing)}
                leftIcon={<Flag className="w-3.5 h-3.5 text-red-500" />}
                className="text-xs text-brand-muted hover:text-red-700 hover:bg-red-50"
              >
                Report Listing
              </Button>
            )}

            {copiedLink && (
              <span className="text-xs text-emerald-700 font-medium">Link copied!</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* If Seller is viewing their own listing */}
            {isOwner ? (
              <>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(listing)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Edit Listing
                  </Button>
                )}
                {onStatusChange && listing.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(listing.id, 'completed')}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    className="text-xs text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                  >
                    Mark as Completed / Rehomed
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this listing?')) {
                        onDelete(listing.id);
                        onClose();
                      }
                    }}
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}
                    className="text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                )}
              </>
            ) : (
              /* Buyer Actions */
              <>
                {onOpenInquiry && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onOpenInquiry(listing)}
                    leftIcon={<MessageSquare className="w-4 h-4" />}
                    className="text-xs sm:text-sm"
                  >
                    {listing.listingType === 'Free Donation' && 'Request This Free Item'}
                    {listing.listingType === 'Product Exchange' && 'Propose a Trade Exchange'}
                    {listing.listingType === 'Sale' && 'Message Seller & Make Offer'}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
