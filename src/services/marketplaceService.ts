import {
  MarketplaceListing,
  MarketplaceListingType,
  MarketplaceInquiry,
  ListingReport,
  ProductCategory,
  ProductCondition,
  ProductMaterial,
} from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

export interface MarketplaceFilters {
  searchQuery?: string;
  category?: ProductCategory | 'All';
  condition?: ProductCondition | 'All';
  listingType?: MarketplaceListingType | 'All';
  locationQuery?: string;
  savedOnly?: boolean;
  myListingsOnly?: boolean;
  userId?: string;
}

export interface CreateListingInput {
  productName: string;
  description: string;
  category: ProductCategory;
  material: ProductMaterial;
  condition: ProductCondition;
  images: string[];
  listingType: MarketplaceListingType;
  price?: number;
  city: string;
  state: string;
}

export interface CreateInquiryInput {
  listingId: string;
  listingTitle: string;
  sellerId: string;
  buyerName: string;
  buyerEmail: string;
  message: string;
  inquiryType: 'question' | 'offer' | 'pickup_request';
  proposedPrice?: number;
}

export interface CreateReportInput {
  listingId: string;
  listingTitle: string;
  reason: 'hazardous_material' | 'fraud_scam' | 'prohibited_item' | 'inaccurate_description' | 'other';
  details: string;
  reporterEmail?: string;
}

// Initial seed listings matching migration schema
export const INITIAL_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'list-seed-1',
    productName: 'Solid Pine Study Desk & Drawer Organizer',
    title: 'Solid Pine Study Desk & Drawer Organizer',
    description: 'Sturdy solid pine wood desk with two smooth-sliding side drawers. Clean structural condition with minor cosmetic lacquer wear on the tabletop, easily refreshed with light sanding or mineral oil. Great for students or home office.',
    category: 'Furniture',
    material: 'Wood',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    listingType: 'Free Donation',
    price: 0,
    isFree: true,
    city: 'Seattle',
    state: 'WA',
    location: 'Seattle, WA',
    sellerId: 'user-elena',
    sellerName: 'Elena Rostova',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerJoinedDate: 'Oct 2025',
    status: 'active',
    createdAt: '2 hours ago',
    viewsCount: 42,
  },
  {
    id: 'list-seed-2',
    productName: 'Tactile Mechanical Keyboard (Needs USB-C Solder)',
    title: 'Tactile Mechanical Keyboard (Needs USB-C Solder)',
    description: 'Keychron tenkeyless mechanical keyboard featuring tactile brown switches and double-shot PBT keycaps. Keyboard is fully functional, but the female USB-C daughterboard socket has a loose joint and needs a 5-minute re-solder. Looking to trade for studio cables or audio accessories.',
    category: 'Electronics',
    material: 'Electronic Components',
    condition: 'Needs Repair',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    listingType: 'Product Exchange',
    price: 0,
    isFree: true,
    city: 'San Francisco',
    state: 'CA',
    location: 'San Francisco, CA',
    sellerId: 'user-marcus',
    sellerName: 'Marcus Chen',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerJoinedDate: 'Jan 2026',
    status: 'active',
    createdAt: '5 hours ago',
    viewsCount: 68,
  },
  {
    id: 'list-seed-3',
    productName: 'Handmade Terracotta & Ceramic Planters (Set of 4)',
    title: 'Handmade Terracotta & Ceramic Planters (Set of 4)',
    description: 'Four clean terracotta and glazed stoneware plant pots ranging from 6 to 10 inches in diameter. All have baseline drainage holes and matching catch saucers. Perfect for balcony herb gardens, monsteras, or succulent arrangements.',
    category: 'Household Items',
    material: 'Glass',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    listingType: 'Sale',
    price: 18.0,
    isFree: false,
    city: 'Portland',
    state: 'OR',
    location: 'Portland, OR',
    sellerId: 'user-sarah',
    sellerName: 'Sarah Jenkins',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    sellerJoinedDate: 'Feb 2026',
    status: 'active',
    createdAt: '1 day ago',
    viewsCount: 114,
  },
  {
    id: 'list-seed-4',
    productName: 'Reclaimed Heavy Denim Fabric Rolls (6kg Craft Scraps)',
    title: 'Reclaimed Heavy Denim Fabric Rolls (6kg Craft Scraps)',
    description: 'Assorted bundles of clean 100% cotton denim fabric offcuts, selvedge strips, and leg remnants. Ideal for sewing rugged market tote bags, patchwork quilts, work aprons, or upholstery cushion covers. Offered completely free to local craft students.',
    category: 'Clothing',
    material: 'Cotton',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    listingType: 'Free Donation',
    price: 0,
    isFree: true,
    city: 'Austin',
    state: 'TX',
    location: 'Austin, TX',
    sellerId: 'user-liam',
    sellerName: 'Liam O\'Connor',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerJoinedDate: 'Mar 2026',
    status: 'active',
    createdAt: '2 days ago',
    viewsCount: 89,
  },
  {
    id: 'list-seed-5',
    productName: 'Vintage Steel Frame Road Bicycle (Needs Inner Tubes)',
    title: 'Vintage Steel Frame Road Bicycle (Needs Inner Tubes)',
    description: 'Classic 10-speed steel frame commuter bicycle. Frame and gear cables in sound mechanical order. Needs new 700c inner tubes and handlebar grip tape. Willing to sell affordably or trade for woodworking hand tools.',
    category: 'Metal',
    material: 'Metal',
    condition: 'Needs Repair',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    listingType: 'Sale',
    price: 35.0,
    isFree: false,
    city: 'Denver',
    state: 'CO',
    location: 'Denver, CO',
    sellerId: 'user-maya',
    sellerName: 'Maya Patel',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    sellerJoinedDate: 'Dec 2025',
    status: 'active',
    createdAt: '3 days ago',
    viewsCount: 156,
  },
  {
    id: 'list-seed-6',
    productName: 'Heavy Corrugated Storage Boxes & Bubble Wrap (25-Pack)',
    title: 'Heavy Corrugated Storage Boxes & Bubble Wrap (25-Pack)',
    description: 'Double-walled corrugated delivery boxes folded flat and pristine bubble wrap surplus from a recent studio relocation. Stored dry and clean. Ready for someone preparing for a home move or small business shipping.',
    category: 'Paper',
    material: 'Paper',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    listingType: 'Product Exchange',
    price: 0,
    isFree: true,
    city: 'Chicago',
    state: 'IL',
    location: 'Chicago, IL',
    sellerId: 'user-david',
    sellerName: 'David Kim',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    sellerJoinedDate: 'Apr 2026',
    status: 'active',
    createdAt: '4 days ago',
    viewsCount: 73,
  },
];

