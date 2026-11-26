import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { CardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SpotlightCard } from '@/components/common/SpotlightCard';
import { useAuth } from '@/contexts/AuthContext';
import {
  MarketplaceListing,
  MarketplaceListingType,
  ProductCategory,
  ProductCondition,
} from '@/types';
import {
  getMarketplaceListings,
  createMarketplaceListing,
  updateMarketplaceListing,
  deleteMarketplaceListing,
  getSavedListingIds,
  toggleSaveListing,
  submitMarketplaceInquiry,
  submitListingReport,
} from '@/services/marketplaceService';
import { ListingFormModal } from '@/components/marketplace/ListingFormModal';
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal';
import { InquiryModal } from '@/components/marketplace/InquiryModal';
import { ReportModal } from '@/components/marketplace/ReportModal';
import {
  Store,
  Plus,
  MapPin,
  Search,
  Heart,
  MessageSquare,
  Repeat,
  Gift,
  DollarSign,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  User,
  Edit3,
  Trash2,
} from 'lucide-react';

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

export const MarketplacePage: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active view tab: 'all' | 'my_listings' | 'saved'
  const activeTab = (searchParams.get('tab') as 'all' | 'my_listings' | 'saved') || 'all';

  // Filters from URL or default
  const selectedCategory = (searchParams.get('category') as ProductCategory | 'All') || 'All';
  const selectedCondition = (searchParams.get('condition') as ProductCondition | 'All') || 'All';
  const selectedType = (searchParams.get('type') as MarketplaceListingType | 'All') || 'All';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('loc') || '');

  // Listings data & saved favorites
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(searchParams.get('new') === 'true');
  const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);
  const [detailListing, setDetailListing] = useState<MarketplaceListing | null>(null);
  const [inquiryListing, setInquiryListing] = useState<MarketplaceListing | null>(null);
  const [reportListing, setReportListing] = useState<MarketplaceListing | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load listings & favorites
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMarketplaceListings();
      setListings(data);
      setSavedIds(getSavedListingIds());
    } catch (err) {
      console.error('Failed to load marketplace listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update URL params helper
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (!val || val === 'All') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleTabChange = (tab: 'all' | 'my_listings' | 'saved') => {
    updateParams({ tab: tab === 'all' ? null : tab });
  };

  const handleCategoryChange = (cat: ProductCategory | 'All') => {
    updateParams({ category: cat });
  };

  const handleConditionChange = (cond: ProductCondition | 'All') => {
    updateParams({ condition: cond });
  };

  const handleTypeChange = (type: MarketplaceListingType | 'All') => {
    updateParams({ type });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateParams({ q: val.trim() || null });
  };

  const handleLocationChange = (val: string) => {
    setLocationQuery(val);
    updateParams({ loc: val.trim() || null });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSearchParams({}, { replace: true });
  };

  // Toggle Save favorite
  const handleToggleSave = async (listing: MarketplaceListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const result = await toggleSaveListing(listing.id, user?.id);
    const updated = getSavedListingIds();
    setSavedIds(updated);

    const name = listing.productName || listing.title;
    setToastMessage(
      result.isSaved ? `Added "${name}" to your saved listings` : `Removed "${name}" from saved listings`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Create Listing Submit
  const handleCreateListingSubmit = async (data: any) => {
    const created = await createMarketplaceListing(data, {
      id: user?.id || 'demo-user-id',
      fullName: profile?.fullName || user?.email?.split('@')[0] || 'Community Member',
      avatarUrl: profile?.avatarUrl,
      email: user?.email,
    });
    setListings((prev) => [created, ...prev]);
    setIsCreateOpen(false);
    setToastMessage(`Published "${created.productName}" to the marketplace!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Edit Listing Submit
  const handleEditListingSubmit = async (data: any) => {
    if (!editingListing) return;
    const updated = await updateMarketplaceListing(editingListing.id, data, user?.id);
    setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (detailListing?.id === updated.id) {
      setDetailListing(updated);
    }
    setEditingListing(null);
    setToastMessage(`Updated "${updated.productName}" successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete Listing
  const handleDeleteListing = async (id: string) => {
    try {
      await deleteMarketplaceListing(id, user?.id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      if (detailListing?.id === id) setDetailListing(null);
      setToastMessage('Listing deleted successfully.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing.');
    }
  };

  // Status Change (active -> completed/rehomed)
  const handleStatusChange = async (id: string, status: 'active' | 'reserved' | 'completed') => {
    try {
      const updated = await updateMarketplaceListing(id, { status }, user?.id);
      setListings((prev) => prev.map((l) => (l.id === id ? updated : l)));
      if (detailListing?.id === id) setDetailListing(updated);
      setToastMessage(`Listing status changed to ${status}.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Submit Inquiry
  const handleInquirySubmit = async (data: any) => {
    await submitMarketplaceInquiry(data, user?.id);
    setToastMessage(`Inquiry sent to ${inquiryListing?.sellerName}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submit Report
  const handleReportSubmit = async (data: any) => {
    await submitListingReport(data, user?.id);
    setToastMessage('Report submitted to safety moderators. Thank you!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter listings based on active tab and filter controls
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Tab filters
      if (activeTab === 'saved') {
        if (!savedIds.includes(item.id)) return false;
      } else if (activeTab === 'my_listings') {
        const myId = user?.id || 'demo-user-id';
        if (item.sellerId !== myId) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Condition filter
      if (selectedCondition !== 'All' && item.condition !== selectedCondition) {
        return false;
      }

      // 4. Listing Type filter
      if (selectedType !== 'All' && item.listingType !== selectedType) {
        return false;
      }

      // 5. Location Search filter (City/State)
      if (locationQuery.trim()) {
        const lq = locationQuery.toLowerCase().trim();
        const matchCity = item.city.toLowerCase().includes(lq);
        const matchState = item.state.toLowerCase().includes(lq);
        const matchLoc = (item.location || '').toLowerCase().includes(lq);
        if (!matchCity && !matchState && !matchLoc) return false;
      }

      // 6. Search Query (Name, Description, Material)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (item.productName || item.title || '').toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchMat = (item.material || '').toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchMat) return false;
      }

      return true;
    });
  }, [
    listings,
    activeTab,
    savedIds,
    user?.id,
    selectedCategory,
    selectedCondition,
    selectedType,
    locationQuery,
    searchQuery,
  ]);

  const myListingsCount = useMemo(() => {
    const myId = user?.id || 'demo-user-id';
    return listings.filter((l) => l.sellerId === myId).length;
  }, [listings, user?.id]);

  const listingTypeBadgeStyle: Record<string, { bg: string; text: string; border: string }> = {
    'Free Donation': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Product Exchange': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Sale: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  };

  return (
    <div className="py-8 sm:py-12 bg-brand-bg min-h-screen">
      <Container size="xl">
        {/* Editorial Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/80 mb-8">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-brand-primary">Circular Marketplace</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/analyzer">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-secondary" />}
                className="text-xs bg-white border-brand-border"
              >
                Analyze a Product
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Post a Product
            </Button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-semibold tracking-wide uppercase">
              <Store className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Second-Hand Circular Economy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight leading-tight">
              Community Reuse Marketplace
            </h1>

            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Connect directly with students, neighbors, and local makers to donate usable items, trade materials, or sell repairable goods.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-brand-border shadow-soft-xs text-center min-w-[110px]">
              <div className="text-xl font-bold font-display text-brand-primary">
                {listings.length}
              </div>
              <div className="text-[11px] text-brand-muted font-medium">Active Items</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-brand-border shadow-soft-xs text-center min-w-[110px]">
              <div className="text-xl font-bold font-display text-emerald-700">
                {listings.filter((l) => l.listingType === 'Free Donation').length}
              </div>
              <div className="text-[11px] text-emerald-800 font-medium">Free Donations</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-brand-border shadow-soft-xs text-center min-w-[110px]">
              <div className="text-xl font-bold font-display text-blue-700">
                {listings.filter((l) => l.listingType === 'Product Exchange').length}
              </div>
              <div className="text-[11px] text-blue-800 font-medium">Product Trades</div>
            </div>
          </div>
        </div>

        {/* View Tabs Bar: All Listings, My Listings, Saved Listings */}
        <div className="flex items-center gap-2 mb-6 border-b border-brand-border">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>All Listings ({listings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('my_listings')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'my_listings'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Listings ({myListingsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('saved')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Heart className="w-4 h-4 text-red-500" />
            <span>Saved Favorites ({savedIds.length})</span>
          </button>
        </div>

        {/* Search & Comprehensive Filters Panel */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-border shadow-soft-sm mb-8 space-y-4">
          {/* Top Row: Search by Product Name + Search by Location */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Product */}
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search products by name, description, material (e.g. desk, keyboard, planters, denim)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-3 text-brand-muted hover:text-brand-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location Filter */}
            <div className="md:col-span-5 relative">
              <MapPin className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Filter by city or state (e.g. Seattle, CA, Austin)..."
                value={locationQuery}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
              />
              {locationQuery && (
                <button
                  type="button"
                  onClick={() => handleLocationChange('')}
                  className="absolute right-3 top-3 text-brand-muted hover:text-brand-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips: Listing Type */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border/60 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-brand-text mr-1">Listing Type:</span>
              <button
                type="button"
                onClick={() => handleTypeChange('All')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedType === 'All'
                    ? 'bg-brand-primary text-white shadow-soft-xs font-semibold'
                    : 'bg-brand-bg text-brand-text border border-brand-border hover:bg-forest-50'
                }`}
              >
                All Types
              </button>
              {LISTING_TYPES.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-primary text-white shadow-soft-xs font-semibold'
                        : 'bg-brand-bg text-brand-text border border-brand-border hover:bg-forest-50'
                    }`}
                  >
                    {type === 'Free Donation' && <Gift className="w-3 h-3 text-emerald-500" />}
                    {type === 'Product Exchange' && <Repeat className="w-3 h-3 text-blue-500" />}
                    {type === 'Sale' && <DollarSign className="w-3 h-3 text-amber-500" />}
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>

            {/* Condition Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-brand-text mr-1">Condition:</span>
              <button
                type="button"
                onClick={() => handleConditionChange('All')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedCondition === 'All'
                    ? 'bg-brand-secondary text-white font-semibold'
                    : 'bg-brand-bg text-brand-muted hover:text-brand-text'
                }`}
              >
                All
              </button>
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => handleConditionChange(cond)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    selectedCondition === cond
                      ? 'bg-brand-secondary text-white font-semibold'
                      : 'bg-brand-bg text-brand-muted hover:text-brand-text'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-brand-border/60 text-xs">
            <span className="font-semibold text-brand-text mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-brand-secondary" />
              Category:
            </span>
            <button
              type="button"
              onClick={() => handleCategoryChange('All')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedCategory === 'All'
                  ? 'bg-brand-secondary text-white font-semibold'
                  : 'bg-brand-bg text-brand-muted hover:text-brand-text'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-secondary text-white font-semibold'
                    : 'bg-brand-bg text-brand-muted hover:text-brand-text'
                }`}
              >
                {cat}
              </button>
            ))}

            {(selectedCategory !== 'All' ||
              selectedCondition !== 'All' ||
              selectedType !== 'All' ||
              searchQuery ||
              locationQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="ml-auto text-xs text-brand-muted hover:text-brand-primary"
              >
                Reset All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isSaved = savedIds.includes(listing.id);
              const isOwner = Boolean(
                user?.id && (listing.sellerId === user.id || listing.sellerId === 'demo-user-id')
              );

              return (
                <SpotlightCard
                  key={listing.id}
                  spotlightColor="rgba(46, 125, 79, 0.12)"
                  className="bg-white flex flex-col justify-between overflow-hidden group border-brand-border p-0 rounded-2xl shadow-soft-xs hover:shadow-soft-md transition-all duration-300"
                >
                  {/* Image & Badges */}
                  <div
                    className="relative aspect-video w-full overflow-hidden bg-forest-50 cursor-pointer"
                    onClick={() => setDetailListing(listing)}
                  >
                    <ImageWithFallback
                      src={listing.imageUrl}
                      alt={listing.productName || listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Listing Type & Price Pill */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-soft-xs backdrop-blur-sm ${
                          listingTypeBadgeStyle[listing.listingType]?.bg || 'bg-white'
                        } ${listingTypeBadgeStyle[listing.listingType]?.text || 'text-brand-primary'} ${
                          listingTypeBadgeStyle[listing.listingType]?.border || 'border-brand-border'
                        }`}
                      >
                        {listing.listingType === 'Sale'
                          ? `$${listing.price.toFixed(2)}`
                          : listing.listingType}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-white/90 text-brand-text text-[11px] font-semibold border border-brand-border backdrop-blur-sm">
                        {listing.condition}
                      </span>
                    </div>

                    {/* Bookmark Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(listing, e)}
                      aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-brand-text flex items-center justify-center shadow-soft-sm transition-all"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isSaved ? 'fill-red-500 text-red-500' : 'text-brand-muted hover:text-red-500'
                        }`}
                      />
                    </button>

                    {/* Location Pill on Image Bottom */}
                    <div className="absolute bottom-2.5 left-3 text-[11px] text-white flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{listing.city}, {listing.state}</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-brand-muted">
                        <span className="font-medium text-brand-secondary">{listing.category}</span>
                        <span>{listing.material}</span>
                      </div>

                      <h3
                        onClick={() => setDetailListing(listing)}
                        className="font-display font-bold text-base sm:text-lg text-brand-primary leading-snug group-hover:text-brand-secondary transition-colors line-clamp-1 cursor-pointer"
                      >
                        {listing.productName || listing.title}
                      </h3>

                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>
                    </div>

                    {/* Seller row */}
                    <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageWithFallback
                          src={
                            listing.sellerAvatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                          }
                          fallbackType="avatar"
                          alt={listing.sellerName}
                          className="w-6 h-6 rounded-full object-cover border border-brand-border"
                        />
                        <span className="text-xs text-brand-muted truncate max-w-[120px]">
                          {listing.sellerName}
                        </span>
                      </div>

                      <span className="text-[11px] text-brand-muted">{listing.createdAt}</span>
                    </div>

                    {/* Actions row */}
                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setDetailListing(listing)}
                        className="flex-1 text-xs"
                      >
                        View Details
                      </Button>

                      {isOwner ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingListing(listing)}
                            className="px-2.5 text-xs border-brand-border"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-brand-secondary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm('Delete this listing?')) {
                                handleDeleteListing(listing.id);
                              }
                            }}
                            className="px-2.5 text-xs text-red-600 hover:bg-red-50"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInquiryListing(listing)}
                          leftIcon={<MessageSquare className="w-3.5 h-3.5 text-brand-secondary" />}
                          className="text-xs border-brand-border bg-white text-brand-text hover:bg-brand-bg"
                        >
                          Inquire
                        </Button>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-soft-sm text-center">
            <EmptyState
              icon={Store}
              title={
                activeTab === 'saved'
                  ? 'No saved favorites found'
                  : activeTab === 'my_listings'
                  ? 'You have not posted any listings yet'
                  : 'No marketplace items match your search'
              }
              description={
                activeTab === 'saved'
                  ? 'Explore our marketplace and click the heart icon on items you would like to keep track of.'
                  : activeTab === 'my_listings'
                  ? 'Have unwanted usable goods, spare materials, or electronics? Give them a second life by posting a listing.'
                  : `We could not find items matching your search criteria. Try broadening your keywords or resetting filters.`
              }
              primaryAction={{
                label: activeTab === 'my_listings' ? 'Post a New Listing' : 'Reset Filters',
                onClick: activeTab === 'my_listings' ? () => setIsCreateOpen(true) : handleResetFilters,
              }}
            />
          </div>
        )}
      </Container>

      {/* 1. Create Listing Modal */}
      <ListingFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateListingSubmit}
        mode="create"
      />

      {/* 2. Edit Listing Modal */}
      {editingListing && (
        <ListingFormModal
          isOpen={Boolean(editingListing)}
          onClose={() => setEditingListing(null)}
          onSubmit={handleEditListingSubmit}
          initialData={editingListing}
          mode="edit"
        />
      )}

      {/* 3. Product Detail Modal */}
      {detailListing && (
        <ProductDetailModal
          isOpen={Boolean(detailListing)}
          onClose={() => setDetailListing(null)}
          listing={detailListing}
          currentUserId={user?.id || 'demo-user-id'}
          isSaved={savedIds.includes(detailListing.id)}
          onToggleSave={handleToggleSave}
          onOpenInquiry={(item) => setInquiryListing(item)}
          onOpenReport={(item) => setReportListing(item)}
          onEdit={(item) => setEditingListing(item)}
          onDelete={handleDeleteListing}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* 4. Inquiry Modal */}
      {inquiryListing && (
        <InquiryModal
          isOpen={Boolean(inquiryListing)}
          onClose={() => setInquiryListing(null)}
          listing={inquiryListing}
          onSubmit={handleInquirySubmit}
          defaultBuyer={{
            name: profile?.fullName || user?.email?.split('@')[0] || '',
            email: user?.email || '',
          }}
        />
      )}

      {/* 5. Report Modal */}
      {reportListing && (
        <ReportModal
          isOpen={Boolean(reportListing)}
          onClose={() => setReportListing(null)}
          listing={reportListing}
          onSubmit={handleReportSubmit}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-primary text-white px-4 py-3 rounded-xl shadow-soft-lg flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
