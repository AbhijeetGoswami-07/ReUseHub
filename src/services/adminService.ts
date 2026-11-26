import {
  AdminStats,
  AdminCategory,
  AdminAuditLog,
  AdminUser,
  ContentReport,
  MarketplaceListing,
  CommunityPost,
  DIYInstructionIdea,
  UserProfile,
} from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_MARKETPLACE_LISTINGS } from './marketplaceService';
import { INITIAL_COMMUNITY_POSTS } from './communityService';
import { INITIAL_DIY_IDEAS } from './ideasService';

// Storage keys for demo resilience
const LOCAL_STORAGE_AUDIT_LOGS_KEY = 'reusehub_admin_audit_logs';
const LOCAL_STORAGE_CATEGORIES_KEY = 'reusehub_admin_categories';
const LOCAL_STORAGE_REPORTS_KEY = 'reusehub_admin_content_reports';
const LOCAL_STORAGE_USERS_KEY = 'reusehub_admin_users';

// Initial Categories Seed
export const INITIAL_CATEGORIES: AdminCategory[] = [
  {
    id: 'clothing',
    name: 'Clothing & Textiles',
    description: 'Apparel, cotton garments, synthetic fabrics, footwear, and textile offcuts.',
    wasteFactor: 0.8,
    isActive: true,
    sortOrder: 1,
    itemCount: 42,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'plastic',
    name: 'Plastic Containers & Polymers',
    description: 'Rigid bottles, storage tubs, polymer containers, and packaging elements.',
    wasteFactor: 0.3,
    isActive: true,
    sortOrder: 2,
    itemCount: 88,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'electronics',
    name: 'Consumer Electronics & Hardware',
    description: 'Computers, circuit boards, peripherals, mechanical keyboards, and appliances.',
    wasteFactor: 1.5,
    isActive: true,
    sortOrder: 3,
    itemCount: 29,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'furniture',
    name: 'Furniture & Timber Fixtures',
    description: 'Chairs, desks, solid wood tables, pallets, and cabinet fixtures.',
    wasteFactor: 8.5,
    isActive: true,
    sortOrder: 4,
    itemCount: 35,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'glass',
    name: 'Glass Jars & Bottles',
    description: 'Food jars, glass canisters, beverage bottles, and architectural glass panes.',
    wasteFactor: 0.6,
    isActive: true,
    sortOrder: 5,
    itemCount: 64,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'paper',
    name: 'Paper & Cardboard Packaging',
    description: 'Corrugated boxes, packing craft sheets, books, and kraft cartons.',
    wasteFactor: 0.4,
    isActive: true,
    sortOrder: 6,
    itemCount: 51,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'metal',
    name: 'Metal & Hardware Hardware',
    description: 'Aluminum cans, steel frames, bicycle frames, brass fittings, and hand tools.',
    wasteFactor: 2.2,
    isActive: true,
    sortOrder: 7,
    itemCount: 23,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'household',
    name: 'Household & Studio Items',
    description: 'Cookware, ceramic planters, tools, lamps, and daily utility sundries.',
    wasteFactor: 1.2,
    isActive: true,
    sortOrder: 8,
    itemCount: 47,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'other',
    name: 'Other Miscellaneous Materials',
    description: 'Mixed-composition and composite reclaimed goods.',
    wasteFactor: 1.0,
    isActive: true,
    sortOrder: 9,
    itemCount: 16,
    createdAt: '2026-01-10T08:00:00Z',
  },
];

