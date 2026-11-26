-- ====================================================================
-- ReUseHub Community Section Migration
-- Community Posts, Likes, Saves, and Content Moderation Reports
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_title TEXT DEFAULT 'Community Maker',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  primary_image TEXT NOT NULL,
  required_materials TEXT[] NOT NULL DEFAULT '{}',
  instructions TEXT[] NOT NULL DEFAULT '{}',
  difficulty TEXT DEFAULT 'Moderate' CHECK (difficulty IN ('Easy', 'Moderate', 'Advanced')),
  estimated_time TEXT DEFAULT '1 hr',
  likes_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_post_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS public.community_post_saves (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS public.community_post_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  post_title TEXT NOT NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL CHECK (reason IN ('inappropriate_content', 'spam_promotional', 'dangerous_practice', 'copyright_plagiarism', 'other')),
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON public.community_posts(created_at);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_reports ENABLE ROW LEVEL SECURITY;

-- Policies for community_posts
CREATE POLICY "Anyone can view community posts"
  ON public.community_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON public.community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
  ON public.community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Policies for likes
CREATE POLICY "Users can view and manage their likes"
  ON public.community_post_likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for saves
CREATE POLICY "Users can view and manage their saved posts"
  ON public.community_post_saves FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for reports
CREATE POLICY "Anyone can submit a moderation report"
  ON public.community_post_reports FOR INSERT
  WITH CHECK (true);

-- ====================================================================
-- SEED DATA: Inspiring Maker Projects
-- ====================================================================

INSERT INTO public.community_posts (
  author_name,
  author_avatar,
  author_title,
  title,
  description,
  category,
  images,
  primary_image,
  required_materials,
  instructions,
  difficulty,
  estimated_time,
  likes_count,
  saves_count
) VALUES
(
  'Maya Lin',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'Woodworking & Upcycle Mentor',
  'Reclaimed Pallet Wood Vertical Herb Garden Planter',
  'Turned discarded shipping pallet timber into a space-efficient 4-tiered vertical wall planter for kitchen basil, rosemary, and mint. Perfect for small apartment balconies or urban courtyards.',
  'Furniture',
  ARRAY[
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    '1 heat-treated wooden pallet (look for HT stamp)',
    '1 roll landscape weed fabric',
    'Heavy duty staple gun & 10mm staples',
    '120-grit sandpaper',
    'Organic potting soil & herb seedlings'
  ],
  ARRAY[
    'Inspect pallet for HT (heat-treated) brand; avoid chemically fumigated (MB) pallets.',
    'Sand all exterior slats and edges thoroughly to prevent splinters.',
    'Fasten breathable landscape fabric across the back, sides, and bottom of each trough using staples spaced 2 inches apart.',
    'Fill each tier with nutrient-rich compost potting soil, packing gently.',
    'Plant herb starts closely together and water thoroughly until water trickles through drainage pores.'
  ],
  'Moderate',
  '2 hrs',
  42,
  18
),
(
  'David Kim',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'Zero-Waste Designer',
  'Zero-Waste Denim Studio Apron with Chest Pocket',
  'Constructed a rugged workshop apron out of two pairs of worn-out denim jeans with shredded knees. Leveraged original back pockets for holding screwdrivers, pencils, and shears.',
  'Clothing',
  ARRAY[
    'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    '2 pairs of discarded denim jeans',
    'Heavy-duty polyester thread',
    'Fabric shears or rotary cutter',
    'Sewing machine or denim hand needle',
    'Cotton twill tape (optional for neck strap)'
  ],
  ARRAY[
    'Cut off jean legs and slit the inner inseams flat to create large fabric panels.',
    'Trim main front bib and apron skirt to length, angling sides inward toward the chest.',
    'Topstitch the back pocket cut from the original jeans directly onto the center chest.',
    'Slice 2-inch wide vertical strips from leftover pant hems to construct durable neck and waist ties.',
    'Reinforce all strap connection points with square box-and-cross stitching for workshop longevity.'
  ],
  'Moderate',
  '2.5 hrs',
  57,
  24
),
(
  'Elena Rostova',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Eco-Craft Enthusiast',
  'Rustic Mason Jar Sconce Chandelier with Fairy Lights',
  'Repurposed 3 salsa jars and an old oak floorboard offcut into a warm, battery-operated rustic wall sconce that creates a cosy reading ambiance without any electrical mains wiring.',
  'Glass',
  ARRAY[
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    '3 cleaned glass food jars with lids',
    'Reclaimed hardwood plank (24 inches)',
    'Jute twine cord or iron pipe clamps',
    '3 sets of warm white LED micro fairy lights with timer',
    'Sawtooth picture hangers'
  ],
  ARRAY[
    'Submerge jars in warm water and baking soda paste to dissolve label glue completely.',
    'Sand and oil the reclaimed wood plank to showcase its natural grain.',
    'Fasten iron pipe clamps or wrap jute twine tightly around jar necks and mount to wood backing.',
    'Coil fairy light strings into each jar and conceal small battery packs behind the board.',
    'Mount securely using wall anchors and set automatic 6-hour evening timer.'
  ],
  'Easy',
  '1 hr',
  38,
  15
),
(
  'Marcus Chen',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'Hardware Hacker & Maker',
  'Upcycled E-Waste Motherboard Desk Clock',
  'Turned a fried computer motherboard from an old server chassis into a precision quartz desk clock. A geeky conversation piece that celebrates industrial tech aesthetics while diverting toxic e-waste.',
  'Electronics',
  ARRAY[
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'Decommissioned computer motherboard or graphics card',
    'High-torque quartz clock movement mechanism ($4 kit)',
    'Gold or contrasting clock hands',
    'Acrylic sheet stand or mini wooden easel'
  ],
  ARRAY[
    'Clean motherboard with 99% isopropyl alcohol and soft antistatic brush.',
    'Locate center CPU socket area or drill a clean 5/16-inch hole using high-speed drill bit.',
    'Mount quartz movement shaft from the back and secure brass washer and hex nut.',
    'Press hour, minute, and second hands gently into place at the 12 o’clock orientation.',
    'Insert AA battery and stand upright on acrylic display easel.'
  ],
  'Easy',
  '45 mins',
  63,
  31
),
(
  'Sarah Jenkins',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'Sustainable Living Educator',
  'Self-Watering Sub-Irrigated Herb Planters from PET Bottles',
  'Made 6 self-watering seedling starters using clear plastic water bottles and natural cotton macrame wicks. Great educational STEM project to do with kids that saves countless hours of daily watering.',
  'Plastic',
  ARRAY[
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  ],
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'Clean 1-liter or 2-liter clear plastic beverage bottles',
    'Cotton rope or candle wick (8 inches per planter)',
    'Sandpaper or masking tape for smooth rim edge',
    'Potting mix with vermiculite & basil/thyme seeds'
  ],
  ARRAY[
    'Cut bottle horizontally into two parts roughly 4 inches from the base.',
    'Sand cut edges with 120-grit paper to remove any sharp plastic edge burrs.',
    'Pierce a 1/4-inch hole through the plastic cap and thread cotton wick through.',
    'Invert top funnel into the base water reservoir and fill top with moist potting soil.',
    'Pour water into base reservoir; capillary action draws moisture automatically up to plant roots.'
  ],
  'Easy',
  '30 mins',
  29,
  12
)
ON CONFLICT DO NOTHING;
