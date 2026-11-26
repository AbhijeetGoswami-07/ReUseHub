-- ====================================================================
-- ReUseHub Complete Backend Integration & Architecture Audit Migration
-- Standard Schema for all 12 Core Tables, 4 Storage Buckets, and RLS
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if requesting user is staff administrator
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 1. PROFILES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  city TEXT,
  state TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'community_lead', 'admin')),
  total_items_diverted INT DEFAULT 0 CHECK (total_items_diverted >= 0),
  co2_saved_kg NUMERIC(8, 2) DEFAULT 0 CHECK (co2_saved_kg >= 0),
  waste_diverted_kg NUMERIC(8, 2) DEFAULT 0 CHECK (waste_diverted_kg >= 0),
  community_points INT DEFAULT 0 CHECK (community_points >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(community_points DESC);

-- Trigger for updated_at on profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Auto-creation trigger on new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, city, state, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data->>'city', NULL),
    COALESCE(NEW.raw_user_meta_data->>'state', NULL),
    'user',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================================================================
-- 2. PRODUCT_ANALYSES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.product_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  material TEXT,
  condition TEXT NOT NULL CHECK (condition IN ('like_new', 'good', 'needs_repair', 'damaged', 'unusable')),
  description TEXT,
  image_url TEXT,
  estimated_weight_kg NUMERIC(6, 2) DEFAULT 1.0 CHECK (estimated_weight_kg > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_analyses_user ON public.product_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_product_analyses_cat ON public.product_analyses(category);
CREATE INDEX IF NOT EXISTS idx_product_analyses_created ON public.product_analyses(created_at DESC);

DROP TRIGGER IF EXISTS trigger_product_analyses_updated_at ON public.product_analyses;
CREATE TRIGGER trigger_product_analyses_updated_at
  BEFORE UPDATE ON public.product_analyses
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Backward compatibility view for legacy 'products' reference
CREATE OR REPLACE VIEW public.products AS
  SELECT
    id,
    user_id,
    product_name AS title,
    category,
    condition,
    description,
    material,
    image_url,
    created_at
  FROM public.product_analyses;

-- ====================================================================
-- 3. RECOMMENDATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_analysis_id UUID REFERENCES public.product_analyses(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('reuse', 'repair', 'upcycle', 'donate', 'recycle')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'advanced', 'Easy', 'Moderate', 'Advanced')),
  estimated_time TEXT,
  co2_kg_saved NUMERIC(6, 2) DEFAULT 0 CHECK (co2_kg_saved >= 0),
  waste_kg_diverted NUMERIC(6, 2) DEFAULT 0 CHECK (waste_kg_diverted >= 0),
  steps JSONB DEFAULT '[]'::jsonb NOT NULL,
  required_materials JSONB DEFAULT '[]'::jsonb NOT NULL,
  safety_notes TEXT,
  safety_risk_level TEXT CHECK (safety_risk_level IN ('none', 'low', 'moderate', 'high', 'prohibited')),
  rank_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recommendations_analysis ON public.recommendations(product_analysis_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_action ON public.recommendations(action_type);

-- ====================================================================
-- 4. SAVED_RECOMMENDATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.saved_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_analysis_id UUID REFERENCES public.product_analyses(id) ON DELETE SET NULL,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  category TEXT DEFAULT 'Other' NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('reuse', 'repair', 'upcycle', 'donate', 'recycle')),
  plan_title TEXT NOT NULL,
  difficulty TEXT,
  estimated_effort TEXT,
  co2_saved_kg NUMERIC(6, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_saved_recommendations_user ON public.saved_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recommendations_action ON public.saved_recommendations(action_type);

-- ====================================================================
-- 5. REUSE_IDEAS TABLE (Educational Content)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.reuse_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Clothing Upcycling',
    'Plastic Reuse',
    'Glass Reuse',
    'Paper Crafts',
    'Furniture Restoration',
    'Household Reuse',
    'Metal Reuse'
  )),
  before_product TEXT NOT NULL,
  final_product TEXT NOT NULL,
  description TEXT NOT NULL,
  required_materials JSONB DEFAULT '[]'::jsonb NOT NULL,
  tools_required JSONB DEFAULT '[]'::jsonb NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('Easy', 'Moderate', 'Advanced')),
  estimated_completion_time TEXT NOT NULL,
  step_by_step_instructions JSONB DEFAULT '[]'::jsonb NOT NULL,
  safety_precautions JSONB DEFAULT '[]'::jsonb NOT NULL,
  relevant_image TEXT NOT NULL,
  co2_saved_kg NUMERIC(6, 2) DEFAULT 0 CHECK (co2_saved_kg >= 0),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reuse_ideas_cat ON public.reuse_ideas(category);