// Initial Demo Users
export const INITIAL_DEMO_USERS: AdminUser[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@reusehub.org',
    fullName: 'System Administrator',
    role: 'admin',
    status: 'active',
    city: 'San Francisco',
    state: 'CA',
    createdAt: '2026-01-01T00:00:00Z',
    lastActive: 'Just now',
    reportCount: 0,
    listingsCount: 2,
    analysesCount: 18,
    metrics: {
      totalItemsDiverted: 35,
      co2SavedKg: 120.4,
      wasteDivertedKg: 85.0,
      communityPoints: 850,
      actionsBreakdown: { reuse: 12, repair: 8, upcycle: 7, donate: 5, recycle: 3 },
    },
  },
  {
    id: 'usr-eco-champion',
    email: 'eco.champion@reusehub.org',
    fullName: 'Eco Champion',
    role: 'user',
    status: 'active',
    city: 'Portland',
    state: 'Oregon',
    createdAt: '2026-09-15T10:00:00.000Z',
    lastActive: '10 minutes ago',
    reportCount: 0,
    listingsCount: 3,
    analysesCount: 9,
    metrics: {
      totalItemsDiverted: 14,
      co2SavedKg: 42.8,
      wasteDivertedKg: 28.5,
      communityPoints: 340,
      actionsBreakdown: { reuse: 5, repair: 3, upcycle: 3, donate: 2, recycle: 1 },
    },
  },
  {
    id: 'usr-maya',
    email: 'maya.lin@reusehub.org',
    fullName: 'Maya Lin',
    role: 'user',
    status: 'active',
    city: 'Seattle',
    state: 'Washington',
    createdAt: '2026-02-14T09:30:00Z',
    lastActive: '2 hours ago',
    reportCount: 0,
    listingsCount: 4,
    analysesCount: 22,
    metrics: {
      totalItemsDiverted: 28,
      co2SavedKg: 95.2,
      wasteDivertedKg: 64.1,
      communityPoints: 620,
      actionsBreakdown: { reuse: 10, repair: 6, upcycle: 8, donate: 3, recycle: 1 },
    },
  },
  {
    id: 'usr-marcus',
    email: 'marcus.chen@example.com',
    fullName: 'Marcus Chen',
    role: 'user',
    status: 'active',
    city: 'San Francisco',
    state: 'California',
    createdAt: '2026-03-01T14:20:00Z',
    lastActive: 'Yesterday',
    reportCount: 1,
    listingsCount: 1,
    analysesCount: 5,
    metrics: {
      totalItemsDiverted: 8,
      co2SavedKg: 19.5,
      wasteDivertedKg: 12.0,
      communityPoints: 180,
      actionsBreakdown: { reuse: 3, repair: 2, upcycle: 1, donate: 2, recycle: 0 },
    },
  },
  {
    id: 'usr-spammer',
    email: 'unverified.bot@junkmail.net',
    fullName: 'Discount Outlet Bot',
    role: 'user',
    status: 'suspended',
    city: 'Unknown',
    state: 'Unknown',
    createdAt: '2026-11-20T22:15:00Z',
    lastActive: '3 days ago',
    reportCount: 4,
    listingsCount: 0,
    analysesCount: 0,
    metrics: {
      totalItemsDiverted: 0,
      co2SavedKg: 0,
      wasteDivertedKg: 0,
      communityPoints: 0,
      actionsBreakdown: { reuse: 0, repair: 0, upcycle: 0, donate: 0, recycle: 0 },
    },
  },
];

// Initial Content Reports
export const INITIAL_CONTENT_REPORTS: ContentReport[] = [
  {
    id: 'rep-1',
    contentType: 'marketplace_listing',
    contentId: 'list-seed-2',
    contentTitle: 'Tactile Mechanical Keyboard (Needs USB-C Solder)',
    reporterEmail: 'sarah.j@reusehub.org',
    reason: 'inaccurate_description',
    details: 'Seller listed as Needs Repair but question whether electrical board is safe for DIY beginner solder.',
    status: 'pending',
    createdAt: '2026-11-23T16:20:00Z',
  },
  {
    id: 'rep-2',
    contentType: 'community_post',
    contentId: 'post-seed-1',
    contentTitle: 'Reclaimed Pallet Wood Vertical Herb Garden Planter',
    reporterEmail: 'gardener.dan@example.com',
    reason: 'dangerous_practice',
    details: 'Make sure instructions clearly emphasize avoiding chemically methyl-bromide treated (MB) pallets.',
    status: 'reviewed',
    adminNotes: 'Instruction step 1 already specifies checking for HT heat-treated brand stamp.',
    createdAt: '2026-11-22T10:15:00Z',
  },
  {
    id: 'rep-3',
    contentType: 'marketplace_listing',
    contentId: 'list-seed-5',
    contentTitle: 'Vintage Steel Frame Road Bicycle',
    reporterEmail: 'bike.advocate@denver.org',
    reason: 'other',
    details: 'Duplicate listing was posted earlier this week.',
    status: 'resolved',
    adminNotes: 'Confirmed single active listing retained. Resolved.',
    resolvedAt: '2026-11-24T12:00:00Z',
    createdAt: '2026-11-21T08:45:00Z',
  },
];

