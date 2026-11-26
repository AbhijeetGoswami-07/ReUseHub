-- ====================================================================
-- ReUseHub Marketplace Schema & Migration
-- Listing Types: Free Donation, Product Exchange, Sale
-- ====================================================================

-- 1. Create marketplace_listings table
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  material TEXT NOT NULL,
  condition TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('Free Donation', 'Product Exchange', 'Sale')),
  price NUMERIC(10, 2) DEFAULT 0,
  is_free BOOLEAN GENERATED ALWAYS AS (listing_type = 'Free Donation' OR price = 0) STORED,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_name TEXT NOT NULL,
  seller_avatar TEXT,
  seller_joined_date TEXT DEFAULT 'Nov 2026',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'completed')),
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create marketplace_inquiries table (protecting contact info)
CREATE TABLE IF NOT EXISTS public.marketplace_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  listing_title TEXT NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  message TEXT NOT NULL,
  inquiry_type TEXT NOT NULL DEFAULT 'question' CHECK (inquiry_type IN ('question', 'offer', 'pickup_request')),
  proposed_price NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create user_saved_listings table
CREATE TABLE IF NOT EXISTS public.user_saved_listings (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- 4. Create listing_reports table (reporting mechanism)
CREATE TABLE IF NOT EXISTS public.listing_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  listing_title TEXT NOT NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_email TEXT,
  reason TEXT NOT NULL CHECK (reason IN ('hazardous_material', 'fraud_scam', 'prohibited_item', 'inaccurate_description', 'other')),
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON public.marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_condition ON public.marketplace_listings(condition);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_listing_type ON public.marketplace_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_city ON public.marketplace_listings(city);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_inquiries_listing ON public.marketplace_inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_inquiries_seller ON public.marketplace_inquiries(seller_id);

-- Enable Row Level Security
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_listings
-- Anyone can view active listings
CREATE POLICY "Anyone can view active marketplace listings"
  ON public.marketplace_listings FOR SELECT
  USING (status != 'deleted');

-- Authenticated users can insert listings
CREATE POLICY "Users can create listings"
  ON public.marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

-- Users can only update their own listings (SECURITY)
CREATE POLICY "Users can update their own listings"
  ON public.marketplace_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Users can only delete their own listings (SECURITY)
CREATE POLICY "Users can delete their own listings"
  ON public.marketplace_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- RLS Policies for marketplace_inquiries
CREATE POLICY "Users can view inquiries they sent or received"
  ON public.marketplace_inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Anyone can submit an inquiry"
  ON public.marketplace_inquiries FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user_saved_listings
CREATE POLICY "Users can manage their saved listings"
  ON public.user_saved_listings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for listing_reports
CREATE POLICY "Anyone can submit a listing report"
  ON public.listing_reports FOR INSERT
  WITH CHECK (true);

-- ====================================================================
-- SEED DATA: Realistic listings across Free Donation, Exchange, and Sale
-- ====================================================================

INSERT INTO public.marketplace_listings (
  product_name,
  description,
  category,
  material,
  condition,
  images,
  image_url,
  listing_type,
  price,
  city,
  state,
  seller_name,
  seller_avatar,
  seller_joined_date,
  status
) VALUES
(
  'Solid Pine Study Desk & Drawer Organizer',
  'Sturdy solid pine wood desk with two smooth-sliding side drawers. Clean structural condition with minor cosmetic lacquer wear on the tabletop, easily refreshed with light sanding or mineral oil. Great for students or home office.',
  'Furniture',
  'Wood',
  'Good',
  ARRAY[
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
  'Free Donation',
  0,
  'Seattle',
  'WA',
  'Elena Rostova',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Oct 2025',
  'active'
),
(
  'Tactile Mechanical Keyboard (Needs USB-C Solder)',
  'Keychron tenkeyless mechanical keyboard featuring tactile brown switches and double-shot PBT keycaps. Keyboard is fully functional, but the female USB-C daughterboard socket has a loose joint and needs a 5-minute re-solder. Looking to trade for studio cables or audio accessories.',
  'Electronics',
  'Electronic Components',
  'Needs Repair',
  ARRAY[
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  'Product Exchange',
  0,
  'San Francisco',
  'CA',
  'Marcus Chen',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'Jan 2026',
  'active'
),
(
  'Handmade Terracotta & Ceramic Planters (Set of 4)',
  'Four clean terracotta and glazed stoneware plant pots ranging from 6 to 10 inches in diameter. All have baseline drainage holes and matching catch saucers. Perfect for balcony herb gardens, monsteras, or succulent arrangements.',
  'Household Items',
  'Glass',
  'Like New',
  ARRAY[
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
  'Sale',
  18.00,
  'Portland',
  'OR',
  'Sarah Jenkins',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'Feb 2026',
  'active'
),
(
  'Reclaimed Heavy Denim Fabric Rolls (6kg Craft Scraps)',
  'Assorted bundles of clean 100% cotton denim fabric offcuts, selvedge strips, and leg remnants. Ideal for sewing rugged market tote bags, patchwork quilts, work aprons, or upholstery cushion covers. Offered completely free to local craft students.',
  'Clothing',
  'Cotton',
  'Good',
  ARRAY[
    'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
  'Free Donation',
  0,
  'Austin',
  'TX',
  'Liam O\'Connor',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'Mar 2026',
  'active'
),
(
  'Vintage Steel Frame Road Bicycle (Needs Inner Tubes)',
  'Classic 10-speed steel frame commuter bicycle. Frame and gear cables in sound mechanical order. Needs new 700c inner tubes and handlebar grip tape. Willing to sell affordably or trade for woodworking hand tools.',
  'Metal',
  'Metal',
  'Needs Repair',
  ARRAY[
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
  'Sale',
  35.00,
  'Denver',
  'CO',
  'Maya Patel',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'Dec 2025',
  'active'
),
(
  'Heavy Corrugated Storage Boxes & Bubble Wrap (25-Pack)',
  'Double-walled corrugated delivery boxes folded flat and pristine bubble wrap surplus from a recent studio relocation. Stored dry and clean. Ready for someone preparing for a home move or small business shipping.',
  'Paper',
  'Paper',
  'Like New',
  ARRAY[
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  'Product Exchange',
  0,
  'Chicago',
  'IL',
  'David Kim',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'Apr 2026',
  'active'
)
ON CONFLICT DO NOTHING;