const LOCAL_STORAGE_LISTINGS_KEY = 'reusehub_marketplace_custom_listings';
const LOCAL_STORAGE_SAVED_KEY = 'reusehub_marketplace_saved_listings';
const LOCAL_STORAGE_INQUIRIES_KEY = 'reusehub_marketplace_inquiries';
const LOCAL_STORAGE_REPORTS_KEY = 'reusehub_marketplace_reports';

/**
 * Get all stored local custom listings
 */
function getLocalCustomListings(): MarketplaceListing[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LISTINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save custom listings to localStorage
 */
function saveLocalCustomListings(listings: MarketplaceListing[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LISTINGS_KEY, JSON.stringify(listings));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
}

/**
 * Fetch marketplace listings (Supabase with localStorage fallback)
 */
export async function getMarketplaceListings(filters?: MarketplaceFilters): Promise<MarketplaceListing[]> {
  let allListings: MarketplaceListing[] = [];

  // 1. Try Supabase
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('product_listings')
        .select('*')
        .neq('status', 'removed')
        .order('created_at', { ascending: false });

      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }
      if (filters?.condition && filters.condition !== 'All') {
        query = query.eq('condition', filters.condition);
      }
      if (filters?.listingType && filters.listingType !== 'All') {
        query = query.eq('listing_type', filters.listingType);
      }
      if (filters?.myListingsOnly && filters.userId) {
        query = query.eq('seller_id', filters.userId);
      }

      let { data, error } = await query;

      // Fallback to legacy marketplace_listings if product_listings is missing
      if (error && error.code === '42P01') {
        const fallbackRes = await supabase
          .from('marketplace_listings')
          .select('*')
          .neq('status', 'removed')
          .order('created_at', { ascending: false });
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (!error && data) {
        // Authoritative production data: return live records directly without forcing sample data
        return data.map((item: any) => ({
          id: item.id,
          productName: item.product_name,
          title: item.product_name,
          description: item.description,
          category: item.category as ProductCategory,
          material: item.material as ProductMaterial,
          condition: item.condition as ProductCondition,
          images: item.images && item.images.length > 0 ? item.images : [item.image_url],
          imageUrl: item.image_url,
          listingType: item.listing_type as MarketplaceListingType,
          price: Number(item.price) || 0,
          isFree: item.listing_type === 'Free Donation' || Number(item.price) === 0,
          city: item.city,
          state: item.state,
          location: `${item.city}, ${item.state}`,
          sellerId: item.seller_id,
          sellerName: item.seller_name,
          sellerAvatar: item.seller_avatar,
          sellerJoinedDate: item.seller_joined_date || 'Nov 2026',
          status: item.status as 'active' | 'reserved' | 'completed',
          createdAt: new Date(item.created_at).toLocaleDateString(),
          viewsCount: item.views_count || 0,
        }));
      }
    } catch (err) {
      console.warn('Supabase marketplace query note:', err);
    }
  }

  // 2. Offline / Demo fallback
  const custom = getLocalCustomListings();
  allListings = [...custom, ...INITIAL_MARKETPLACE_LISTINGS];

  // Apply in-memory client filtering for robust instant filtering
  return allListings.filter((item) => {
    // Category
    if (filters?.category && filters.category !== 'All' && item.category !== filters.category) {
      return false;
    }
    // Condition
    if (filters?.condition && filters.condition !== 'All' && item.condition !== filters.condition) {
      return false;
    }
    // Listing Type
    if (filters?.listingType && filters.listingType !== 'All' && item.listingType !== filters.listingType) {
      return false;
    }
    // Location Filter (Search by City or State)
    if (filters?.locationQuery && filters.locationQuery.trim()) {
      const locQ = filters.locationQuery.toLowerCase().trim();
      const matchCity = item.city.toLowerCase().includes(locQ);
      const matchState = item.state.toLowerCase().includes(locQ);
      const matchFullLoc = (item.location || '').toLowerCase().includes(locQ);
      if (!matchCity && !matchState && !matchFullLoc) return false;
    }
    // Search by product name or description
    if (filters?.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = item.productName.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchMat = item.material.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchMat) return false;
    }
    // My Listings Filter
    if (filters?.myListingsOnly && filters.userId) {
      if (item.sellerId !== filters.userId) return false;
    }
    // Saved Only Filter
    if (filters?.savedOnly) {
      const savedIds = getSavedListingIds();
      if (!savedIds.includes(item.id)) return false;
    }

    return true;
  });
}