// Initial Audit Logs Seed
export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    adminId: 'usr-admin-1',
    adminEmail: 'admin@reusehub.org',
    actionType: 'category_created',
    targetType: 'category',
    targetId: 'household',
    targetName: 'Household & Studio Items',
    details: { wasteFactor: 1.2, isActive: true },
    createdAt: '2026-11-20T09:30:00Z',
  },
  {
    id: 'log-2',
    adminId: 'usr-admin-1',
    adminEmail: 'admin@reusehub.org',
    actionType: 'user_status_changed',
    targetType: 'user',
    targetId: 'usr-spammer',
    targetName: 'unverified.bot@junkmail.net',
    details: { previousStatus: 'active', newStatus: 'suspended', reason: 'Automated spam promotional posts' },
    createdAt: '2026-11-21T14:10:00Z',
  },
  {
    id: 'log-3',
    adminId: 'usr-admin-1',
    adminEmail: 'admin@reusehub.org',
    actionType: 'report_resolved',
    targetType: 'report',
    targetId: 'rep-3',
    targetName: 'Vintage Steel Frame Road Bicycle',
    details: { action: 'resolved', notes: 'Confirmed single active listing retained.' },
    createdAt: '2026-11-24T12:00:00Z',
  },
];

// ==========================================
// SECURITY: Server-Side Role Verification
// ==========================================

/**
 * Verify whether an authenticated user is legitimately an administrator.
 * In production Supabase, queries the database directly to prevent trusting client-side memory.
 */
export async function verifyAdminPrivileges(user: UserProfile | null): Promise<boolean> {
  if (!user) return false;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !data) return false;
      return data.role === 'admin';
    } catch {
      return false;
    }
  }

  // Demo fallback check
  return user.role === 'admin' || user.email.toLowerCase().includes('admin');
}

// ==========================================
// Audit Logging
// ==========================================

export async function logAdminAction(
  admin: UserProfile,
  actionType: AdminAuditLog['actionType'],
  targetType: AdminAuditLog['targetType'],
  targetId: string,
  targetName?: string,
  details: Record<string, any> = {}
): Promise<AdminAuditLog> {
  const newLog: AdminAuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    adminId: admin.id,
    adminEmail: admin.email,
    actionType,
    targetType,
    targetId,
    targetName: targetName || targetId,
    details,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('admin_audit_logs').insert([
        {
          admin_id: admin.id,
          admin_email: admin.email,
          action_type: actionType,
          target_type: targetType,
          target_id: targetId,
          target_name: targetName,
          details,
          created_at: newLog.createdAt,
        },
      ]);
    } catch (err) {
      console.warn('Could not persist audit log to Supabase, saving locally:', err);
    }
  }

  // Local persistence
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUDIT_LOGS_KEY);
    const logs: AdminAuditLog[] = raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
    logs.unshift(newLog);
    localStorage.setItem(LOCAL_STORAGE_AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error('Failed to write local audit log:', e);
  }

  return newLog;
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          adminId: d.admin_id,
          adminEmail: d.admin_email,
          actionType: d.action_type,
          targetType: d.target_type,
          targetId: d.target_id,
          targetName: d.target_name,
          details: d.details || {},
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.warn('Fallback to local audit logs:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUDIT_LOGS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

// ==========================================
// 1. Overview & Stats
// ==========================================

export async function getAdminOverviewStats(): Promise<AdminStats> {
  const [users, _categories, reports] = await Promise.all([
    getAdminUsers(),
    getAdminCategories(),
    getAdminReports(),
  ]);

  // Aggregate listings count
  let listingsCount = INITIAL_MARKETPLACE_LISTINGS.length;
  try {
    const raw = localStorage.getItem('reusehub_marketplace_custom_listings');
    if (raw) {
      const parsed = JSON.parse(raw);
      listingsCount += parsed.length;
    }
  } catch {}

  // Aggregate community posts count
  let postsCount = INITIAL_COMMUNITY_POSTS.length;
  try {
    const raw = localStorage.getItem('reusehub_community_custom_posts');
    if (raw) {
      const parsed = JSON.parse(raw);
      postsCount += parsed.length;
    }
  } catch {}

  // Aggregate analyses
  let analysesCount = 48; // baseline demo analyses
  try {
    const raw = localStorage.getItem('reusehub_user_analyzed_products');
    if (raw) {
      analysesCount += JSON.parse(raw).length;
    }
  } catch {}

  // Completed reuse activities
  let completedActivities = 94;
  try {
    const raw = localStorage.getItem('reusehub_ecoscore_activities');
    if (raw) {
      completedActivities += JSON.parse(raw).length;
    }
  } catch {}

  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  return {
    totalRegisteredUsers: users.length,
    totalProductAnalyses: analysesCount,
    totalMarketplaceListings: listingsCount,
    totalCommunityPosts: postsCount,
    completedReuseActivities: completedActivities,
    totalWasteDivertedKg: 1248.5,
    totalCo2SavedKg: 2890.2,
    pendingReportsCount: pendingReports,
  };
}

// ==========================================
// 2. Users Management
// ==========================================

export async function getAdminUsers(): Promise<AdminUser[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          email: d.email,
          fullName: d.full_name || 'Community Member',
          role: d.role || 'user',
          status: 'active',
          city: d.city || '',
          state: d.state || '',
          avatarUrl: d.avatar_url,
          createdAt: d.created_at,
          lastActive: 'Active today',
          reportCount: 0,
          listingsCount: 0,
          analysesCount: d.total_items_diverted || 0,
          metrics: {
            totalItemsDiverted: d.total_items_diverted || 0,
            co2SavedKg: Number(d.co2_saved_kg) || 0,
            wasteDivertedKg: Number(d.waste_diverted_kg) || 0,
            communityPoints: d.community_points || 0,
            actionsBreakdown: { reuse: 0, repair: 0, upcycle: 0, donate: 0, recycle: 0 },
          },
        }));
      }
    } catch (e) {
      console.warn('Fallback to local admin users:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_DEMO_USERS;
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

export async function updateUserRole(
  userId: string,
  newRole: 'user' | 'admin',
  admin: UserProfile
): Promise<{ success: boolean; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      if (error) throw error;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Update local storage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: AdminUser[] = raw ? JSON.parse(raw) : INITIAL_DEMO_USERS;
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      targetUser.role = newRole;
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    }
  } catch {}

  await logAdminAction(admin, 'user_role_changed', 'user', userId, userId, {
    newRole,
  });

  return { success: true };
}

