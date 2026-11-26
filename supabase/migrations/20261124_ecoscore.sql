-- ====================================================================
-- ReUseHub EcoScore System Migration
-- Documented Points-Based Scoring & Transparent Verification
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.ecoscore_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('reuse', 'repair', 'upcycle', 'donate', 'recycle')),
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  estimated_weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 1.0,
  verification_status TEXT NOT NULL DEFAULT 'user_reported' CHECK (verification_status IN ('user_reported', 'photo_verified', 'community_confirmed')),
  proof_image_url TEXT,
  points_earned INT NOT NULL,
  base_points INT NOT NULL,
  weight_points INT NOT NULL,
  verification_bonus INT NOT NULL DEFAULT 0,
  illustrative_co2_kg NUMERIC(6, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  confirmed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ecoscore_activities_user ON public.ecoscore_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_ecoscore_activities_confirmed ON public.ecoscore_activities(confirmed_at);
CREATE INDEX IF NOT EXISTS idx_ecoscore_activities_type ON public.ecoscore_activities(activity_type);

-- Row Level Security (RLS)
ALTER TABLE public.ecoscore_activities ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own activities
CREATE POLICY "Users can view their own EcoScore activities"
  ON public.ecoscore_activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own activities
CREATE POLICY "Users can insert their own EcoScore activities"
  ON public.ecoscore_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own activities
CREATE POLICY "Users can delete their own EcoScore activities"
  ON public.ecoscore_activities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ====================================================================
-- Seed Initial Documented Activities for Demo
-- ====================================================================
INSERT INTO public.ecoscore_activities (
  activity_type,
  product_name,
  product_category,
  estimated_weight_kg,
  verification_status,
  proof_image_url,
  points_earned,
  base_points,
  weight_points,
  verification_bonus,
  illustrative_co2_kg,
  notes,
  confirmed_at
) VALUES
(
  'repair',
  'Wobbly Solid Oak Dining Chair',
  'Furniture',
  8.00,
  'photo_verified',
  'https://images.unsplash.com/photo-1580481077195-c99026a0f443?auto=format&fit=crop&w=600&q=80',
  145, -- 50 base + (8.0 * 10) + 15 photo verified
  50,
  80,
  15,
  14.50,
  'Injected wood glue and tapped hardwood dowel pin. Fully restored structural rigidity.',
  NOW() - INTERVAL '4 days'
),
(
  'upcycle',
  'Torn Cotton Denim Work Jeans',
  'Clothing',
  1.20,
  'photo_verified',
  'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
  71, -- 45 base + (1.2 * 9 = 11) + 15 photo verified
  45,
  11,
  15,
  11.50,
  'Converted cropped jeans panels into reinforced dual-shoulder market tote bag.',
  NOW() - INTERVAL '2 days'
),
(
  'reuse',
  'Glass Food Jars (Set of 6)',
  'Glass',
  1.80,
  'user_reported',
  NULL,
  54, -- 40 base + (1.8 * 8 = 14) + 0 user reported
  40,
  14,
  0,
  2.40,
  'Stripped stubborn labels using baking soda paste and sanitized for bulk pantry storage.',
  NOW() - INTERVAL '1 day'
),
(
  'donate',
  'Clean Winter Fleece Jacket',
  'Clothing',
  0.80,
  'community_confirmed',
  NULL,
  66, -- 35 base + (0.8 * 7 = 6) + 25 community confirmed
  35,
  6,
  25,
  8.20,
  'Donated to community winter shelter via neighborhood circular drop-off center.',
  NOW() - INTERVAL '10 hours'
)
ON CONFLICT DO NOTHING;
