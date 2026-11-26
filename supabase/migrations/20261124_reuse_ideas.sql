-- ReUseHub Reuse Ideas and DIY Instructions Module Schema

create table if not exists public.reuse_ideas (
  id uuid default gen_random_uuid() primary key,
  project_title text not null,
  category text not null check (category in (
    'Clothing Upcycling',
    'Plastic Reuse',
    'Glass Reuse',
    'Paper Crafts',
    'Furniture Restoration',
    'Household Reuse',
    'Metal Reuse'
  )),
  before_product text not null,
  final_product text not null,
  description text not null,
  required_materials jsonb default '[]'::jsonb not null,
  tools_required jsonb default '[]'::jsonb not null,
  difficulty_level text not null check (difficulty_level in ('Easy', 'Moderate', 'Advanced')),
  estimated_completion_time text not null,
  step_by_step_instructions jsonb default '[]'::jsonb not null,
  safety_precautions jsonb default '[]'::jsonb not null,
  relevant_image text not null,
  co2_saved_kg numeric default 0,
  is_featured boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.reuse_ideas enable row level security;
create policy "Reuse ideas are viewable by everyone" on public.reuse_ideas for select using (true);

-- User Saved Ideas Table
create table if not exists public.user_saved_ideas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  idea_id uuid references public.reuse_ideas(id) on delete cascade not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique (user_id, idea_id)
);

alter table public.user_saved_ideas enable row level security;
create policy "Users can view own saved ideas" on public.user_saved_ideas for select using (auth.uid() = user_id);
create policy "Users can insert own saved ideas" on public.user_saved_ideas for insert with check (auth.uid() = user_id);
create policy "Users can delete own saved ideas" on public.user_saved_ideas for delete using (auth.uid() = user_id);