export async function toggleUserStatus(
  userId: string,
  newStatus: 'active' | 'suspended',
  reason: string,
  admin: UserProfile
): Promise<{ success: boolean; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: AdminUser[] = raw ? JSON.parse(raw) : INITIAL_DEMO_USERS;
    const target = users.find((u) => u.id === userId);
    if (target) {
      target.status = newStatus;
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    }
  } catch {}

  await logAdminAction(admin, 'user_status_changed', 'user', userId, userId, {
    newStatus,
    reason,
  });

  return { success: true };
}

// ==========================================
// 3. Product Categories Management
// ==========================================

export async function getAdminCategories(): Promise<AdminCategory[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          wasteFactor: Number(d.waste_factor) || 1.0,
          isActive: d.is_active,
          sortOrder: d.sort_order,
          itemCount: 20,
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.warn('Fallback to local categories:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export async function createCategory(
  category: Omit<AdminCategory, 'createdAt'>,
  admin: UserProfile
): Promise<{ success: boolean; category?: AdminCategory; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  const newCat: AdminCategory = {
    ...category,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('product_categories').insert([
        {
          id: newCat.id,
          name: newCat.name,
          description: newCat.description,
          waste_factor: newCat.wasteFactor,
          is_active: newCat.isActive,
          sort_order: newCat.sortOrder,
        },
      ]);
      if (error) throw error;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    const categories: AdminCategory[] = raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    categories.push(newCat);
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  } catch {}

  await logAdminAction(admin, 'category_created', 'category', newCat.id, newCat.name, {
    wasteFactor: newCat.wasteFactor,
    isActive: newCat.isActive,
  });

  return { success: true, category: newCat };
}

export async function updateCategory(
  id: string,
  updates: Partial<AdminCategory>,
  admin: UserProfile
): Promise<{ success: boolean; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('product_categories')
        .update({
          name: updates.name,
          description: updates.description,
          waste_factor: updates.wasteFactor,
          is_active: updates.isActive,
          sort_order: updates.sortOrder,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    const categories: AdminCategory[] = raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    const idx = categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...updates };
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    }
  } catch {}

  await logAdminAction(admin, 'category_updated', 'category', id, updates.name || id, updates);

  return { success: true };
}

// ==========================================
// 4. Review & Moderate Marketplace Listings
// ==========================================

export async function getAdminMarketplaceListings(): Promise<MarketplaceListing[]> {
  let all: MarketplaceListing[] = [...INITIAL_MARKETPLACE_LISTINGS];
  try {
    const raw = localStorage.getItem('reusehub_marketplace_custom_listings');
    if (raw) {
      all = [...JSON.parse(raw), ...all];
    }
  } catch {}
  return all;
}

export async function removeMarketplaceListing(
  listingId: string,
  listingTitle: string,
  reason: string,
  admin: UserProfile
): Promise<{ success: boolean; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .update({ status: 'removed' })
        .eq('id', listingId);
      if (error) throw error;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Update local storage
  try {
    const raw = localStorage.getItem('reusehub_marketplace_custom_listings');
    if (raw) {
      const parsed: MarketplaceListing[] = JSON.parse(raw);
      const filtered = parsed.filter((l) => l.id !== listingId);
      localStorage.setItem('reusehub_marketplace_custom_listings', JSON.stringify(filtered));
    }
  } catch {}

  await logAdminAction(admin, 'listing_removed', 'listing', listingId, listingTitle, {
    reason,
  });

  return { success: true };
}

