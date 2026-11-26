import React from 'react';
import { cn } from '@/utils/cn';
import { MarketplaceListing } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MapPin, ArrowUpRight } from 'lucide-react';

export interface ProductCardProps {
  listing: MarketplaceListing;
  onContact?: (listing: MarketplaceListing) => void;
  onViewDetails?: (listing: MarketplaceListing) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  listing,
  onContact,
  onViewDetails,
  className,
}) => {
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border border-brand-border bg-white',
        'transition-all duration-200 ease-out hover:border-brand-secondary/60 hover:shadow-soft-sm',
        'overflow-hidden',
        className
      )}
    >
      <div>
        {/* Image Frame */}
        <div className="relative h-44 sm:h-48 w-full bg-forest-50 overflow-hidden">
          <ImageWithFallback
            src={listing.imageUrl}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />

          {/* Action Badge Overlaid */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <StatusBadge status={listing.actionRecommendation || 'reuse'} size="sm" />
          </div>

          {/* Price Pill */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold shadow-soft-xs backdrop-blur-sm',
                listing.isFree
                  ? 'bg-emerald-700/90 text-white'
                  : 'bg-brand-primary/90 text-white'
              )}
            >
              {listing.isFree ? 'Free Handoff' : `$${listing.price}`}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-2 text-left">
          <div className="flex items-center justify-between text-[11px] text-brand-muted">
            <span className="font-semibold uppercase tracking-wider text-forest-700">
              {listing.category.replace('_', ' ')}
            </span>
            <span className="capitalize">{listing.condition.replace('_', ' ')}</span>
          </div>

          <h3
            onClick={() => onViewDetails?.(listing)}
            className="font-display font-bold text-brand-text text-base leading-snug line-clamp-1 group-hover:text-brand-primary cursor-pointer transition-colors"
          >
            {listing.title}
          </h3>

          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          <div className="pt-2 flex items-center justify-between text-[11px] text-brand-muted border-t border-brand-border/60">
            <span className="flex items-center gap-1 truncate max-w-[170px]">
              <MapPin className="w-3 h-3 text-brand-secondary shrink-0" />
              <span className="truncate">{listing.location}</span>
            </span>
            <span className="shrink-0">{listing.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onViewDetails?.(listing)}
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          Details
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onContact?.(listing)}
        >
          {listing.isFree ? 'Request Item' : 'Contact Seller'}
        </Button>
      </div>
    </div>
  );
};