-- Seed Initial Comprehensive DIY Ideas (Including All 5 Prompt Examples)
insert into public.reuse_ideas (
  project_title, category, before_product, final_product, description,
  required_materials, tools_required, difficulty_level, estimated_completion_time,
  step_by_step_instructions, safety_precautions, relevant_image, co2_saved_kg, is_featured
) values
(
  'Reinforced Denim Market Tote Bag',
  'Clothing Upcycling',
  'Old Jeans',
  'Market Tote Bag',
  'Convert worn denim jeans into a rugged, high-capacity market tote bag with reinforced dual-shoulder straps and natural exterior organizer pockets.',
  '["1 pair of discarded denim jeans", "Heavy-duty polyester thread", "Sewing pins"]'::jsonb,
  '["Fabric shears", "Sewing machine or heavy needle", "Iron", "Ruler"]'::jsonb,
  'Moderate',
  '1.5 hrs',
  '[
    {"stepNumber": 1, "instruction": "Lay jeans flat and cut both legs off horizontally roughly 2 inches below the bottom of the back pockets."},
    {"stepNumber": 2, "instruction": "Turn the cropped shorts section inside-out. Align front and back hems and pin tightly along the bottom edge."},
    {"stepNumber": 3, "instruction": "Sew a double straight stitch across the bottom hem, reinforcing with a zig-zag stitch to prevent unravelling."},
    {"stepNumber": 4, "instruction": "Slice two 3-inch wide vertical strips from the leftover legs. Fold raw edges inward, press with an iron, and top-stitch to construct sturdy straps."},
    {"stepNumber": 5, "instruction": "Secure straps to the inside of the waistband with box-stitch squares for maximum load durability."}
  ]'::jsonb,
  '[
    "Work slowly when sewing over thick denim cross-seams to avoid breaking machine needles.",
    "Wear eye protection when operating high-speed sewing machines on multi-layered canvas."
  ]'::jsonb,
  'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
  11.5,
  true
),
(
  'Zero-Waste Airtight Pantry Storage Canisters',
  'Glass Reuse',
  'Glass Jars',
  'Airtight Storage Containers',
  'Strip stubborn commercial glue cleanly and sanitize assorted glass jars for aesthetic, non-toxic bulk food preservation and dry pantry organization.',
  '["Empty glass food jars with lids", "Baking soda", "Vegetable or olive oil", "Kraft paper tape"]'::jsonb,
  '["Scrub sponge", "Large cooking pot", "Tongs"]'::jsonb,
  'Easy',
  '25 mins',
  '[
    {"stepNumber": 1, "instruction": "Submerge jars and lids in warm water with dish soap for 20 minutes to soften paper labels."},
    {"stepNumber": 2, "instruction": "Peel paper. Mix equal parts baking soda and vegetable oil into a paste, spread over adhesive, and let sit for 10 minutes."},
    {"stepNumber": 3, "instruction": "Wipe with a sponge; adhesive will dissolve cleanly without toxic solvents. Wash with dish soap."},
    {"stepNumber": 4, "instruction": "Sterilize jars by boiling in clean water for 5 minutes and allow to air-dry completely."},
    {"stepNumber": 5, "instruction": "Label lids with chalk marker or recycled kraft tape for dry grains, coffee beans, or spices."}
  ]'::jsonb,
  '[
    "Never submerge cold glass into boiling water or vice versa to prevent thermal shock fracture.",
    "Inspect the jar rim for microscopic chips before storing food."
  ]'::jsonb,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  2.4,
  true
),
(
  'Capillary Self-Watering Herb Planter',
  'Plastic Reuse',
  'Plastic Bottles',
  'Self-Watering Planters',
  'Convert 2-liter PET beverage bottles into sub-irrigated self-watering hydroponic nursery pots ideal for windowsill basil, mint, or thyme.',
  '["Clean 2-liter plastic bottle", "Cotton string or braided wick (8 inches)", "Potting soil", "Herb seeds or cuttings"]'::jsonb,
  '["Utility knife or scissors", "Hole punch or nail", "Sandpaper"]'::jsonb,
  'Easy',
  '20 mins',
  '[
    {"stepNumber": 1, "instruction": "Clean bottle and cut horizontally roughly 4 inches from the base."},
    {"stepNumber": 2, "instruction": "Lightly sand cut edges with 120-grit sandpaper to remove any sharp plastic burrs."},
    {"stepNumber": 3, "instruction": "Pierce a 1/4 inch hole through the center of the plastic bottle cap."},
    {"stepNumber": 4, "instruction": "Thread the cotton wick through the cap hole, leaving 3 inches extending into the base reservoir and 3 inches inside the top funnel."},
    {"stepNumber": 5, "instruction": "Invert top funnel into the base. Fill top with moist potting mix, plant herb seeds, and fill base with water."}
  ]'::jsonb,
  '[
    "Always cut plastic away from your body on a stable cutting board to prevent blade slippage.",
    "Keep soil moist during initial germination until the capillary wick action establishes."
  ]'::jsonb,
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  0.9,
  true
),
(
  'Custom Desk & Drawer Compartment Organizers',
  'Paper Crafts',
  'Cardboard Boxes',
  'Desk & Drawer Organizers',
  'Transform corrugated shipping delivery boxes and cereal cartons into modular, custom-fitted drawer dividers and aesthetic desktop file organizers.',
  '["Corrugated delivery boxes or cereal boxes", "Kraft wrapping paper or fabric scraps", "Non-toxic PVA craft glue"]'::jsonb,
  '["Utility blade", "Metal safety ruler", "Pencil", "Binder clips"]'::jsonb,
  'Easy',
  '30 mins',
  '[
    {"stepNumber": 1, "instruction": "Measure drawer depth, width, and height with a ruler to calculate custom modular dimensions."},
    {"stepNumber": 2, "instruction": "Cut cardboard panels along measured lines using a metal ruler as a straightedge guide."},
    {"stepNumber": 3, "instruction": "Cut interlocking 1/2-depth vertical slots in cross-pieces to create modular grid compartments."},
    {"stepNumber": 4, "instruction": "Wrap exposed outer edges in reclaimed kraft paper with dilute PVA glue for a clean aesthetic finish."}
  ]'::jsonb,
  '[
    "Keep non-dominant fingers curled back behind the metal ruler when scoring corrugated cardboard with a utility knife."
  ]'::jsonb,
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  1.6,
  false
),
(
  'Rustic Garden Patio Lounge Furniture',
  'Furniture Restoration',
  'Wooden Pallets',
  'Patio Lounge Furniture',
  'Restore and join certified heat-treated shipping pallets to construct weather-resistant outdoor lounge benches, coffee tables, or vertical herb walls.',
  '["2-3 Heat-Treated (HT stamp) timber pallets", "3-inch exterior galvanized deck screws", "Natural linseed oil or exterior eco-stain"]'::jsonb,
  '["Random orbital sander (80 & 120 grit)", "Cordless drill & driver bits", "Pry bar", "Paintbrush"]'::jsonb,
  'Advanced',
  '3.0 hrs',
  '[
    {"stepNumber": 1, "instruction": "Verify pallet stamp has \"HT\" (Heat Treated) brand mark. Reject pallets marked \"MB\" (Methyl Bromide)."},
    {"stepNumber": 2, "instruction": "Inspect wood for protruding staples or nails and pull them clean with a pry bar."},
    {"stepNumber": 3, "instruction": "Thoroughly sand all exposed surfaces with 80-grit then 120-grit sandpaper until completely free of splinters."},
    {"stepNumber": 4, "instruction": "Stack two pallets for seat height. Anchor a third pallet vertically behind with deck screws to form the backrest."},
    {"stepNumber": 5, "instruction": "Apply two generous coats of boiled linseed oil or weather sealant and top with weatherproof cushions."}
  ]'::jsonb,
  '[
    "Always wear an N95 dust mask and eye goggles when sanding reclaimed wood.",
    "Verify structural integrity of cross-stringers to ensure safe human seating load."
  ]'::jsonb,
  'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
  32.0,
  true
),
(
  'Upcycled T-Shirt Yarn & Braided Plant Hanger',
  'Clothing Upcycling',
  'Old Cotton T-Shirt',
  'Braided Macrame Plant Hanger',
  'Cut worn cotton t-shirts into a continuous yarn spool and knot a bohemian macrame hanging cradle for indoor plants.',
  '["1-2 worn cotton t-shirts", "Metal ring or key ring", "Measuring tape"]'::jsonb,
  '["Sharp fabric scissors"]'::jsonb,
  'Easy',
  '45 mins',
  '[
    {"stepNumber": 1, "instruction": "Cut off sleeves and neckline. Cut horizontal 1-inch strips across the torso, stopping 1 inch before the side seam."},
    {"stepNumber": 2, "instruction": "Make diagonal cuts to connect strips into one continuous ribbon of jersey fabric."},
    {"stepNumber": 3, "instruction": "Pull the ribbon firmly through your hands; the edges will naturally curl inward to form rounded jersey yarn."},
    {"stepNumber": 4, "instruction": "Cut 8 equal 5-foot strands, loop through a metal ring, and tie square gathering knots to cradle a potted plant."}
  ]'::jsonb,
  '[
    "Test knot tension securely over a soft surface before hanging delicate ceramic pots."
  ]'::jsonb,
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  2.8,
  false
),
(
  'Restored Seasoned Cast Iron Skillet',
  'Metal Reuse',
  'Rusted Cast Iron Skillet',
  'Heirloom Seasoned Cookware',
  'Strip heavy rust and build a non-stick polymer seasoning patina to return neglected vintage cast iron cookware to daily kitchen service.',
  '["Rusted cast iron pan", "Coarse kosher salt", "Organic flaxseed or grapeseed oil", "Steel wool #00"]'::jsonb,
  '["Stiff bristle brush", "Cotton dish towels", "Oven"]'::jsonb,
  'Moderate',
  '2.0 hrs',
  '[
    {"stepNumber": 1, "instruction": "Scrub rusted areas vigorously with fine steel wool and warm soapy water until raw grey iron is visible."},
    {"stepNumber": 2, "instruction": "Rinse completely and dry immediately on a hot stovetop burner for 5 minutes to expel all residual moisture."},
    {"stepNumber": 3, "instruction": "Apply half a teaspoon of oil across all interior and exterior surfaces. Wipe aggressively until pan looks completely dry."},
    {"stepNumber": 4, "instruction": "Place upside-down in a 450°F (230°C) oven for 1 hour to polymerize the oil into durable non-stick seasoning."}
  ]'::jsonb,
  '[
    "Always handle hot cast iron with heavy-duty silicone oven mitts.",
    "Ensure kitchen is well ventilated during high-heat oil polymerization."
  ]'::jsonb,
  'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
  8.5,
  false
),
(
  'Upcycled Tin Can Herb & Cutlery Caddy',
  'Metal Reuse',
  'Tin Food Cans',
  'Rustic Herb & Cutlery Caddy',
  'Clean aluminum and steel food cans, smooth rim edges, and mount to a reclaimed wood handle for an outdoor utensil or garden tool carrier.',
  '["4-6 clean tin soup cans", "Reclaimed wood block (12x4x1 in)", "Leather or rope strap", "Small wood screws"]'::jsonb,
  '["Can opener with smooth edge", "Drill & metal bit", "Hammer & center punch", "Spray enamel (optional)"]'::jsonb,
  'Easy',
  '45 mins',
  '[
    {"stepNumber": 1, "instruction": "Remove labels and sanitize cans. Check interior rims with a wooden spoon to confirm no sharp metal burrs."},
    {"stepNumber": 2, "instruction": "Mark pilot holes near upper rim and drill 1/8-inch mounting holes."},
    {"stepNumber": 3, "instruction": "Mount cans in pairs on both sides of the central wooden block using 1/2-inch pan head screws."},
    {"stepNumber": 4, "instruction": "Attach a reclaimed leather strap to the top of the wooden spine for a portable picnic caddy."}
  ]'::jsonb,
  '[
    "Wear leather work gloves when handling cut metal edges.",
    "File down any interior burrs before daily handling."
  ]'::jsonb,
  'https://images.unsplash.com/photo-1584990347449-399086ec037a?auto=format&fit=crop&w=800&q=80',
  3.2,
  false
);
