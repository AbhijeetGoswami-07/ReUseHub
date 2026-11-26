import {
  ProductCategory,
  ProductCondition,
  ProductMaterial,
  ReuseAction,
  MarketplaceInquiry,
} from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';
import { getMarketplaceListings } from './marketplaceService';

export interface UserAnalyzedProduct {
  id: string;
  title: string;
  category: ProductCategory;
  material?: ProductMaterial;
  condition: ProductCondition;
  description?: string;
  imageUrl?: string;
  recommendedAction: ReuseAction;
  co2EstimateKg: number;
  createdAt: string;
}

export interface SavedRecommendationItem {
  id: string;
  productId?: string;
  productTitle: string;
  category: ProductCategory;
  action: ReuseAction;
  planTitle: string;
  difficulty?: string;
  estimatedEffort?: string;
  co2SavedKg: number;
  savedAt: string;
}

export interface UserActivityItem {
  id: string;
  actionType: ReuseAction | 'marketplace_rehome';
  productName: string;
  category?: string;
  co2SavedKg: number;
  wasteDivertedKg: number;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalAnalyzed: number;
  savedIdeas: number;
  activeListings: number;
  completedActivities: number;
  totalCo2Saved: number;
  totalWasteDiverted: number;
  actionsBreakdown: Record<ReuseAction, number>;
}

const LOCAL_STORAGE_ANALYSES_KEY = 'reusehub_user_analyzed_products';
const LOCAL_STORAGE_SAVED_PLANS_KEY = 'reusehub_saved_user_ideas';
const LOCAL_STORAGE_ACTIVITY_KEY = 'reusehub_user_activity_history';
const LOCAL_STORAGE_INQUIRIES_KEY = 'reusehub_marketplace_inquiries';

// Initial demo history for sample accounts
const INITIAL_DEMO_ACTIVITIES: UserActivityItem[] = [
  {
    id: 'act-1',
    actionType: 'repair',
    productName: 'Wobbly Solid Oak Dining Chair',
    category: 'Furniture',
    co2SavedKg: 14.5,
    wasteDivertedKg: 8.0,
    notes: 'Injected PVA glue and tapped hardwood dowel pin. Fully restored rigidity.',
    completed: true,
    createdAt: '2026-11-20T14:30:00Z',
  },
  {
    id: 'act-2',
    actionType: 'upcycle',
    productName: 'Worn Denim Work Jeans',
    category: 'Clothing',
    co2SavedKg: 11.5,
    wasteDivertedKg: 1.2,
    notes: 'Converted into reinforced dual-strap market tote bag with front pocket.',
    completed: true,
    createdAt: '2026-11-22T09:15:00Z',
  },
  {
    id: 'act-3',
    actionType: 'reuse',
    productName: 'Glass Food Jars (Set of 6)',
    category: 'Glass',
    co2SavedKg: 2.4,
    wasteDivertedKg: 1.8,
    notes: 'Stripped adhesive with baking soda paste and sanitized for bulk grain storage.',
    completed: true,
    createdAt: '2026-11-23T11:00:00Z',
  },
];

const INITIAL_DEMO_ANALYSES: UserAnalyzedProduct[] = [
  {
    id: 'prod-demo-1',
    title: 'Vintage Solid Oak Dining Chair',
    category: 'furniture',
    material: 'wood',
    condition: 'needs_repair',
    description: 'Wobbly wooden chair with sound spindle joints. Needs dowel reinjection.',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    recommendedAction: 'repair',
    co2EstimateKg: 14.5,
    createdAt: '3 days ago',
  },
  {
    id: 'prod-demo-2',
    title: 'Old Heavy Denim Jeans',
    category: 'clothing',
    material: 'cotton',
    condition: 'good',
    description: 'Faded denim with fraying knees but strong waist and pockets.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    recommendedAction: 'upcycle',
    co2EstimateKg: 11.5,
    createdAt: '2 days ago',
  },
];

const INITIAL_DEMO_SAVED_PLANS: SavedRecommendationItem[] = [
  {
    id: 'saved-demo-1',
    productId: 'prod-demo-2',
    productTitle: 'Old Heavy Denim Jeans',
    category: 'clothing',
    action: 'upcycle',
    planTitle: 'Convert Denim into Heavy-Duty Market Tote Bag',
    difficulty: 'Moderate',
    estimatedEffort: '1.5 hrs',
    co2SavedKg: 11.5,
    savedAt: '2 days ago',
  },
];

