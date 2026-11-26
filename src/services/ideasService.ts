import { DIYInstructionIdea, DIYCategory, DIYDifficulty } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

// Embedded initial seed data matching the database schema
export const INITIAL_DIY_IDEAS: DIYInstructionIdea[] = [
  // 1. SPEC EXAMPLE 1: Old jeans into a denim tote bag (5 steps)
  {
    id: 'idea-jeans-tote',
    projectTitle: 'Reinforced Denim Market Tote Bag',
    category: 'Clothing Upcycling',
    beforeProduct: 'Old Jeans',
    finalProduct: 'Durable Denim Market Tote',
    description: 'Upcycle worn-out cotton denim jeans into a lifetime-guaranteed heavy-duty market tote bag with reinforced dual-shoulder straps and natural exterior organizer pockets.',
    requiredMaterials: [
      'Pair of worn adult denim jeans (100% cotton preferred)',
      'Heavy-duty polyester thread (#40 or top-stitch)',
      'Denim machine needle (size 100/16 or 110/18)',
      'Sewing pins and tailors chalk',
    ],
    toolsRequired: [
      'Heavy-duty fabric shears or rotary cutter',
      'Sewing machine with zigzag stitch capability',
      'Clear acrylic quilting ruler or measuring tape',
      'Steam iron and pressing cloth',
    ],
    difficultyLevel: 'Moderate',
    estimatedCompletionTime: '1.5 hrs',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Cut the Jeans Horizontally',
        instruction: 'Lay the jeans flat on a smooth cutting surface and cut both legs horizontally approximately 2 inches below the bottom of the back pockets.',
        diagramKey: 'jeans-step-1',
        diagramType: 'cut',
        diagramNote: 'Ensure the front and back pocket bags are smoothed completely flat before making the horizontal cut. Save the severed pant legs for constructing straps in Step 4.',
        measurements: ['Cut line: ~2 inches (5 cm) below back pockets', 'Maintain 90-degree square angle to outer side seams'],
        labels: ['Bag Body (Upper)', 'Cutting Line (Red Dashed)', 'Fabric Shears', 'Leg Remnants (Save for Straps)'],
        requiredTools: ['Heavy-duty fabric shears', 'Acrylic ruler', 'Tailors chalk'],
        requiredMaterials: ['Old denim jeans'],
        safetyWarning: 'Cut away from your body on a self-healing mat. Keep non-cutting fingers behind the blade line.',
        tip: 'Check your measurements and fabric alignment carefully before cutting, because jeans sizes and pocket angles vary by brand.',
      },
      {
        stepNumber: 2,
        title: 'Turn Inside Out and Align Bottom',
        instruction: 'Turn the cropped jeans section inside out. Align the front and back raw fabric edges evenly along the bottom and pin securely every 1 inch.',
        diagramKey: 'jeans-step-2',
        diagramType: 'fold',
        diagramNote: 'Match the center crotch seams and both side seams to ensure an even rectangular tote bottom. Press the pinned seam flat with steam.',
        measurements: ['Sewing pins spaced every 1 inch (2.5 cm)', 'Seam allowance: 1/2 inch (1.3 cm)'],
        labels: ['Inside-Out Denim', 'Pocket Linings (Exposed)', 'Aligned Bottom Edges', 'Sewing Pins'],
        requiredTools: ['Sewing pins or fabric wonder-clips', 'Steam iron'],
        requiredMaterials: ['Cropped jeans body'],
        tip: 'If the center crotch seam is excessively thick, gently tap it with a rubber mallet to compress the fibers before sewing.',
      },
      {
        stepNumber: 3,
        title: 'Sew the Bottom Seam with Reinforcement',
        instruction: 'Sew across the aligned bottom edge using a straight stitch 1/2 inch from the raw edge. Reinforce the seam with an additional zigzag stitch along the edge to prevent fraying.',
        diagramKey: 'jeans-step-3',
        diagramType: 'stitch',
        diagramNote: 'Use a heavy-duty denim needle (size 100/16 or 110/18) and high-tensile polyester thread to prevent thread breakage under shopping loads.',
        measurements: ['Seam allowance: 1/2 inch (1.3 cm)', 'Straight stitch length: 3.0 to 3.5 mm', 'Reinforcement zigzag width: 4.0 mm'],
        labels: ['Seam Allowance Line (1/2")', 'Primary Straight Stitch', 'Secondary Overcast Zigzag Stitch', 'Sewing Direction Arrow'],
        requiredTools: ['Sewing machine with denim needle', 'Fabric scissors'],
        requiredMaterials: ['Heavy-duty polyester thread (#40 weight)'],
        safetyWarning: 'Keep fingers at least 1 inch away from the sewing machine needle. Turn the handwheel manually when sewing over thick cross-seams.',
        tip: 'Backstitch 4-5 times at both ends of the seam to lock the high-stress corner threads permanently.',
      },
      {
        stepNumber: 4,
        title: 'Cut & Construct Sturdy Straps',
        instruction: 'Cut two 3-inch-wide vertical strips from the leftover legs. Fold both raw outer edges 0.5 inches inward toward the center, press with an iron, fold in half lengthwise, and edge-stitch.',
        diagramKey: 'jeans-step-4',
        diagramType: 'fold',
        diagramNote: 'This 4-layer fold hides all raw denim edges and yields two rugged 1-inch-wide handles capable of carrying heavy grocery loads.',
        measurements: ['Strap strip width: 3 inches (7.5 cm)', 'Strap length: 24 to 28 inches (60-70 cm)', 'Finished strap width: 1 inch (2.5 cm)'],
        labels: ['Leftover Pant Leg', '3" Cutting Guidelines', 'Raw Edges Folded Inward (0.5")', 'Dual Edge Topstitching (1/8")'],
        requiredTools: ['Rotary cutter or shears', 'Steam iron and ironing board', 'Sewing machine'],
        requiredMaterials: ['Severed pant legs', 'Matching denim thread'],
        tip: 'Use steam liberally while pressing folds into heavy cotton denim to set permanent creases that make sewing easy.',
      },
      {
        stepNumber: 5,
        title: 'Attach Straps with Reinforced Box-X Stitch',
        instruction: 'Attach both straps to the inside of the waistband, spacing handle ends approximately 6 inches apart. Secure each anchor with a 1-inch Box-X reinforcement stitch pattern.',
        diagramKey: 'jeans-step-5',
        diagramType: 'assemble',
        diagramNote: 'The Box-X pattern distributes pulling tension diagonally across the reinforced waistband fabric, preventing rips even under 30+ lbs of groceries.',
        measurements: ['Handle spacing: ~6 inches (15 cm) apart', 'Waistband insertion depth: 1.5 inches (4 cm)', 'Box-X dimension: 1" x 1" square'],
        labels: ['Bag Opening (Top View)', 'Waistband Attachment Point', 'Dual Handles (6" Spacing)', 'Box-X Reinforcement Stitch'],
        requiredTools: ['Sewing machine', 'Sewing pins or wonder clips', 'Measuring tape'],
        requiredMaterials: ['Finished bag body', 'Two finished handles'],
        safetyWarning: 'Slow down machine speed when piercing through both the waistband and strap layers simultaneously.',
        tip: 'Turn the bag right side out and inspect all seams under light tension before loading with heavy goods.',
      },
    ],
    safetyPrecautions: [
      'Always cut away from your body when using shears or rotary cutters on multi-layered denim.',
      'Work slowly when sewing over thick denim cross-seams to avoid breaking machine needles.',
      'Wear eye protection when operating high-speed sewing machines on multi-layered canvas.',
      'These instructions are illustrative guides. Always verify measurements and fabric condition before cutting, as jeans sizing, seam density, and denim weight vary.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 11.5,
    isFeatured: true,
  },
  // 2. Glass Jars into Airtight Storage Containers (5 steps)
  {
    id: 'idea-glass-pantry',
    projectTitle: 'Zero-Waste Airtight Pantry Storage Canisters',
    category: 'Glass Reuse',
    beforeProduct: 'Glass Jars',
    finalProduct: 'Airtight Storage Containers',
    description: 'Strip stubborn commercial glue cleanly and sanitize assorted glass jars for aesthetic, non-toxic bulk food preservation and dry pantry organization.',
    requiredMaterials: [
      'Empty glass food jars with intact metal lids',
      'Baking soda (sodium bicarbonate)',
      'Vegetable, olive, or mineral oil',
      'Kraft paper tape or chalkboard labels',
    ],
    toolsRequired: [
      'Scrub sponge or dish brush',
      'Large boiling stockpot',
      'Silicone tongs or jar lifter',
      'Chalk marker or permanent pen',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '25 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Warm Water Adhesive Softening',
        instruction: 'Submerge glass jars and metal lids in hot tap water with a few drops of dish soap for 20 minutes to soften exterior paper labels and glue backing.',
        diagramKey: 'glass-step-1',
        diagramType: 'clean',
        diagramNote: 'Soak jars completely submerged in hot soapy water.',
        measurements: ['Soak duration: 20 minutes in warm water (45-50°C)'],
        labels: ['Water Basin', 'Commercial Paper Label', 'Dish Soap Bubbles'],
        requiredTools: ['Sink basin or large pot'],
        requiredMaterials: ['Warm water', 'Dish soap'],
        tip: 'Hot water penetrates paper labels and dissolves water-soluble adhesives naturally.',
      },
      {
        stepNumber: 2,
        title: 'Apply Baking Soda & Oil Paste',
        instruction: 'Peel off the wet paper label. Mix equal parts baking soda and vegetable oil into a thick paste, spread generously over residual glue, and let sit for 10 minutes.',
        diagramKey: 'glass-step-2',
        diagramType: 'clean',
        diagramNote: 'Baking soda provides gentle non-scratch abrasion while oil dissolves commercial adhesive tack.',
        measurements: ['1:1 Ratio: 1 tbsp baking soda + 1 tbsp vegetable oil', 'Rest time: 10 minutes'],
        labels: ['1:1 Paste Mix', 'Sticky Adhesive Spot', 'Application Spatula'],
        requiredTools: ['Small mixing bowl', 'Spoon'],
        requiredMaterials: ['Baking soda', 'Vegetable oil'],
        tip: 'The oil dissolves petroleum-based tackifiers while baking soda gently lifts the glue without scratching the glass.',
      },
      {
        stepNumber: 3,
        title: 'Wipe Clean & Wash Degreaser',
        instruction: 'Scrub the jar with a dish sponge; the adhesive will wipe off completely. Wash with warm water and dish soap to remove all oil residue.',
        diagramKey: 'glass-step-3',
        diagramType: 'clean',
        diagramNote: 'Wipe in circular motions. Adhesive lifts effortlessly without harsh chemical solvents.',
        labels: ['Running Water Stream', 'Scrub Sponge', 'Crystal Clear Glass'],
        requiredTools: ['Scrub sponge'],
        requiredMaterials: ['Warm soapy water'],
        safetyWarning: 'Be cautious of slippery glass when washing soapy jars.',
      },
      {
        stepNumber: 4,
        title: 'Thermal Sterilization',
        instruction: 'Sterilize clean glass jars by boiling them in clean water for 5 minutes (or run through a high-heat dishwasher sanitize cycle). Allow to air dry completely on a clean towel.',
        diagramKey: 'glass-step-4',
        diagramType: 'finish',
        diagramNote: 'Boil for 5 minutes. Use tongs to lift hot jars onto a clean cooling rack.',
        measurements: ['5 minutes boil time at 100°C (212°F)'],
        labels: ['Boiling Stockpot (100°C)', 'Submerged Jars & Lids', 'Silicone Tongs'],
        requiredTools: ['Large pot', 'Silicone tongs'],
        requiredMaterials: ['Clean water', 'Drying towel'],
        safetyWarning: 'Never place cold jars into boiling water or hot jars onto cold surfaces to prevent thermal shock breakage.',
      },
      {
        stepNumber: 5,
        title: 'Airtight Sealing & Pantry Labeling',
        instruction: 'Ensure silicone lid seals are intact. Label the jar lids with chalk markers or kraft tape for dry bulk grains, coffee beans, spices, or homemade preserves.',
        diagramKey: 'glass-step-5',
        diagramType: 'finish',
        diagramNote: 'Inspect rubber/silicone rim seals to guarantee airtight moisture protection.',
        labels: ['Silicone Gasket Seal', 'Airtight Glass Body', 'Chalkboard Kraft Label'],
        requiredTools: ['Chalk marker or kraft tape'],
        requiredMaterials: ['Sanitized jars', 'Bulk dry pantry food'],
        tip: 'Airtight glass keeps spices and coffee fresh 3x longer than original retail plastic pouches.',
      },
    ],
    safetyPrecautions: [
      'Never submerge cold glass into boiling water or vice versa to prevent thermal shock fracture.',
      'Inspect the jar rim for microscopic chips before storing food.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 2.4,
    isFeatured: true,
  },
  // 3. Plastic Bottles into Self-Watering Planters (5 steps)
  {
    id: 'idea-plastic-planter',
    projectTitle: 'Capillary Self-Watering Herb Planter',
    category: 'Plastic Reuse',
    beforeProduct: 'Plastic Bottles',
    finalProduct: 'Self-Watering Planters',
    description: 'Convert 2-liter PET beverage bottles into sub-irrigated self-watering hydroponic nursery pots ideal for windowsill basil, mint, or thyme.',
    requiredMaterials: [
      'Clean 2-liter plastic bottle (clear or translucent)',
      'Natural cotton string or braided wick (8 inches)',
      'High-drainage organic potting soil',
      'Herb seeds or rooted cuttings (basil, mint, parsley)',
    ],
    toolsRequired: [
      'Utility knife or heavy-duty scissors',
      'Awl, nail with pliers, or small 1/4" drill bit',
      '120-grit fine sandpaper',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '20 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Cut Bottle into Funnel and Reservoir',
        instruction: 'Rinse the 2-liter bottle thoroughly. Cut horizontally around the circumference approximately 4 inches from the base using a utility knife or shears.',
        diagramKey: 'bottle-planter-1',
        diagramType: 'cut',
        diagramNote: 'Cut ~4 inches (10 cm) from the base. The top becomes the planting funnel and the bottom becomes the water reservoir.',
        measurements: ['Cut 4 inches (10 cm) from base'],
        labels: ['Top Planting Funnel', 'Base Water Reservoir', 'Circumference Cut Line'],
        requiredTools: ['Utility knife or scissors'],
        requiredMaterials: ['Clean 2L PET bottle'],
        safetyWarning: 'Always cut away from your body on a cutting mat. Keep hands behind the cutting direction.',
      },
      {
        stepNumber: 2,
        title: 'Smooth Cut Edges',
        instruction: 'Lightly rub the cut edges with fine 120-grit sandpaper or cover with a strip of masking tape to remove any sharp plastic burrs.',
        diagramKey: 'bottle-planter-2',
        diagramType: 'sand',
        diagramNote: 'Smooth edges prevent skin scrapes during routine plant care and watering.',
        labels: ['Cut Plastic Rim', '120-Grit Sandpaper Block', 'Smooth Protective Edge'],
        requiredTools: ['120-grit sandpaper'],
        safetyWarning: 'Wear safety glasses when sanding small plastic parts.',
      },
      {
        stepNumber: 3,
        title: 'Pierce Cap for Capillary Wick',
        instruction: 'Pierce a 1/4-inch hole through the center of the plastic bottle cap using a heated nail, awl, or small drill bit.',
        diagramKey: 'bottle-planter-3',
        diagramType: 'drill',
        diagramNote: 'Hole should be just wide enough for the braided cotton wick to thread snugly.',
        measurements: ['1/4 inch (6 mm) diameter center hole'],
        labels: ['Screw Cap', '1/4" Center Hole', 'Punch/Drill Bit'],
        requiredTools: ['Awl, drill, or nail with pliers'],
        safetyWarning: 'Hold cap securely with pliers if using a heated nail. Never hold hot metal with bare hands.',
      },
      {
        stepNumber: 4,
        title: 'Thread Wick and Nest Funnel',
        instruction: 'Thread an 8-inch cotton cord through the cap hole, leaving 3 inches extending into the base reservoir and 4 inches inside the inverted top funnel.',
        diagramKey: 'bottle-planter-4',
        diagramType: 'assemble',
        diagramNote: 'Cotton wick transfers water continuously from base reservoir into soil via capillary suction.',
        measurements: ['8 inches (20 cm) braided cotton wick', '3" in reservoir, 4" in soil'],
        labels: ['Cotton Wick Knot', 'Inverted Funnel', 'Base Water Reservoir'],
        requiredTools: ['Scissors'],
        requiredMaterials: ['Cotton wick or thick mop cord'],
        tip: 'Natural cotton wicks water efficiently; avoid synthetic polyester cords which repel moisture.',
      },
      {
        stepNumber: 5,
        title: 'Add Soil, Seeds, and Fill Reservoir',
        instruction: 'Invert the top funnel into the base. Fill the top with nutrient-rich potting soil, plant herb seeds, and fill the base reservoir with fresh water.',
        diagramKey: 'bottle-planter-5',
        diagramType: 'finish',
        diagramNote: 'Keep reservoir filled 1 inch below the funnel rim. Refill every 7-10 days.',
        labels: ['Sub-Irrigated Soil', 'Capillary Wick', 'Herb Sprout', 'Water Reservoir Level'],
        requiredMaterials: ['Organic potting soil', 'Herb seeds (basil, mint, parsley)', 'Fresh water'],
        tip: 'Self-watering planters reduce plant moisture stress and eliminate root rot caused by overwatering.',
      },
    ],
    safetyPrecautions: [
      'Always cut plastic away from your body on a stable cutting board to prevent blade slippage.',
      'Keep soil moist during initial germination until the capillary wick action establishes.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 0.9,
    isFeatured: true,
  },
  // 4. Cardboard Delivery Boxes into Modular Desk Organizers (4 steps)
  {
    id: 'idea-cardboard-organizer',
    projectTitle: 'Custom Desk & Drawer Compartment Organizers',
    category: 'Paper Crafts',
    beforeProduct: 'Cardboard Boxes',
    finalProduct: 'Desk & Drawer Organizers',
    description: 'Transform corrugated shipping delivery boxes and cereal cartons into modular, custom-fitted drawer dividers and aesthetic desktop file organizers.',
    requiredMaterials: [
      'Corrugated delivery boxes or clean cereal cartons',
      'Kraft wrapping paper or fabric scraps',
      'Non-toxic PVA craft glue',
      'Double-sided tape or paper tape',
    ],
    toolsRequired: [
      'Utility craft blade or heavy scissors',
      'Metal straightedge safety ruler',
      'Carpenter pencil or pen',
      'Binder clips or clothes pegs',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '30 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Measure Drawer & Divider Clearance',
        instruction: 'Measure drawer depth, width, and height with a ruler to calculate custom modular dimensions, marking cutting lines with a pencil.',
        diagramKey: 'cardboard-step-1',
        diagramType: 'measure',
        diagramNote: 'Subtract 1/8 inch from total dimensions to ensure dividers slide in and out of the drawer effortlessly.',
        measurements: ['Ruler dimensions: Length x Width x Clearance Height (-1/8")'],
        labels: ['Drawer Frame', 'Width Dimension Guide', 'Depth Dimension Guide', 'Pencil Line'],
        requiredTools: ['Metal safety ruler', 'Pencil'],
        tip: 'Check drawer glide clearance so the dividers do not snag on cabinet frames.',
      },
      {
        stepNumber: 2,
        title: 'Cut Cardboard Panels with Straightedge',
        instruction: 'Cut cardboard panels along measured lines using a metal ruler as a straightedge guide to ensure crisp 90-degree square edges.',
        diagramKey: 'cardboard-step-2',
        diagramType: 'cut',
        diagramNote: 'Score the outer paper face first, then slice through the inner corrugated flute layer on the second pass.',
        labels: ['Corrugated Base Sheet', 'Red Dashed Cut Line', 'Steel Ruler Guide', 'Craft Knife'],
        requiredTools: ['Utility knife', 'Metal ruler', 'Cutting mat'],
        safetyWarning: 'Keep non-dominant fingers curled back behind the metal ruler straightedge when scoring with a utility knife.',
      },
      {
        stepNumber: 3,
        title: 'Cut Interlocking 1/2-Depth Slots',
        instruction: 'Cut interlocking 1/2-depth vertical slots in cross-pieces to create modular grid compartments that slot together firmly without glue.',
        diagramKey: 'cardboard-step-3',
        diagramType: 'cut',
        diagramNote: 'Slots should match the exact cardboard flute thickness (~1/8") and stop halfway down the divider strip.',
        measurements: ['Slot depth: Exactly 50% of divider height', 'Slot width: ~1/8 inch (3 mm)'],
        labels: ['Horizontal Divider A', 'Vertical Divider B', '1/2-Depth Notched Slot', 'Slide Direction Arrow'],
        requiredTools: ['Utility knife', 'Pencil'],
        tip: 'Friction-fit slots hold rectangular compartments square under heavy supplies without requiring hot glue.',
      },
      {
        stepNumber: 4,
        title: 'Assemble Modular Grid & Wrap Edges',
        instruction: 'Wrap exposed outer edges in reclaimed kraft paper with dilute PVA glue for a clean aesthetic finish and insert the grid into your desk drawer.',
        diagramKey: 'cardboard-step-4',
        diagramType: 'assemble',
        diagramNote: 'Kraft paper protects the exposed corrugated flute edges from catching pens and paperclips.',
        labels: ['Interlocked 6-Grid Box', 'Pens & Pencils Dock', 'Sticky Note Tray', 'Kraft Bound Edge'],
        requiredTools: ['Glue brush', 'Binder clips'],
        requiredMaterials: ['PVA glue', 'Kraft paper tape'],
        tip: 'A dilute 70% PVA / 30% water wash gives kraft paper a matte protective lacquer look that repels dust.',
      },
    ],
    safetyPrecautions: [
      'Keep non-dominant fingers curled back behind the metal ruler when scoring corrugated cardboard with a utility knife.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 1.6,
    isFeatured: false,
  },
  // 5. Wooden Pallets into Patio Lounge Furniture (5 steps)
  {
    id: 'idea-pallet-furniture',
    projectTitle: 'Rustic Garden Patio Lounge Furniture',
    category: 'Furniture Restoration',
    beforeProduct: 'Wooden Pallets',
    finalProduct: 'Patio Lounge Furniture',
    description: 'Restore and join certified heat-treated shipping pallets to construct weather-resistant outdoor lounge benches, coffee tables, or vertical herb walls.',
    requiredMaterials: [
      '2-3 Heat-Treated (HT stamp) timber shipping pallets',
      '3-inch and 4-inch exterior galvanized deck screws',
      'Natural boiled linseed oil or exterior eco-timber stain',
      'Weatherproof outdoor seating cushions',
    ],
    toolsRequired: [
      'Random orbital sander (80 & 120 grit sandpaper)',
      'Cordless drill & driver bits',
      'Pry bar or claw hammer',
      'Wide paintbrush',
    ],
    difficultyLevel: 'Advanced',
    estimatedCompletionTime: '3.0 hrs',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Verify Pallet Safety Stamp (HT vs MB)',
        instruction: 'Verify pallet stamp has "HT" (Heat Treated) brand mark. Reject pallets marked "MB" (Methyl Bromide) as they contain toxic chemical pesticides.',
        diagramKey: 'pallet-step-1',
        diagramType: 'measure',
        diagramNote: 'Only use pallets marked HT or DB. Never use unmarked, painted, or MB chemically fumigated pallets.',
        labels: ['Pallet Stringer Board', 'Approved HT Stamp (Safe)', 'Rejected MB Stamp (Toxic)'],
        safetyWarning: 'Do not use or burn pallets marked MB. Chemical fumes are hazardous to respiratory health.',
        tip: 'European EPAL and EUR pallets are rigorously heat-treated and provide dense, structural pine timber.',
      },
      {
        stepNumber: 2,
        title: 'Pull Protruding Nails & Staples',
        instruction: 'Inspect wood for protruding staples or rusted nails and pull them clean with a pry bar or claw hammer before sanding.',
        diagramKey: 'pallet-step-2',
        diagramType: 'clean',
        diagramNote: 'Remove all metal fasteners flush so sanding pads and drill bits do not catch or shatter.',
        labels: ['Timber Plank', 'Protruding Rusty Nail', 'Claw Hammer Lever', 'Clean Nail Hole'],
        requiredTools: ['Pry bar', 'Claw hammer', 'Pliers'],
        safetyWarning: 'Wear heavy leather work gloves to prevent puncture wounds from rusty fasteners.',
      },
      {
        stepNumber: 3,
        title: 'Two-Stage Surface Sanding',
        instruction: 'Thoroughly sand all exposed surfaces with 80-grit then 120-grit sandpaper until completely free of splinters and rough mill grain.',
        diagramKey: 'pallet-step-3',
        diagramType: 'sand',
        diagramNote: 'Sand with the wood grain to remove sawmill blade ridges and prepare timber for deep oil penetration.',
        measurements: ['Coarse pass: 80-grit', 'Finish pass: 120-grit smooth'],
        labels: ['Rough Unsanded Timber', 'Sanded Silky Timber', '80/120-Grit Sanding Block'],
        requiredTools: ['Random orbital sander or sanding block'],
        safetyWarning: 'Always wear an N95 dust mask and eye goggles when sanding reclaimed timber.',
      },
      {
        stepNumber: 4,
        title: 'Stack & Anchor Pallet Frame',
        instruction: 'Stack two pallets for seat height. Anchor a third pallet vertically behind with 4-inch deck screws and carriage bolts to form the backrest.',
        diagramKey: 'pallet-step-4',
        diagramType: 'assemble',
        diagramNote: 'Drive screws through the solid structural 2x4 stringers, pre-drilling pilot holes to avoid splitting dry timber.',
        measurements: ['Seat height: ~18 inches (45 cm)', '4-inch exterior deck bolts'],
        labels: ['Stacked Base Pallets', 'Vertical Backrest', 'Carriage Bolt Anchors (x4)'],
        requiredTools: ['Cordless drill', 'Driver bits', 'Countersink bit'],
        requiredMaterials: ['4" galvanized exterior screws'],
        tip: 'A 95-degree slight backward tilt on the vertical pallet makes the bench far more ergonomic than a 90-degree upright backrest.',
      },
      {
        stepNumber: 5,
        title: 'Apply Weatherproof Sealant & Cushions',
        instruction: 'Apply two generous coats of boiled linseed oil or weather sealant and top with weatherproof cushions for an indestructible patio lounge.',
        diagramKey: 'pallet-step-5',
        diagramType: 'finish',
        diagramNote: 'Linseed oil polymerizes inside wood cells, blocking rain absorption while highlighting natural golden pine grain.',
        labels: ['Stained Pallet Lounge', 'Foam Seat Cushion', 'Linseed Oil Brush'],
        requiredTools: ['Paintbrush', 'Clean rag'],
        requiredMaterials: ['Boiled linseed oil', 'Outdoor cushions'],
        tip: 'Allow 24 hours of drying time between oil coats for maximum moisture resistance.',
      },
    ],
    safetyPrecautions: [
      'Always wear an N95 dust mask and eye goggles when sanding reclaimed wood.',
      'Verify structural integrity of cross-stringers to ensure safe human seating load.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 32.0,
    isFeatured: true,
  },
  // 6. Upcycled T-Shirt Macrame Hanger (4 steps)
  {
    id: 'idea-tshirt-macrame',
    projectTitle: 'Upcycled T-Shirt Yarn & Braided Plant Hanger',
    category: 'Clothing Upcycling',
    beforeProduct: 'Old Cotton T-Shirt',
    finalProduct: 'Braided Macrame Plant Hanger',
    description: 'Cut worn cotton t-shirts into a continuous yarn spool and knot a bohemian macrame hanging cradle for indoor plants.',
    requiredMaterials: [
      '1-2 worn adult cotton t-shirts (100% jersey knit)',
      'Metal or wooden curtain ring (2-inch diameter)',
      'Measuring tape or yardstick',
    ],
    toolsRequired: [
      'Sharp fabric scissors or rotary cutter',
      'Door handle or wall hook for knotting tension',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '45 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Cut Torso into Parallel Strips',
        instruction: 'Cut off sleeves and neckline. Cut horizontal 1-inch strips across the torso, stopping 1 inch before the side seam.',
        diagramKey: 'tshirt-step-1',
        diagramType: 'cut',
        diagramNote: 'Leaving 1 inch uncut along the side seam is crucial for creating continuous yarn in Step 2.',
        measurements: ['Strip width: 1 inch (2.5 cm)', 'Uncut seam margin: 1 inch (2.5 cm)'],
        labels: ['T-Shirt Torso', 'Red Dashed Cut Lines', 'Uncut Seam Margin', 'Fabric Shears'],
        requiredTools: ['Fabric shears'],
        tip: 'Iron the t-shirt flat first so cuts stay straight across both layers of cotton.',
      },
      {
        stepNumber: 2,
        title: 'Diagonal Continuous Cuts',
        instruction: 'Open the uncut side seam flat and make diagonal cuts connecting strip 1 to strip 2, creating one continuous unbroken ribbon of jersey yarn.',
        diagramKey: 'tshirt-step-2',
        diagramType: 'cut',
        diagramNote: 'Diagonal cutting turns separate loops into one single 100-foot continuous yarn skein.',
        labels: ['Uncut Seam Connection Zone', 'Diagonal Connecting Cut Line', 'Continuous Yarn Strand'],
        requiredTools: ['Fabric shears'],
        tip: 'Lay the uncut seam flat over your arm or cutting board to visualize the diagonal connection paths clearly.',
      },
      {
        stepNumber: 3,
        title: 'Tension Stretch & Edge Curling',
        instruction: 'Pull the jersey ribbon firmly through your hands; the knit edges will naturally curl inward to form rounded, lint-free tubular macramé rope.',
        diagramKey: 'tshirt-step-3',
        diagramType: 'fold',
        diagramNote: 'Tension activates jersey stretch recoil, transforming raw flat fabric strips into durable round yarn.',
        labels: ['Flat Ribbon Before', 'Tension Pull Force', 'Curled Tubular Yarn Ball'],
        tip: 'Wind the curled cord into a tight ball as you stretch it to keep it neat and untangled.',
      },
      {
        stepNumber: 4,
        title: 'Knot Square Mesh Plant Basket',
        instruction: 'Cut 8 equal 5-foot strands, loop through a metal ring, and tie square gathering knots to cradle a potted ceramic or terracotta planter.',
        diagramKey: 'tshirt-step-4',
        diagramType: 'assemble',
        diagramNote: 'The interlocking knot mesh stretches to fit any 4-inch to 8-inch flower pot snugly.',
        labels: ['Top Ring Loop', 'Square Knots', 'Terracotta Pot Cradle', 'Bottom Tassel Knot'],
        requiredTools: ['Measuring tape', 'Fabric shears'],
        requiredMaterials: ['Top ring', '8x 5-foot jersey strands'],
        safetyWarning: 'Test knot tension securely over a rug before hanging heavy ceramic pots overhead.',
      },
    ],
    safetyPrecautions: [
      'Test knot tension securely over a soft surface before hanging delicate ceramic pots.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 2.8,
    isFeatured: false,
  },
  // 7. Cast Iron Restoration (4 steps)
  {
    id: 'idea-cast-iron-seasoning',
    projectTitle: 'Restored Seasoned Cast Iron Skillet',
    category: 'Metal Reuse',
    beforeProduct: 'Rusted Cast Iron Skillet',
    finalProduct: 'Heirloom Seasoned Cookware',
    description: 'Strip heavy rust and build a non-stick polymer seasoning patina to return neglected vintage cast iron cookware to daily kitchen service.',
    requiredMaterials: [
      'Rusted vintage cast iron skillet',
      'Coarse kosher salt',
      'Organic 100% flaxseed, grapeseed, or canola oil',
      'Fine steel wool (#00 or #000 grade)',
    ],
    toolsRequired: [
      'Stiff dish scrub brush',
      'Cotton lint-free shop towels',
      'Kitchen oven capable of 450°F (230°C)',
      'Stovetop gas or electric burner',
    ],
    difficultyLevel: 'Moderate',
    estimatedCompletionTime: '2.0 hrs',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Strip Rust with Steel Wool & Salt',
        instruction: 'Scrub rusted areas vigorously with fine steel wool and warm soapy water until raw grey iron is visible across all cooking surfaces.',
        diagramKey: 'castiron-step-1',
        diagramType: 'clean',
        diagramNote: 'Scrub until all orange iron oxide is removed and the underlying gunmetal grey iron is exposed.',
        labels: ['Oxidized Rust Surface', 'Raw Grey Iron', 'Steel Wool Scrub Pad'],
        requiredTools: ['Steel wool #00', 'Scrub brush'],
        requiredMaterials: ['Coarse salt', 'Dish soap', 'Warm water'],
        safetyWarning: 'Rinse thoroughly to remove all iron dust and steel wool fragments before cooking.',
      },
      {
        stepNumber: 2,
        title: 'Thermal Stovetop Drying',
        instruction: 'Rinse completely and dry immediately on a hot stovetop burner for 5 minutes to expel all residual moisture trapped in micro-pores.',
        diagramKey: 'castiron-step-2',
        diagramType: 'heat',
        diagramNote: 'Porous cast iron traps microscopic water droplets that cause instant flash-rust if not evaporated with heat.',
        measurements: ['Heat duration: 5 minutes on medium stovetop flame'],
        labels: ['Blue Gas Burner Flame', 'Skillet Profile', 'Evaporating Steam Waves'],
        requiredTools: ['Stovetop burner', 'Silicone oven mitt'],
        safetyWarning: 'The cast iron handle becomes extremely hot within seconds. Always use a silicone mitt.',
      },
      {
        stepNumber: 3,
        title: 'Micro-Thin Oil Buffing',
        instruction: 'Apply half a teaspoon of oil across all interior and exterior surfaces. Wipe aggressively with a clean towel until pan looks completely dry.',
        diagramKey: 'castiron-step-3',
        diagramType: 'clean',
        diagramNote: 'A micro-thin microscopic oil film is critical; excess oil pools into sticky brown droplets during baking.',
        measurements: ['Dosage: Exactly 1/2 teaspoon flaxseed/grapeseed oil'],
        labels: ['Skillet Pan', 'Oil Dropper (1/2 Tsp)', 'Buffing Cloth'],
        requiredTools: ['Clean cotton rag or shop towel'],
        requiredMaterials: ['Flaxseed oil or grapeseed oil'],
        tip: 'Wipe the pan as if you applied the oil by mistake and are trying to remove every trace of it.',
      },
      {
        stepNumber: 4,
        title: '450°F Oven Polymerization Bake',
        instruction: 'Place skillet upside-down in a 450°F (230°C) oven for 1 hour to polymerize the oil into durable non-stick glass patina.',
        diagramKey: 'castiron-step-4',
        diagramType: 'finish',
        diagramNote: 'Inverting the pan prevents oil pooling, while high heat cross-links unsaturated fatty acids into an impervious polymer.',
        measurements: ['Bake temperature: 450°F (230°C)', 'Duration: 60 minutes + 60 minutes cool-down'],
        labels: ['Oven Cavity Frame', 'Inverted Skillet', 'Foil Drip Catcher', 'Polymerized Mirror Patina'],
        requiredTools: ['Kitchen oven', 'Heavy oven mitts'],
        requiredMaterials: ['Sheet of aluminum foil'],
        safetyWarning: 'Let pan cool completely inside the oven before touching with bare hands.',
      },
    ],
    safetyPrecautions: [
      'Always handle hot cast iron with heavy-duty silicone oven mitts.',
      'Ensure kitchen is well ventilated during high-heat oil polymerization.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 8.5,
    isFeatured: false,
  },
  // 8. Tin Can Herb & Cutlery Caddy (4 steps)
  {
    id: 'idea-tin-can-caddy',
    projectTitle: 'Upcycled Tin Can Herb & Cutlery Caddy',
    category: 'Metal Reuse',
    beforeProduct: 'Tin Food Cans',
    finalProduct: 'Rustic Herb & Cutlery Caddy',
    description: 'Clean aluminum and steel food cans, smooth rim edges, and mount to a reclaimed wood handle for an outdoor utensil or garden tool carrier.',
    requiredMaterials: [
      '4-6 clean soup or vegetable cans (same height)',
      'Reclaimed timber block (12 x 4 x 1.5 inches)',
      'Reclaimed leather belt or rope handle',
      '1/2-inch pan head wood screws and washers',
    ],
    toolsRequired: [
      'Can opener or deburring file',
      'Cordless drill with 1/8" metal drill bit',
      'Center punch and hammer',
      'Phillips screwdriver',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '45 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Clean Cans & Deburr Sharp Rims',
        instruction: 'Remove labels and sanitize cans. Check interior rims with a rotary file or back of a spoon to confirm no sharp metal burrs remain.',
        diagramKey: 'tincan-step-1',
        diagramType: 'sand',
        diagramNote: 'Smooth inner rolled rims guarantee that fingers can reach into cans safely during daily use.',
        labels: ['Steel Food Can', 'Rolled Inner Rim', 'Deburring File Tool'],
        requiredTools: ['Deburring tool or smooth metal file', 'Dish sponge'],
        safetyWarning: 'Wear light work gloves when inspecting fresh can edges.',
      },
      {
        stepNumber: 2,
        title: 'Drill 1/8" Mounting Pilot Holes',
        instruction: 'Mark pilot holes near upper rim and drill 1/8-inch mounting holes in each can, aligned with matching pilot points on the central wood block.',
        diagramKey: 'tincan-step-2',
        diagramType: 'drill',
        diagramNote: 'Drill hole 1/2 inch below the top rolled lip for optimal weight balance.',
        measurements: ['1/8 inch (3 mm) pilot hole', '1/2 inch below upper rim'],
        labels: ['Tin Can Side', 'Pilot Hole Mark (1/2" below rim)', 'Central Wood Spine', 'Drill Bit'],
        requiredTools: ['Cordless drill', '1/8" metal bit', 'Center punch'],
        safetyWarning: 'Clamp cans or brace against scrap wood while drilling to avoid spinning.',
      },
      {
        stepNumber: 3,
        title: 'Mount Cans to Central Wooden Block',
        instruction: 'Mount cans in pairs on both sides of the central wooden block using 1/2-inch pan head screws and a Phillips screwdriver.',
        diagramKey: 'tincan-step-3',
        diagramType: 'assemble',
        diagramNote: 'Mount 3 cans per side for a balanced 6-compartment carrier.',
        labels: ['Central Wood Spine Block', 'Left Can Pair', 'Right Can Pair', 'Pan-Head Screws'],
        requiredTools: ['Phillips screwdriver'],
        requiredMaterials: ['1/2" pan-head wood screws'],
        tip: 'Add a small metal washer inside the can so the screw head grips the thin tin securely without distorting the metal.',
      },
      {
        stepNumber: 4,
        title: 'Attach Leather Strap Handle',
        instruction: 'Attach a reclaimed leather strap to the top of the wooden spine using brass screws for a comfortable, portable picnic and tool caddy.',
        diagramKey: 'tincan-step-4',
        diagramType: 'finish',
        diagramNote: 'Old leather belts or thick cotton webbing make durable, ergonomic tote handles.',
        labels: ['Leather Handle Strap', 'Brass Anchor Screws', 'Wood Spine Block', 'Filled Cutlery Cans'],
        requiredTools: ['Screwdriver', 'Drill'],
        requiredMaterials: ['Leather strap', 'Brass wood screws'],
        tip: 'Coat the wooden spine in butcher block oil or beeswax for outdoor weather protection.',
      },
    ],
    safetyPrecautions: [
      'Wear leather work gloves when handling cut metal edges.',
      'File down any interior burrs before daily handling.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 3.2,
    isFeatured: false,
  },
  // 9. Household Plastic Jug Scoops (3 steps)
  {
    id: 'idea-jug-scoops',
    projectTitle: 'Ergonomic Garden & Feed Scoops',
    category: 'Household Reuse',
    beforeProduct: 'Milk & Detergent Jugs',
    finalProduct: 'Heavy-Duty Garden Scoops',
    description: 'Slice empty sturdy plastic milk or detergent jugs using their integrated handles to construct indestructible garden soil and pet food scoops.',
    requiredMaterials: [
      'Clean empty 1-gallon translucent HDPE milk or water jug',
      "Blue painter's masking tape",
    ],
    toolsRequired: [
      'Heavy-duty utility shears or craft knife',
      'Fine sandpaper or emery board',
      'Permanent marker',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '15 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Inspect HDPE Jug & Clean',
        instruction: 'Wash jug with hot soapy water and let dry. Inspect the hollow ergonomic handle and verify food-safe #2 HDPE recycling symbol.',
        diagramKey: 'milkJug-step-1',
        diagramType: 'clean',
        diagramNote: 'HDPE #2 plastic is virtually unbreakable, frost-resistant, and non-reactive with damp garden soil or animal feed.',
        labels: ['Translucent 1-Gallon Jug', 'Hollow Ergonomic Handle', '#2 HDPE Recycling Symbol'],
        requiredTools: ['Warm soapy water', 'Drying towel'],
        requiredMaterials: ['Empty milk jug'],
        safetyWarning: 'Never use jugs that previously stored motor oil, lawn pesticides, or automotive fluids.',
      },
      {
        stepNumber: 2,
        title: 'Apply 45-Degree Diagonal Tape Guide',
        instruction: 'Apply masking tape at a 45-degree angle starting under the handle down toward the base to establish a rigid cutting line.',
        diagramKey: 'milkJug-step-2',
        diagramType: 'measure',
        diagramNote: 'The 45-degree angle balances wide mouth scoop capacity with comfortable wrist leverage.',
        measurements: ['45-degree angle from handle base to front corner'],
        labels: ['Jug Silhouette', 'Hollow Handle', "Blue Painter's Tape (45°)", 'Cutting Guide Line'],
        requiredTools: ['Masking tape', 'Marker'],
        tip: 'Tape reinforces flexible plastic, keeping scissors gliding along a straight path.',
      },
      {
        stepNumber: 3,
        title: 'Contour Cut & Deburr Scoop Mouth',
        instruction: 'Cut carefully along the tape line. The hollow handle forms the grip, and the diagonal bottom creates the scoop. Sand edges smooth.',
        diagramKey: 'milkJug-step-3',
        diagramType: 'cut',
        diagramNote: 'Lightly buff cut edges with 120-grit sandpaper so no plastic burrs catch on soil or pet food bags.',
        labels: ['Finished Heavy-Duty Scoop', 'Comfort Grip Handle', 'Scoop Mouth with Soil', 'Discarded Base (Recycle)'],
        requiredTools: ['Utility shears', 'Sandpaper'],
        tip: 'The screw cap stays on the top spout, keeping soil and moisture from spilling through.',
      },
    ],
    safetyPrecautions: [
      'Never use jugs that previously held industrial motor oil, pesticides, or toxic solvents.',
    ],
    relevantImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    co2SavedKg: 1.1,
    isFeatured: false,
  },
];