CREATE INDEX IF NOT EXISTS idx_reuse_ideas_diff ON public.reuse_ideas(difficulty_level);

DROP TRIGGER IF EXISTS trigger_reuse_ideas_updated_at ON public.reuse_ideas;
CREATE TRIGGER trigger_reuse_ideas_updated_at
  BEFORE UPDATE ON public.reuse_ideas
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ====================================================================
-- 6. PRODUCT_LISTINGS TABLE (Marketplace)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.product_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  material TEXT NOT NULL,
  condition TEXT NOT NULL,
  images TEXT[] DEFAULT '{}'::text[] NOT NULL,
  image_url TEXT NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('Free Donation', 'Product Exchange', 'Sale')),
  price NUMERIC(10, 2) DEFAULT 0 CHECK (price >= 0),
  is_free BOOLEAN GENERATED ALWAYS AS (listing_type = 'Free Donation' OR price = 0) STORED,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  seller_avatar TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'completed', 'removed')),
  views_count INT DEFAULT 0 CHECK (views_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_listings_seller ON public.product_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_status ON public.product_listings(status);
CREATE INDEX IF NOT EXISTS idx_product_listings_category ON public.product_listings(category);
CREATE INDEX IF NOT EXISTS idx_product_listings_created ON public.product_listings(created_at DESC);

DROP TRIGGER IF EXISTS trigger_product_listings_updated_at ON public.product_listings;
CREATE TRIGGER trigger_product_listings_updated_at
  BEFORE UPDATE ON public.product_listings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Backward compatibility view for legacy 'marketplace_listings' queries
CREATE OR REPLACE VIEW public.marketplace_listings AS
  SELECT * FROM public.product_listings;

-- ====================================================================
-- 7. LISTING_INQUIRIES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.listing_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.product_listings(id) ON DELETE CASCADE NOT NULL,
  listing_title TEXT NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  message TEXT NOT NULL,
  inquiry_type TEXT NOT NULL DEFAULT 'question' CHECK (inquiry_type IN ('question', 'offer', 'pickup_request')),
  proposed_price NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_listing_inquiries_listing ON public.listing_inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_inquiries_seller ON public.listing_inquiries(seller_id);
CREATE INDEX IF NOT EXISTS idx_listing_inquiries_buyer ON public.listing_inquiries(buyer_id);

-- Backward compatibility view
CREATE OR REPLACE VIEW public.marketplace_inquiries AS
  SELECT * FROM public.listing_inquiries;

-- ====================================================================
-- 8. REUSE_ACTIVITIES TABLE (EcoScore Verified Actions)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.reuse_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('reuse', 'repair', 'upcycle', 'donate', 'recycle')),
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  estimated_weight_kg NUMERIC(6, 2) DEFAULT 1.0 NOT NULL CHECK (estimated_weight_kg > 0),
  verification_status TEXT DEFAULT 'user_reported' NOT NULL CHECK (verification_status IN ('user_reported', 'photo_verified', 'community_confirmed')),
  proof_image_url TEXT,
  points_earned INT NOT NULL CHECK (points_earned >= 0),
  base_points INT NOT NULL CHECK (base_points >= 0),
  weight_points INT NOT NULL CHECK (weight_points >= 0),
  verification_bonus INT DEFAULT 0 NOT NULL CHECK (verification_bonus >= 0),
  illustrative_co2_kg NUMERIC(6, 2) DEFAULT 0 NOT NULL CHECK (illustrative_co2_kg >= 0),
  notes TEXT,
  confirmed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reuse_activities_user ON public.reuse_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_reuse_activities_type ON public.reuse_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_reuse_activities_confirmed ON public.reuse_activities(confirmed_at DESC);

-- Backward compatibility view
CREATE OR REPLACE VIEW public.ecoscore_activities AS
  SELECT * FROM public.reuse_activities;