// ==========================================
// 5. Moderate Community Posts
// ==========================================

export async function getAdminCommunityPosts(): Promise<CommunityPost[]> {
  let all: CommunityPost[] = [...INITIAL_COMMUNITY_POSTS];
  try {
    const raw = localStorage.getItem('reusehub_community_custom_posts');
    if (raw) {
      all = [...JSON.parse(raw), ...all];
    }
  } catch {}
  return all;
}

export async function moderateCommunityPost(
  postId: string,
  postTitle: string,
  action: 'take_down' | 'restore',
  reason: string,
  admin: UserProfile
): Promise<{ success: boolean; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  if (isSupabaseConfigured) {
    try {
      if (action === 'take_down') {
        const { error } = await supabase.from('community_posts').delete().eq('id', postId);
        if (error) throw error;
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  try {
    const raw = localStorage.getItem('reusehub_community_custom_posts');
    if (raw) {
      const parsed: CommunityPost[] = JSON.parse(raw);
      const filtered = parsed.filter((p) => p.id !== postId);
      localStorage.setItem('reusehub_community_custom_posts', JSON.stringify(filtered));
    }
  } catch {}

  await logAdminAction(
    admin,
    action === 'take_down' ? 'community_post_removed' : 'community_post_moderated',
    'community_post',
    postId,
    postTitle,
    { reason, action }
  );

  return { success: true };
}

// ==========================================
// 6. Content Reports Management
// ==========================================

export async function getAdminReports(): Promise<ContentReport[]> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CONTENT_REPORTS;
  } catch {
    return INITIAL_CONTENT_REPORTS;
  }
}

export async function resolveContentReport(
  reportId: string,
  action: 'resolved' | 'dismissed',
  adminNotes: string,
  admin: UserProfile
): Promise<{ success: boolean; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    const reports: ContentReport[] = raw ? JSON.parse(raw) : INITIAL_CONTENT_REPORTS;
    const target = reports.find((r) => r.id === reportId);
    if (target) {
      target.status = action;
      target.adminNotes = adminNotes;
      target.resolvedBy = admin.id;
      target.resolvedAt = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
    }
  } catch {}

  await logAdminAction(
    admin,
    action === 'resolved' ? 'report_resolved' : 'report_dismissed',
    'report',
    reportId,
    reportId,
    { action, adminNotes }
  );

  return { success: true };
}

// ==========================================
// 7. Educational Reuse Content (DIY Ideas)
// ==========================================

export async function getAdminReuseIdeas(): Promise<DIYInstructionIdea[]> {
  let all: DIYInstructionIdea[] = [...INITIAL_DIY_IDEAS];
  try {
    const raw = localStorage.getItem('reusehub_custom_diy_ideas');
    if (raw) {
      all = [...JSON.parse(raw), ...all];
    }
  } catch {}
  return all;
}

export async function createReuseIdea(
  idea: Omit<DIYInstructionIdea, 'id'>,
  admin: UserProfile
): Promise<{ success: boolean; idea?: DIYInstructionIdea; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  const newIdea: DIYInstructionIdea = {
    ...idea,
    id: `idea-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem('reusehub_custom_diy_ideas');
    const existing: DIYInstructionIdea[] = raw ? JSON.parse(raw) : [];
    existing.unshift(newIdea);
    localStorage.setItem('reusehub_custom_diy_ideas', JSON.stringify(existing));
  } catch {}

  await logAdminAction(admin, 'reuse_idea_created', 'reuse_idea', newIdea.id, newIdea.projectTitle, {
    category: newIdea.category,
    difficulty: newIdea.difficultyLevel,
  });

  return { success: true, idea: newIdea };
}

export async function deleteReuseIdea(
  ideaId: string,
  ideaTitle: string,
  admin: UserProfile
): Promise<{ success: boolean; error?: string }> {
  const isAuthAdmin = await verifyAdminPrivileges(admin);
  if (!isAuthAdmin) return { success: false, error: 'Unauthorized: Admin role required' };

  try {
    const raw = localStorage.getItem('reusehub_custom_diy_ideas');
    if (raw) {
      const existing: DIYInstructionIdea[] = JSON.parse(raw);
      const filtered = existing.filter((i) => i.id !== ideaId);
      localStorage.setItem('reusehub_custom_diy_ideas', JSON.stringify(filtered));
    }
  } catch {}

  await logAdminAction(admin, 'reuse_idea_deleted', 'reuse_idea', ideaId, ideaTitle, {});

  return { success: true };
}