/**
 * 1. Fetch User Analyzed Products
 */
export async function getUserAnalyzedProducts(userId?: string): Promise<UserAnalyzedProduct[]> {
  let list: UserAnalyzedProduct[] = [];

  // 1. Try Supabase
  if (isSupabaseConfigured && userId) {
    try {
      let { data, error } = await supabase
        .from('product_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error && error.code === '42P01') {
        const fallbackRes = await supabase
          .from('products')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.product_name || item.title,
          category: item.category as ProductCategory,
          material: item.material as ProductMaterial,
          condition: item.condition as ProductCondition,
          description: item.description,
          imageUrl: item.image_url,
          recommendedAction: (item.recommended_action || 'reuse') as ReuseAction,
          co2EstimateKg: Number(item.co2_estimate_kg) || 8.5,
          createdAt: new Date(item.created_at).toLocaleDateString(),
        }));
      }
    } catch (err) {
      console.warn('Supabase product_analyses fetch note:', err);
    }
  }

  // 2. Offline / Demo fallback
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ANALYSES_KEY);
    if (raw) {
      list = JSON.parse(raw);
    } else if (!userId || userId === 'usr-eco-champion') {
      list = INITIAL_DEMO_ANALYSES;
      localStorage.setItem(LOCAL_STORAGE_ANALYSES_KEY, JSON.stringify(INITIAL_DEMO_ANALYSES));
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }

  return list;
}

/**
 * Delete an analyzed product from history
 */
export async function deleteAnalyzedProduct(id: string, userId?: string): Promise<boolean> {
  if (isSupabaseConfigured && userId) {
    try {
      await supabase.from('products').delete().eq('id', id).eq('user_id', userId);
    } catch (err) {
      console.warn('Supabase delete product note:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ANALYSES_KEY);
    if (raw) {
      const stored: UserAnalyzedProduct[] = JSON.parse(raw);
      const updated = stored.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_ANALYSES_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('LocalStorage delete note:', err);
  }

  return true;
}

/**
 * 2. Fetch User Saved Recommendations
 */
export async function getUserSavedRecommendations(userId?: string): Promise<SavedRecommendationItem[]> {
  let list: SavedRecommendationItem[] = [];

  // 1. Try Supabase
  if (isSupabaseConfigured && userId) {
    try {
      const { data, error } = await supabase
        .from('saved_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          productId: item.product_analysis_id || item.recommendation_id,
          productTitle: item.product_title || 'Saved Product',
          category: item.category || 'other',
          action: (item.action_type || 'reuse').toLowerCase() as ReuseAction,
          planTitle: item.plan_title || 'Circular Action Plan',
          difficulty: item.difficulty || 'Moderate',
          estimatedEffort: item.estimated_effort || '30 mins',
          co2SavedKg: Number(item.co2_saved_kg) || 0,
          savedAt: new Date(item.created_at).toLocaleDateString(),
        }));
      }
    } catch (err) {
      console.warn('Supabase saved_recommendations fetch note:', err);
    }
  }

  // 2. Offline / Demo fallback
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SAVED_PLANS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      list = parsed.map((item: any) => ({
        id: item.id || `saved-${Math.random()}`,
        productId: item.productId,
        productTitle: item.productTitle || item.title || 'Saved Product',
        category: item.category || 'other',
        action: (item.action || item.recommendedAction || 'reuse').toLowerCase() as ReuseAction,
        planTitle: item.planTitle || item.topPlan?.title || item.title || 'Circular Action Plan',
        difficulty: item.difficulty || item.topPlan?.difficulty || 'Moderate',
        estimatedEffort: item.estimatedEffort || item.topPlan?.estimatedEffort || '30 mins',
        co2SavedKg: Number(item.co2SavedKg ?? item.topPlan?.environmentalImpact?.co2KgSaved) || 8.5,
        savedAt: item.savedAt ? (isNaN(Date.parse(item.savedAt)) ? item.savedAt : new Date(item.savedAt).toLocaleDateString()) : 'Recently',
      }));
    } else if (!userId || userId === 'usr-eco-champion') {
      list = INITIAL_DEMO_SAVED_PLANS;
      localStorage.setItem(LOCAL_STORAGE_SAVED_PLANS_KEY, JSON.stringify(INITIAL_DEMO_SAVED_PLANS));
    }
  } catch (err) {
    console.warn('LocalStorage saved plans note:', err);
  }

  return list;
}