const SAVED_IDEAS_STORAGE_KEY = 'reusehub_user_favorite_ideas';

/**
 * Fetch all DIY Reuse Ideas from database with offline cache fallback
 */
export async function getDIYReuseIdeas(): Promise<DIYInstructionIdea[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reuse_ideas')
        .select('*')
        .order('is_featured', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          projectTitle: item.project_title,
          category: item.category as DIYCategory,
          beforeProduct: item.before_product,
          finalProduct: item.final_product,
          description: item.description,
          requiredMaterials: item.required_materials || [],
          toolsRequired: item.tools_required || [],
          difficultyLevel: item.difficulty_level as DIYDifficulty,
          estimatedCompletionTime: item.estimated_completion_time,
          stepByStepInstructions: item.step_by_step_instructions || [],
          safetyPrecautions: item.safety_precautions || [],
          relevantImage: item.relevant_image,
          co2SavedKg: Number(item.co2_saved_kg) || 0,
          isFeatured: Boolean(item.is_featured),
        }));
      }
    } catch (err) {
      console.warn('Database ideas fetch note, using local catalog:', err);
    }
  }

  // Local fallback
  return INITIAL_DIY_IDEAS;
}

/**
 * Get Saved User Favorites
 */
export function getSavedIdeaIds(): string[] {
  try {
    const stored = localStorage.getItem(SAVED_IDEAS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Toggle Favorite Status
 */
export async function toggleSaveIdea(ideaId: string, userId?: string): Promise<{ isSaved: boolean }> {
  const current = getSavedIdeaIds();
  const exists = current.includes(ideaId);
  const updated = exists ? current.filter((id) => id !== ideaId) : [...current, ideaId];

  localStorage.setItem(SAVED_IDEAS_STORAGE_KEY, JSON.stringify(updated));

  // Sync with Supabase if configured and user is logged in
  if (isSupabaseConfigured && userId) {
    try {
      if (exists) {
        await supabase
          .from('user_saved_ideas')
          .delete()
          .eq('user_id', userId)
          .eq('idea_id', ideaId);
      } else {
        await supabase
          .from('user_saved_ideas')
          .insert({ user_id: userId, idea_id: ideaId });
      }
    } catch (err) {
      console.warn('Supabase toggle bookmark sync note:', err);
    }
  }

  return { isSaved: !exists };
}
