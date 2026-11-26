export type ReuseAction = 'reuse' | 'repair' | 'upcycle' | 'donate' | 'recycle';

export interface ActionPathway {
  id: ReuseAction;
  title: string;
  shortDescription: string;
  iconName: string;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
}

export type ProductCategory = 
  | 'clothing'
  | 'Clothing'
  | 'plastic'
  | 'Plastic'
  | 'electronics'
  | 'Electronics'
  | 'furniture'
  | 'Furniture'
  | 'glass'
  | 'Glass'
  | 'paper'
  | 'Paper'
  | 'metal'
  | 'Metal'
  | 'household_items'
  | 'Household Items'
  | 'home_garden'
  | 'packaging_materials'
  | 'other'
  | 'Other';

export type ProductMaterial =
  | 'cotton'
  | 'Cotton'
  | 'plastic'
  | 'Plastic'
  | 'wood'
  | 'Wood'
  | 'glass'
  | 'Glass'
  | 'metal'
  | 'Metal'
  | 'paper'
  | 'Paper'
  | 'leather'
  | 'Leather'
  | 'electronic_components'
  | 'Electronic Components'
  | 'mixed_material'
  | 'Mixed Material'
  | 'unknown'
  | 'Unknown';

export type ProductCondition = 
  | 'like_new'
  | 'Like New'
  | 'good'
  | 'Good'
  | 'needs_repair'
  | 'Needs Repair'
  | 'minor_fault'
  | 'damaged'
  | 'Damaged'
  | 'unusable'
  | 'Unusable'
  | 'broken'
  | 'scrap';

export interface ProductItem {
  id: string;
  title: string;
  category: ProductCategory;
  material: ProductMaterial;
  condition: ProductCondition;
  description: string;
  imageUrl?: string;
  createdAt: string;
  userId?: string;
}

export interface RecommendationStep {
  stepNumber: number;
  instruction: string;
  toolsNeeded?: string[];
  safetyTip?: string;
}

export interface RecommendationPlan {
  id: string;
  action: ReuseAction;
  title: string;
  isApplicable: boolean;
  inapplicableReason?: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
  estimatedTimeMinutes: number;
  estimatedEffort?: string;
  requiredMaterials?: string[];
  safetyNotes?: string;
  safetyRiskLevel?: 'none' | 'low' | 'moderate' | 'high' | 'prohibited';
  rankScore?: number;
  rankPosition?: number;
  environmentalImpact: {
    co2KgSaved: number;
    wasteKgDiverted: number;
    waterLitersSaved?: number;
  };
  summary: string;
  steps: RecommendationStep[];
  nearbyOptions?: {
    type: 'dropoff' | 'repair_cafe' | 'donation_center' | 'recycler';
    name: string;
    distanceKm: number;
  }[];
}

export type MarketplaceListingType = 'Free Donation' | 'Product Exchange' | 'Sale';

export interface MarketplaceListing {
  id: string;
  productName: string;
  title?: string; // backwards compatibility alias for productName
  description: string;
  category: ProductCategory;
  material: ProductMaterial;
  condition: ProductCondition;
  actionRecommendation?: ReuseAction;
  images: string[];
  imageUrl: string; // primary image
  listingType: MarketplaceListingType;
  price: number; // 0 for Free Donation or Product Exchange
  isFree: boolean;
  city: string;
  state: string;
  location?: string; // e.g. "Seattle, WA"
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerJoinedDate?: string;
  status: 'active' | 'reserved' | 'completed';
  createdAt: string;
  viewsCount?: number;
}

export interface MarketplaceInquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail: string;
  message: string;
  inquiryType: 'question' | 'offer' | 'pickup_request';
  proposedPrice?: number;
  createdAt: string;
  status?: 'pending' | 'responded' | 'closed';
}

export interface ListingReport {
  id: string;
  listingId: string;
  listingTitle: string;
  reporterId?: string;
  reporterEmail?: string;
  reason: 'hazardous_material' | 'fraud_scam' | 'prohibited_item' | 'inaccurate_description' | 'other';
  details: string;
  createdAt: string;
}