/**
 * Fetch a single listing by ID
 */
export async function getListingById(id: string): Promise<MarketplaceListing | null> {
  const all = await getMarketplaceListings();
  return all.find((item) => item.id === id) || null;
}

/**
 * Create a new marketplace listing
 */
export async function createMarketplaceListing(
  input: CreateListingInput,
  user?: { id: string; fullName: string; avatarUrl?: string; email?: string }
): Promise<MarketplaceListing> {
  const primaryImage = input.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
  const price = input.listingType === 'Sale' ? Number(input.price) || 0 : 0;
  const isFree = input.listingType === 'Free Donation' || price === 0;

  const newListing: MarketplaceListing = {
    id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    productName: input.productName,
    title: input.productName,
    description: input.description,
    category: input.category,
    material: input.material,
    condition: input.condition,
    images: input.images.length > 0 ? input.images : [primaryImage],
    imageUrl: primaryImage,
    listingType: input.listingType,
    price,
    isFree,
    city: input.city,
    state: input.state,
    location: `${input.city}, ${input.state}`,
    sellerId: user?.id || 'demo-user-id',
    sellerName: user?.fullName || 'Current User',
    sellerAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerJoinedDate: 'Nov 2026',
    status: 'active',
    createdAt: 'Just now',
    viewsCount: 1,
  };

  // 1. Try Supabase
  if (isSupabaseConfigured && user?.id) {
    try {
      let { data, error } = await supabase
        .from('product_listings')
        .insert({
          product_name: newListing.productName,
          description: newListing.description,
          category: newListing.category,
          material: newListing.material,
          condition: newListing.condition,
          images: newListing.images,
          image_url: newListing.imageUrl,
          listing_type: newListing.listingType,
          price: newListing.price,
          city: newListing.city,
          state: newListing.state,
          seller_id: user.id,
          seller_name: newListing.sellerName,
          seller_avatar: newListing.sellerAvatar,
          status: 'active',
        })
        .select()
        .single();

      if (error && error.code === '42P01') {
        const fallbackRes = await supabase
          .from('marketplace_listings')
          .insert({
            product_name: newListing.productName,
            description: newListing.description,
            category: newListing.category,
            material: newListing.material,
            condition: newListing.condition,
            images: newListing.images,
            image_url: newListing.imageUrl,
            listing_type: newListing.listingType,
            price: newListing.price,
            city: newListing.city,
            state: newListing.state,
            seller_id: user.id,
            seller_name: newListing.sellerName,
            seller_avatar: newListing.sellerAvatar,
            status: 'active',
          })
          .select()
          .single();
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (!error && data) {
        newListing.id = data.id;
      }
    } catch (err) {
      console.warn('Supabase listing insert note, saving locally:', err);
    }
  }

  // 2. Persist to local custom listings
  const custom = getLocalCustomListings();
  saveLocalCustomListings([newListing, ...custom]);

  return newListing;
}

/**
 * Update an existing listing (Security: ensures user is owner)
 */
export async function updateMarketplaceListing(
  id: string,
  updates: Partial<CreateListingInput> & { status?: 'active' | 'reserved' | 'completed' },
  currentUserId?: string
): Promise<MarketplaceListing> {
  const custom = getLocalCustomListings();
  const existingIdx = custom.findIndex((item) => item.id === id);

  let targetListing: MarketplaceListing | null = null;
  if (existingIdx !== -1) {
    targetListing = custom[existingIdx];
  } else {
    targetListing = INITIAL_MARKETPLACE_LISTINGS.find((i) => i.id === id) || null;
  }

  if (!targetListing) {
    throw new Error('Listing not found');
  }

  // Security check: Only seller can update
  if (currentUserId && targetListing.sellerId !== currentUserId && targetListing.sellerId !== 'demo-user-id') {
    throw new Error('Unauthorized: You can edit only your own listings.');
  }

  const updatedPrice = updates.listingType === 'Sale' ? Number(updates.price ?? targetListing.price) : 0;
  const updatedImages = updates.images && updates.images.length > 0 ? updates.images : targetListing.images;
  const updatedPrimaryImage = updatedImages[0] || targetListing.imageUrl;

  const updatedListing: MarketplaceListing = {
    ...targetListing,
    productName: updates.productName ?? targetListing.productName,
    title: updates.productName ?? targetListing.productName,
    description: updates.description ?? targetListing.description,
    category: updates.category ?? targetListing.category,
    material: updates.material ?? targetListing.material,
    condition: updates.condition ?? targetListing.condition,
    listingType: updates.listingType ?? targetListing.listingType,
    price: updatedPrice,
    isFree: (updates.listingType ?? targetListing.listingType) === 'Free Donation' || updatedPrice === 0,
    city: updates.city ?? targetListing.city,
    state: updates.state ?? targetListing.state,
    location: `${updates.city ?? targetListing.city}, ${updates.state ?? targetListing.state}`,
    images: updatedImages,
    imageUrl: updatedPrimaryImage,
    status: updates.status ?? targetListing.status,
  };

  // 1. Try Supabase update
  if (isSupabaseConfigured && currentUserId) {
    try {
      await supabase
        .from('marketplace_listings')
        .update({
          product_name: updatedListing.productName,
          description: updatedListing.description,
          category: updatedListing.category,
          material: updatedListing.material,
          condition: updatedListing.condition,
          listing_type: updatedListing.listingType,
          price: updatedListing.price,
          city: updatedListing.city,
          state: updatedListing.state,
          images: updatedListing.images,
          image_url: updatedListing.imageUrl,
          status: updatedListing.status,
        })
        .eq('id', id)
        .eq('seller_id', currentUserId);
    } catch (err) {
      console.warn('Supabase update listing note:', err);
    }
  }

  // 2. Update local custom list
  if (existingIdx !== -1) {
    custom[existingIdx] = updatedListing;
    saveLocalCustomListings(custom);
  } else {
    // If it was a seed item being edited in demo mode, prepend to custom
    saveLocalCustomListings([updatedListing, ...custom]);
  }

  return updatedListing;
}

/**
 * Delete a listing (Security: user must be the seller)
 */
export async function deleteMarketplaceListing(id: string, currentUserId?: string): Promise<boolean> {
  const custom = getLocalCustomListings();
  const existing = custom.find((item) => item.id === id) || INITIAL_MARKETPLACE_LISTINGS.find((i) => i.id === id);

  if (existing && currentUserId && existing.sellerId !== currentUserId && existing.sellerId !== 'demo-user-id') {
    throw new Error('Unauthorized: You can delete only your own listings.');
  }

  if (isSupabaseConfigured && currentUserId) {
    try {
      await supabase
        .from('marketplace_listings')
        .delete()
        .eq('id', id)
        .eq('seller_id', currentUserId);
    } catch (err) {
      console.warn('Supabase delete listing note:', err);
    }
  }

  const filtered = custom.filter((item) => item.id !== id);
  saveLocalCustomListings(filtered);
  return true;
}

/**
 * Get Saved Listing IDs
 */
export function getSavedListingIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Toggle Save / Bookmark Listing
 */
export async function toggleSaveListing(listingId: string, userId?: string): Promise<{ isSaved: boolean }> {
  const current = getSavedListingIds();
  const exists = current.includes(listingId);
  const updated = exists ? current.filter((id) => id !== listingId) : [...current, listingId];

  localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured && userId) {
    try {
      if (exists) {
        await supabase
          .from('user_saved_listings')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId);
      } else {
        await supabase
          .from('user_saved_listings')
          .insert({ user_id: userId, listing_id: listingId });
      }
    } catch (err) {
      console.warn('Supabase bookmark sync note:', err);
    }
  }

  return { isSaved: !exists };
}