/**
 * Remove a saved recommendation
 */
export async function removeSavedRecommendation(id: string, userId?: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('saved_recommendations').delete().eq('id', id);
      if (userId) query = query.eq('user_id', userId);
      await query;
    } catch (err) {
      console.warn('Supabase remove saved recommendation note:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SAVED_PLANS_KEY);
    if (raw) {
      const stored: SavedRecommendationItem[] = JSON.parse(raw);
      const updated = stored.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_SAVED_PLANS_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('LocalStorage remove saved note:', err);
  }
  return true;
}

/**
 * 3. Fetch User Inquiries (both sent and received)
 */
export async function getUserInquiries(
  userId?: string
): Promise<{ sent: MarketplaceInquiry[]; received: MarketplaceInquiry[] }> {
  let all: MarketplaceInquiry[] = [];

  if (isSupabaseConfigured && userId) {
    try {
      let { data, error } = await supabase
        .from('listing_inquiries')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error && error.code === '42P01') {
        const fallbackRes = await supabase
          .from('marketplace_inquiries')
          .select('*')
          .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
          .order('created_at', { ascending: false });
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (!error && data) {
        all = data.map((item: any) => ({
          id: item.id,
          listingId: item.listing_id,
          listingTitle: item.listing_title,
          sellerId: item.seller_id,
          buyerId: item.buyer_id,
          buyerName: item.buyer_name,
          buyerEmail: item.buyer_email,
          message: item.message,
          inquiryType: item.inquiry_type,
          proposedPrice: item.proposed_price ? Number(item.proposed_price) : undefined,
          status: item.status,
          createdAt: new Date(item.created_at).toLocaleDateString(),
        }));
      }
    } catch (err) {
      console.warn('Supabase inquiries fetch note:', err);
    }
  }

  // LocalStorage merge only when not in Supabase
  if (!isSupabaseConfigured) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
      if (raw) {
        all = JSON.parse(raw);
      } else if (!userId || userId === 'usr-eco-champion') {
        const sampleInquiry: MarketplaceInquiry = {
          id: 'inq-sample-1',
          listingId: 'list-seed-1',
          listingTitle: 'Solid Pine Study Desk & Drawer Organizer',
          sellerId: 'user-elena',
          buyerId: 'usr-eco-champion',
          buyerName: 'Eco Champion',
          buyerEmail: 'eco.champion@reusehub.org',
          message: 'Hi Elena! I can pick up the study desk this Saturday afternoon. Is that time suitable for you?',
          inquiryType: 'pickup_request',
          status: 'responded',
          createdAt: 'Yesterday',
        };
        all = [sampleInquiry];
        localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(all));
      }
    } catch (err) {
      console.warn('LocalStorage inquiry error:', err);
    }
  }

  const currentUserId = userId || 'usr-eco-champion';
  return {
    sent: all.filter((i) => i.buyerId === currentUserId || i.buyerEmail === 'eco.champion@reusehub.org'),
    received: all.filter((i) => i.sellerId === currentUserId),
  };
}

/**
 * Update inquiry status (e.g. pending -> responded -> closed)
 */