export interface UserImpactMetrics {
  totalItemsDiverted: number;
  co2SavedKg: number;
  wasteDivertedKg: number;
  communityPoints: number;
  actionsBreakdown: Record<ReuseAction, number>;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'community_lead' | 'admin';
  avatarUrl?: string;
  city?: string;
  state?: string;
  createdAt: string;
  metrics: UserImpactMetrics;
}

export type DIYCategory =
  | 'Clothing Upcycling'
  | 'Plastic Reuse'
  | 'Glass Reuse'
  | 'Paper Crafts'
  | 'Furniture Restoration'
  | 'Household Reuse'
  | 'Metal Reuse';

export type DIYDifficulty = 'Easy' | 'Moderate' | 'Advanced';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorTitle?: string;
  title: string;
  description: string;
  category: ProductCategory | string;
  images: string[];
  primaryImage: string;
  requiredMaterials: string[];
  instructions: string[];
  difficulty?: 'Easy' | 'Moderate' | 'Advanced';
  estimatedTime?: string;
  likesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface CommunityPostReport {
  id: string;
  postId: string;
  postTitle: string;
  reporterId?: string;
  reason: 'inappropriate_content' | 'spam_promotional' | 'dangerous_practice' | 'copyright_plagiarism' | 'other';
  details: string;
  createdAt: string;
}

export interface DIYInstructionStep {
  stepNumber: number;
  title?: string;
  instruction: string;
  tip?: string;
  diagramKey?: string;
  diagramType?: 'cut' | 'fold' | 'stitch' | 'assemble' | 'finish' | 'custom' | 'measure' | 'clean' | 'sand' | 'drill' | 'heat' | 'inspect';
  diagramNote?: string;
  measurements?: string[];
  labels?: string[];
  requiredTools?: string[];
  requiredMaterials?: string[];
  safetyWarning?: string;
}

export interface DIYInstructionIdea {
  id: string;
  projectTitle: string;
  category: DIYCategory;
  beforeProduct: string;
  finalProduct: string;
  description: string;
  requiredMaterials: string[];
  toolsRequired: string[];
  difficultyLevel: DIYDifficulty;
  estimatedCompletionTime: string;
  stepByStepInstructions: DIYInstructionStep[];
  safetyPrecautions: string[];
  relevantImage: string;
  co2SavedKg: number;
  isFeatured?: boolean;
  createdAt?: string;
}

// ==========================================
// Admin Dashboard Types
// ==========================================

export type AdminSidebarTab =
  | 'overview'
  | 'users'
  | 'analyses'
  | 'marketplace'
  | 'community'
  | 'categories'
  | 'reports'
  | 'analytics'
  | 'settings';

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  wasteFactor: number;
  isActive: boolean;
  sortOrder: number;
  itemCount?: number;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  actionType:
    | 'category_created'
    | 'category_updated'
    | 'category_status_changed'
    | 'listing_removed'
    | 'listing_status_changed'
    | 'community_post_moderated'
    | 'community_post_removed'
    | 'report_resolved'
    | 'report_dismissed'
    | 'user_role_changed'
    | 'user_status_changed'
    | 'reuse_idea_created'
    | 'reuse_idea_updated'
    | 'reuse_idea_deleted'
    | 'settings_updated';
  targetType: 'listing' | 'user' | 'category' | 'community_post' | 'report' | 'reuse_idea' | 'system';
  targetId: string;
  targetName?: string;
  details: Record<string, any>;
  createdAt: string;
}

export interface AdminUser extends UserProfile {
  status: 'active' | 'suspended';
  lastActive?: string;
  reportCount?: number;
  listingsCount?: number;
  analysesCount?: number;
}

export interface ContentReport {
  id: string;
  contentType: 'community_post' | 'marketplace_listing';
  contentId: string;
  contentTitle: string;
  reporterId?: string;
  reporterEmail?: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  resolvedBy?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminStats {
  totalRegisteredUsers: number;
  totalProductAnalyses: number;
  totalMarketplaceListings: number;
  totalCommunityPosts: number;
  completedReuseActivities: number;
  totalWasteDivertedKg: number;
  totalCo2SavedKg: number;
  pendingReportsCount: number;
}