/**
 * Submit an Inquiry (Private Buyer-Seller Communication)
 */
export async function submitMarketplaceInquiry(
  input: CreateInquiryInput,
  buyerId?: string
): Promise<MarketplaceInquiry> {
  const inquiry: MarketplaceInquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    listingId: input.listingId,
    listingTitle: input.listingTitle,
    sellerId: input.sellerId,
    buyerId: buyerId || 'anonymous-buyer',
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    message: input.message,
    inquiryType: input.inquiryType,
    proposedPrice: input.proposedPrice,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  if (isSupabaseConfigured) {
    try {
      let { error } = await supabase.from('listing_inquiries').insert({
        listing_id: input.listingId,
        listing_title: input.listingTitle,
        seller_id: input.sellerId,
        buyer_id: buyerId || null,
        buyer_name: input.buyerName,
        buyer_email: input.buyerEmail,
        message: input.message,
        inquiry_type: input.inquiryType,
        proposed_price: input.proposedPrice,
        status: 'pending',
      });
      if (error && error.code === '42P01') {
        await supabase.from('marketplace_inquiries').insert({
          listing_id: input.listingId,
          listing_title: input.listingTitle,
          seller_id: input.sellerId,
          buyer_id: buyerId || null,
          buyer_name: input.buyerName,
          buyer_email: input.buyerEmail,
          message: input.message,
          inquiry_type: input.inquiryType,
          proposed_price: input.proposedPrice,
          status: 'pending',
        });
      }
    } catch (err) {
      console.warn('Supabase inquiry insert note:', err);
    }
  }

  // Local storage backup
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
    const existing: MarketplaceInquiry[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify([inquiry, ...existing]));
  } catch (err) {
    console.warn('LocalStorage inquiry save error:', err);
  }

  return inquiry;
}

/**
 * Submit a Listing Report (Reporting Mechanism for fraud/hazardous/inappropriate items)
 */
export async function submitListingReport(
  input: CreateReportInput,
  reporterId?: string
): Promise<ListingReport> {
  const report: ListingReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    listingId: input.listingId,
    listingTitle: input.listingTitle,
    reporterId,
    reporterEmail: input.reporterEmail,
    reason: input.reason,
    details: input.details,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('content_reports').insert({
        content_type: 'product_listing',
        content_id: input.listingId,
        content_title: input.listingTitle,
        reporter_id: reporterId || null,
        reporter_email: input.reporterEmail,
        reason: input.reason,
        details: input.details,
      });
    } catch (err) {
      console.warn('Supabase report insert note:', err);
    }
  }

  // Local storage backup
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    const existing: ListingReport[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify([report, ...existing]));
  } catch (err) {
    console.warn('LocalStorage report save error:', err);
  }

  return report;
}