-- ====================================================================
-- 9. COMMUNITY_POSTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_title TEXT DEFAULT 'Community Maker',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}'::text[] NOT NULL,
  primary_image TEXT NOT NULL,
  required_materials TEXT[] DEFAULT '{}'::text[] NOT NULL,
  instructions TEXT[] DEFAULT '{}'::text[] NOT NULL,
  difficulty TEXT DEFAULT 'Moderate' CHECK (difficulty IN ('Easy', 'Moderate', 'Advanced')),
  estimated_time TEXT DEFAULT '1 hr',
  likes_count INT DEFAULT 0 CHECK (likes_count >= 0),
  saves_count INT DEFAULT 0 CHECK (saves_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_cat ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON public.community_posts(created_at DESC);

DROP TRIGGER IF EXISTS trigger_community_posts_updated_at ON public.community_posts;
CREATE TRIGGER trigger_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ====================================================================
-- 10. POST_LIKES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.post_likes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);

-- Backward compatibility view
CREATE OR REPLACE VIEW public.community_post_likes AS
  SELECT * FROM public.post_likes;

-- ====================================================================
-- 11. SAVED_POSTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.saved_posts (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_posts_post ON public.saved_posts(post_id);

-- Backward compatibility view
CREATE OR REPLACE VIEW public.community_post_saves AS
  SELECT * FROM public.saved_posts;

-- ====================================================================
-- 12. CONTENT_REPORTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('community_post', 'product_listing', 'marketplace_listing')),
  content_id TEXT NOT NULL,
  content_title TEXT NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_email TEXT,
  reason TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_reports_status ON public.content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_type ON public.content_reports(content_type);

-- Backward compatibility view
CREATE OR REPLACE VIEW public.community_post_reports AS
  SELECT
    id,
    content_id AS post_id,
    content_title AS post_title,
    reporter_id,
    reason,
    details,
    created_at
  FROM public.content_reports
  WHERE content_type = 'community_post';