export async function updateInquiryStatus(
  id: string,
  status: 'pending' | 'responded' | 'closed'
): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('marketplace_inquiries').update({ status }).eq('id', id);
    } catch (err) {
      console.warn('Supabase inquiry update note:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
    if (raw) {
      const stored: MarketplaceInquiry[] = JSON.parse(raw);
      const updated = stored.map((i) => (i.id === id ? { ...i, status } : i));
      localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('LocalStorage inquiry update note:', err);
  }

  return true;
}

/**
 * 4. Fetch User Activity History
 */
export async function getUserActivityHistory(userId?: string): Promise<UserActivityItem[]> {
  let list: UserActivityItem[] = [];

  if (isSupabaseConfigured && userId) {
    try {
      let { data, error } = await supabase
        .from('reuse_activities')
        .select('*')
        .eq('user_id', userId)
        .order('confirmed_at', { ascending: false });

      if (error && error.code === '42P01') {
        const fallbackRes = await supabase
          .from('user_activity_history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          actionType: item.activity_type || item.action_type,
          productName: item.product_name,
          category: item.product_category || item.category,
          co2SavedKg: Number(item.illustrative_co2_kg ?? item.co2_saved_kg) || 0,
          wasteDivertedKg: Number(item.estimated_weight_kg ?? item.waste_diverted_kg) || 0,
          notes: item.notes,
          completed: true,
          createdAt: item.confirmed_at || item.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase activity history note:', err);
    }
  }

  // Fallback to local demo activities ONLY when !isSupabaseConfigured
  if (!isSupabaseConfigured) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_ACTIVITY_KEY);
      if (raw) {
        list = JSON.parse(raw);
      } else if (!userId || userId === 'usr-eco-champion') {
        list = INITIAL_DEMO_ACTIVITIES;
        localStorage.setItem(LOCAL_STORAGE_ACTIVITY_KEY, JSON.stringify(INITIAL_DEMO_ACTIVITIES));
      }
    } catch (err) {
      console.warn('LocalStorage activity history note:', err);
    }
  }

  return list;
}

/**
 * Log a new completed reuse activity
 */
export async function logCompletedActivity(
  item: Omit<UserActivityItem, 'id' | 'createdAt'>,
  userId?: string
): Promise<UserActivityItem> {
  const newActivity: UserActivityItem = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...item,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && userId) {
    try {
      let { error } = await supabase.from('reuse_activities').insert({
        user_id: userId,
        activity_type: item.actionType === 'marketplace_rehome' ? 'reuse' : item.actionType,
        product_name: item.productName,
        product_category: item.category || 'Household Items',
        estimated_weight_kg: item.wasteDivertedKg || 1.0,
        points_earned: Math.round((item.wasteDivertedKg || 1.0) * 10) + 40,
        base_points: 40,
        weight_points: Math.round((item.wasteDivertedKg || 1.0) * 10),
        illustrative_co2_kg: item.co2SavedKg || 2.0,
        notes: item.notes,
        verification_status: 'user_reported',
      });

      if (error && error.code === '42P01') {
        await supabase.from('user_activity_history').insert({
          user_id: userId,
          action_type: item.actionType,
          product_name: item.productName,
          category: item.category,
          co2_saved_kg: item.co2SavedKg,
          waste_diverted_kg: item.wasteDivertedKg,
          notes: item.notes,
          completed: item.completed,
        });
      }
    } catch (err) {
      console.warn('Supabase log activity note:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACTIVITY_KEY);
    const existing: UserActivityItem[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LOCAL_STORAGE_ACTIVITY_KEY, JSON.stringify([newActivity, ...existing]));
  } catch (err) {
    console.warn('LocalStorage save activity error:', err);
  }

  return newActivity;
}

/**
 * 5. Compute Real Dynamic Summary Metrics (No fake or random numbers!)
 */
export async function getDashboardSummaryMetrics(userId?: string): Promise<DashboardSummary> {
  const [analyzed, savedPlans, listings, activities] = await Promise.all([
    getUserAnalyzedProducts(userId),
    getUserSavedRecommendations(userId),
    getMarketplaceListings({ myListingsOnly: true, userId }),
    getUserActivityHistory(userId),
  ]);

  const activeListingsCount = listings.filter((l) => l.status === 'active').length;
  const completedActivities = activities.filter((a) => a.completed);

  // Compute actual sum of CO2 and waste diverted
  let totalCo2Saved = 0;
  let totalWasteDiverted = 0;
  const actionsBreakdown: Record<ReuseAction, number> = {
    reuse: 0,
    repair: 0,
    upcycle: 0,
    donate: 0,
    recycle: 0,
  };

  completedActivities.forEach((act) => {
    totalCo2Saved += act.co2SavedKg;
    totalWasteDiverted += act.wasteDivertedKg;
    if (act.actionType in actionsBreakdown) {
      actionsBreakdown[act.actionType as ReuseAction] += 1;
    }
  });

  return {
    totalAnalyzed: analyzed.length,
    savedIdeas: savedPlans.length,
    activeListings: activeListingsCount,
    completedActivities: completedActivities.length,
    totalCo2Saved: Number(totalCo2Saved.toFixed(1)),
    totalWasteDiverted: Number(totalWasteDiverted.toFixed(1)),
    actionsBreakdown,
  };
}
