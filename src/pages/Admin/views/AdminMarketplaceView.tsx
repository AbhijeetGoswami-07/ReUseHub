import React, { useState, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ConfirmActionModal } from '@/components/admin/ConfirmActionModal';
import { MarketplaceListing } from '@/types';
import {
  ShoppingBag,
  Search,
  Eye,
  Trash2,
  Tag,
  MapPin,
  User,
} from 'lucide-react';

export interface AdminMarketplaceViewProps {
  listings: MarketplaceListing[];
  onRemoveListing: (listingId: string, title: string, reason: string) => Promise<void>;
}

export const AdminMarketplaceView: React.FC<AdminMarketplaceViewProps> = ({
  listings,
  onRemoveListing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [inspectListing, setInspectListing] = useState<MarketplaceListing | null>(null);
  const [removeTarget, setRemoveTarget] = useState<MarketplaceListing | null>(null);
  const [removalReason, setRemovalReason] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const title = l.productName || l.title || '';
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'all' || l.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [listings, searchQuery, categoryFilter, statusFilter]);

  const handleConfirmRemove = async () => {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await onRemoveListing(
        removeTarget.id,
        removeTarget.productName || removeTarget.title || 'Marketplace Item',
        removalReason || 'Violation of circular marketplace quality guidelines'
      );
      setRemoveTarget(null);
      setRemovalReason('');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Marketplace Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
            Marketplace Listings ({listings.length})
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted">
            Monitor circular rehoming listings, audit prohibited goods, and remove inappropriate items.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="bordered" className="p-4 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search listings by title, seller, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-forest-50/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="clothing">Clothing</option>
              <option value="plastic">Plastic</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="metal">Metal</option>
              <option value="household items">Household Items</option>
              <option value="paper">Paper</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="reserved">Reserved</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Listings Table */}
      <Card variant="bordered" className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-50/60 border-b border-forest-100 text-forest-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Listing</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Type / Price</th>
                <th className="py-3 px-4">Seller</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-dark-muted">
                    No marketplace listings match your query.
                  </td>
                </tr>
              ) : (
                filteredListings.map((item) => {
                  const title = item.productName || item.title || 'Untitled Listing';
                  const isFree = item.isFree || item.price === 0;

                  return (
                    <tr key={item.id} className="hover:bg-forest-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-forest-100"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-forest-900 block truncate max-w-xs">
                              {title}
                            </span>
                            <span className="text-[11px] text-dark-subtle flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.city}, {item.state}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-dark-muted capitalize">{item.category}</td>
                      <td className="py-3 px-4 text-dark-muted capitalize">{item.condition}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFree
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          {isFree ? item.listingType : `$${item.price.toFixed(2)}`}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-forest-900">
                          <User className="w-3.5 h-3.5 text-forest-400" />
                          <span>{item.sellerName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            item.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-forest-50 text-forest-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] px-2 py-1 h-7 text-forest-700 hover:text-forest-900"
                            onClick={() => setInspectListing(item)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Inspect
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] px-2 py-1 h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setRemovalReason('');
                              setRemoveTarget(item);
                            }}
                            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Listing Modal */}
      {inspectListing && (
        <Modal
          isOpen={!!inspectListing}
          onClose={() => setInspectListing(null)}
          title="Marketplace Listing Review"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex gap-4">
              <ImageWithFallback
                src={inspectListing.imageUrl}
                alt=""
                className="w-32 h-32 rounded-2xl object-cover shrink-0 border border-forest-200"
              />
              <div className="space-y-1.5 min-w-0">
                <h3 className="text-base font-bold text-forest-900">
                  {inspectListing.productName || inspectListing.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-dark-muted">
                  <span>Category: {inspectListing.category}</span>
                  <span>•</span>
                  <span>Material: {inspectListing.material}</span>
                  <span>•</span>
                  <span>Condition: {inspectListing.condition}</span>
                </div>
                <div className="text-xs font-semibold text-emerald-800">
                  {inspectListing.isFree ? inspectListing.listingType : `$${inspectListing.price.toFixed(2)}`}
                </div>
                <div className="text-xs text-dark-subtle">
                  Seller: <strong>{inspectListing.sellerName}</strong> ({inspectListing.location || `${inspectListing.city}, ${inspectListing.state}`})
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-forest-900 uppercase">Product Description</span>
              <p className="text-xs text-dark-muted leading-relaxed bg-forest-50/40 p-3 rounded-xl border border-forest-100">
                {inspectListing.description}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  setRemoveTarget(inspectListing);
                  setInspectListing(null);
                }}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Remove Inappropriate Listing
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Destructive Removal Confirmation Dialog */}
      <ConfirmActionModal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleConfirmRemove}
        isLoading={isRemoving}
        title="Remove Inappropriate Listing"
        description={`Are you sure you want to remove "${removeTarget?.productName || removeTarget?.title}" from the marketplace? This action is recorded in the administrative audit log.`}
        confirmLabel="Remove Listing"
        isDestructive={true}
        additionalInput={
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forest-900">
              Administrative Removal Reason (Recorded in Audit Trail)
            </label>
            <textarea
              value={removalReason}
              onChange={(e) => setRemovalReason(e.target.value)}
              placeholder="e.g. Prohibited hazardous material, copyright infringement, commercial spam..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
              required
            />
          </div>
        }
      />
    </div>
  );
};