-- ====================================================================
-- STORAGE BUCKETS CONFIGURATION
-- ====================================================================
-- 1. profile-images
-- 2. product-images
-- 3. marketplace-images
-- 4. community-images

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('profile-images', 'profile-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('marketplace-images', 'marketplace-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('community-images', 'community-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- 1. profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Cannot elevate role to admin
    role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 2. product_analyses
ALTER TABLE public.product_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own product analyses" ON public.product_analyses;
CREATE POLICY "Users can view own product analyses"
  ON public.product_analyses FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can insert product analyses" ON public.product_analyses;
CREATE POLICY "Users can insert product analyses"
  ON public.product_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete own product analyses" ON public.product_analyses;
CREATE POLICY "Users can delete own product analyses"
  ON public.product_analyses FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 3. recommendations
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Recommendations are readable by everyone" ON public.recommendations;
CREATE POLICY "Recommendations are readable by everyone"
  ON public.recommendations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Recommendations can be created by authenticated users or system" ON public.recommendations;
CREATE POLICY "Recommendations can be created by authenticated users or system"
  ON public.recommendations FOR INSERT
  WITH CHECK (true);

-- 4. saved_recommendations
ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saved recommendations" ON public.saved_recommendations;
CREATE POLICY "Users can view own saved recommendations"
  ON public.saved_recommendations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save recommendations" ON public.saved_recommendations;
CREATE POLICY "Users can save recommendations"
  ON public.saved_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved recommendations" ON public.saved_recommendations;
CREATE POLICY "Users can delete own saved recommendations"
  ON public.saved_recommendations FOR DELETE
  USING (auth.uid() = user_id);

-- 5. reuse_ideas
ALTER TABLE public.reuse_ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reuse ideas are viewable by everyone" ON public.reuse_ideas;
CREATE POLICY "Reuse ideas are viewable by everyone"
  ON public.reuse_ideas FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can manage reuse ideas" ON public.reuse_ideas;
CREATE POLICY "Only admins can manage reuse ideas"
  ON public.reuse_ideas FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 6. product_listings
ALTER TABLE public.product_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active product listings are viewable by everyone" ON public.product_listings;
CREATE POLICY "Active product listings are viewable by everyone"
  ON public.product_listings FOR SELECT
  USING (status != 'removed' OR seller_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create listings" ON public.product_listings;
CREATE POLICY "Authenticated users can create listings"
  ON public.product_listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers and admins can update listings" ON public.product_listings;
CREATE POLICY "Sellers and admins can update listings"
  ON public.product_listings FOR UPDATE
  USING (auth.uid() = seller_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = seller_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Sellers and admins can delete listings" ON public.product_listings;
CREATE POLICY "Sellers and admins can delete listings"
  ON public.product_listings FOR DELETE
  USING (auth.uid() = seller_id OR public.is_admin(auth.uid()));

-- 7. listing_inquiries
ALTER TABLE public.listing_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only involved buyer, seller, or admin can view inquiries" ON public.listing_inquiries;
CREATE POLICY "Only involved buyer, seller, or admin can view inquiries"
  ON public.listing_inquiries FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can create inquiries" ON public.listing_inquiries;
CREATE POLICY "Users can create inquiries"
  ON public.listing_inquiries FOR INSERT
  WITH CHECK (auth.uid() = buyer_id OR buyer_id IS NULL);

DROP POLICY IF EXISTS "Inquiry participants can update inquiry status" ON public.listing_inquiries;
CREATE POLICY "Inquiry participants can update inquiry status"
  ON public.listing_inquiries FOR UPDATE
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id OR public.is_admin(auth.uid()));

-- 8. reuse_activities
ALTER TABLE public.reuse_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reuse activities" ON public.reuse_activities;
CREATE POLICY "Users can view own reuse activities"
  ON public.reuse_activities FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can record reuse activities" ON public.reuse_activities;
CREATE POLICY "Users can record reuse activities"
  ON public.reuse_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reuse activities" ON public.reuse_activities;
CREATE POLICY "Users can delete own reuse activities"
  ON public.reuse_activities FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 9. community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Community posts are viewable by everyone" ON public.community_posts;
CREATE POLICY "Community posts are viewable by everyone"
  ON public.community_posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create community posts" ON public.community_posts;
CREATE POLICY "Authenticated users can create community posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors and admins can update community posts" ON public.community_posts;
CREATE POLICY "Authors and admins can update community posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = author_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = author_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authors and admins can delete community posts" ON public.community_posts;
CREATE POLICY "Authors and admins can delete community posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = author_id OR public.is_admin(auth.uid()));

-- 10. post_likes
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Post likes are readable by everyone" ON public.post_likes;
CREATE POLICY "Post likes are readable by everyone"
  ON public.post_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.post_likes;
CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike posts" ON public.post_likes;
CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- 11. saved_posts
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saved posts" ON public.saved_posts;
CREATE POLICY "Users can view own saved posts"
  ON public.saved_posts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save posts" ON public.saved_posts;
CREATE POLICY "Users can save posts"
  ON public.saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave posts" ON public.saved_posts;
CREATE POLICY "Users can unsave posts"
  ON public.saved_posts FOR DELETE
  USING (auth.uid() = user_id);

-- 12. content_reports
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can submit content reports" ON public.content_reports;
CREATE POLICY "Users can submit content reports"
  ON public.content_reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL OR reporter_id IS NULL);

DROP POLICY IF EXISTS "Only staff admins can view and resolve reports" ON public.content_reports;
CREATE POLICY "Only staff admins can view and resolve reports"
  ON public.content_reports FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ====================================================================
-- STORAGE ACCESS POLICIES (storage.objects)
-- ====================================================================
DROP POLICY IF EXISTS "Public access to reuse images" ON storage.objects;
CREATE POLICY "Public access to reuse images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('profile-images', 'product-images', 'marketplace-images', 'community-images'));

DROP POLICY IF EXISTS "Authenticated users can upload reuse images" ON storage.objects;
CREATE POLICY "Authenticated users can upload reuse images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('profile-images', 'product-images', 'marketplace-images', 'community-images'));

DROP POLICY IF EXISTS "Users can update own uploaded images" ON storage.objects;
CREATE POLICY "Users can update own uploaded images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner);

DROP POLICY IF EXISTS "Users can delete own uploaded images" ON storage.objects;
CREATE POLICY "Users can delete own uploaded images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (auth.uid() = owner OR public.is_admin(auth.uid()));
