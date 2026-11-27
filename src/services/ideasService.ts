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
        title: 'Cut off the pant legs',
        instruction: 'Lay your jeans flat. Cut both legs straight across, about 2 inches below the back pockets. Save the cut legs—you will use them for straps later.',
        diagramKey: 'jeans-step-1',
        diagramType: 'cut',
        diagramNote: 'Smooth the front and back flat before cutting. Save the cut pant legs for straps.',
        measurements: ['Cut line: ~2 inches (5 cm) below back pockets'],
        labels: ['Bag Body (Upper)', 'Cutting Line (Red Dashed)', 'Fabric Shears', 'Leg Remnants (Save for Straps)'],
        requiredTools: ['Fabric scissors', 'Ruler', 'Pencil or chalk'],
        requiredMaterials: ['Old denim jeans'],
        safetyWarning: 'Cut on a flat surface and keep your other hand away from the scissors.',
        tip: 'Check that the pockets are pulled flat so you do not accidentally cut into them.',
      },
      {
        stepNumber: 2,
        title: 'Turn inside out and pin',
        instruction: 'Turn the top jeans piece inside out. Line up the open bottom edges together and pin them in place every inch.',
        diagramKey: 'jeans-step-2',
        diagramType: 'fold',
        diagramNote: 'Line up the center and side seams so your bag bottom sits completely flat.',
        measurements: ['Place pins every 1 inch (2.5 cm)'],
        labels: ['Inside-Out Denim', 'Pocket Linings (Exposed)', 'Aligned Bottom Edges', 'Sewing Pins'],
        requiredTools: ['Sewing pins', 'Iron'],
        requiredMaterials: ['Cropped jeans body'],
        tip: 'Pressing the bottom edge flat with an iron makes sewing in the next step much easier.',
      },
      {
        stepNumber: 3,
        title: 'Sew the bottom closed',
        instruction: 'Sew straight across the pinned bottom edge to close the bag. Add a zigzag stitch along the edge so the fabric does not fray.',
        diagramKey: 'jeans-step-3',
        diagramType: 'stitch',
        diagramNote: 'Sew half an inch from the bottom edge. A zigzag stitch keeps threads locked tight.',
        measurements: ['Sew 1/2 inch (1.3 cm) from raw edge'],
        labels: ['Seam Line (1/2")', 'Straight Stitch', 'Zigzag Stitch', 'Sewing Direction'],
        requiredTools: ['Sewing machine or needle', 'Scissors'],
        requiredMaterials: ['Strong thread (polyester or denim thread)'],
        safetyWarning: 'Go slowly over thick denim seams so you do not bend or break the needle.',
        tip: 'Sew back and forth at the beginning and end of your seam to lock the stitches.',
      },
      {
        stepNumber: 4,
        title: 'Make two strong straps',
        instruction: 'Cut two 3-inch wide strips from the leftover legs. Fold both long edges to the center, fold in half again, and sew down both sides.',
        diagramKey: 'jeans-step-4',
        diagramType: 'fold',
        diagramNote: 'Folding the edges inward hides raw threads and makes two rugged, comfy handles.',
        measurements: ['Strap width: 3 inches (7.5 cm)', 'Finished strap width: 1 inch (2.5 cm)'],
        labels: ['Leftover Pant Leg', '3" Cutting Guidelines', 'Raw Edges Folded Inward', 'Topstitched Handle'],
        requiredTools: ['Scissors', 'Iron', 'Sewing machine or needle'],
        requiredMaterials: ['Cut pant legs', 'Matching thread'],
        tip: 'Pressing the folds with an iron sets sharp creases that stay in place while sewing.',
      },
      {
        stepNumber: 5,
        title: 'Attach the straps to the bag',
        instruction: 'Tuck the straps inside the waistband, about 6 inches apart. Sew a square with an "X" in the middle on each strap end to hold heavy groceries.',
        diagramKey: 'jeans-step-5',
        diagramType: 'assemble',
        diagramNote: 'The Box-X stitch spreads the pulling weight across the waistband so straps will never rip off.',
        measurements: ['Space handles ~6 inches (15 cm) apart', 'Overlap 1.5 inches inside waistband'],
        labels: ['Bag Opening (Top View)', 'Waistband Attachment Point', 'Dual Handles', 'Box-X Stitch'],
        requiredTools: ['Sewing machine or needle', 'Pins', 'Ruler'],
        requiredMaterials: ['Finished bag body', 'Two finished handles'],
        safetyWarning: 'Take your time sewing through the thick waistband layers.',
        tip: 'Turn your bag right side out and give the straps a firm tug—your new tote bag is ready to use!',
      },
    ],
    safetyPrecautions: [
      'Cut on a stable flat surface and keep fingers behind the scissor blades.',
      'Go slowly when sewing over thick denim seams to prevent needle breakage.',
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
    description: 'Clean sticky labels off old glass jars to make clean, airtight containers for food, snacks, and spices.',
    requiredMaterials: [
      'Empty glass jars with clean metal lids',
      'Baking soda',
      'Cooking oil (vegetable or olive oil)',
      'Paper labels or tape',
    ],
    toolsRequired: [
      'Dish sponge',
      'Large pot',
      'Tongs',
      'Marker or pen',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '25 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Soak in warm soapy water',
        instruction: 'Put your glass jars and lids in warm soapy water for 20 minutes to soften the paper labels.',
        diagramKey: 'glass-step-1',
        diagramType: 'clean',
        diagramNote: 'Submerge jars in warm soapy water to loosen the paper and glue.',
        measurements: ['Soak for 20 minutes in warm water'],
        labels: ['Water Basin', 'Paper Label', 'Dish Soap Bubbles'],
        requiredTools: ['Sink basin or large pot'],
        requiredMaterials: ['Warm water', 'Dish soap'],
        tip: 'Warm water softens most paper labels so they peel right off.',
      },
      {
        stepNumber: 2,
        title: 'Rub with baking soda paste',
        instruction: 'Mix equal parts baking soda and cooking oil into a paste. Rub it over any sticky glue spots and let it sit for 10 minutes.',
        diagramKey: 'glass-step-2',
        diagramType: 'clean',
        diagramNote: 'Baking soda gently lifts the glue while oil dissolves sticky tack without scratching the glass.',
        measurements: ['Mix 1 spoon baking soda with 1 spoon cooking oil', 'Wait 10 minutes'],
        labels: ['1:1 Paste Mix', 'Sticky Glue Spot', 'Application Spoon'],
        requiredTools: ['Small bowl', 'Spoon'],
        requiredMaterials: ['Baking soda', 'Cooking oil'],
        tip: 'The oil dissolves sticky glue and the baking soda wipes it away cleanly.',
      },
      {
        stepNumber: 3,
        title: 'Wipe and wash clean',
        instruction: 'Scrub the jar with a sponge. The sticky residue will slide right off. Wash with dish soap and warm water to remove all oil.',
        diagramKey: 'glass-step-3',
        diagramType: 'clean',
        diagramNote: 'Wipe in circular motions. The glue wipes away easily without harsh chemicals.',
        labels: ['Running Water Stream', 'Dish Sponge', 'Clean Shiny Glass'],
        requiredTools: ['Dish sponge'],
        requiredMaterials: ['Warm soapy water'],
        safetyWarning: 'Glass gets slippery when wet and soapy. Hold firmly over the sink.',
      },
      {
        stepNumber: 4,
        title: 'Sterilize in hot water',
        instruction: 'Place clean jars in boiling water for 5 minutes (or run through a dishwasher). Let them dry completely on a clean towel.',
        diagramKey: 'glass-step-4',
        diagramType: 'finish',
        diagramNote: 'Boil for 5 minutes. Use tongs to lift hot jars onto a clean cooling towel.',
        measurements: ['Boil for 5 minutes in clean water'],
        labels: ['Boiling Pot', 'Submerged Jars & Lids', 'Tongs'],
        requiredTools: ['Large pot', 'Tongs'],
        requiredMaterials: ['Clean water', 'Drying towel'],
        safetyWarning: 'Do not put cold jars into boiling water or hot jars onto cold counters to prevent cracking.',
      },
      {
        stepNumber: 5,
        title: 'Add labels and fill',
        instruction: 'Make sure the rubber seal inside the lid is clean. Write a label, fill the jar with rice, coffee, beans, or snacks, and close the lid tightly.',
        diagramKey: 'glass-step-5',
        diagramType: 'finish',
        diagramNote: 'Check the rubber seal under the lid to ensure an airtight closure.',
        labels: ['Rubber Lid Seal', 'Airtight Glass Body', 'Pantry Label'],
        requiredTools: ['Marker or pen'],
        requiredMaterials: ['Clean dry jars', 'Pantry snacks or grains'],
        tip: 'Airtight glass jars keep snacks crunchy and spices fresh for months.',
      },
    ],
    safetyPrecautions: [
      'Do not plunge hot glass into cold water to avoid cracking.',
      'Check jar rims to make sure there are no chips before storing food.',
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
    description: 'Turn an empty plastic bottle into an easy self-watering pot that keeps small herbs and plants happy.',
    requiredMaterials: [
      'Clean 2-liter plastic bottle',
      'Cotton string or thick yarn (8 inches)',
      'Potting soil',
      'Herb seeds or small plant cutting',
    ],
    toolsRequired: [
      'Scissors or craft knife',
      'Push pin, nail, or awl',
      'Small piece of sandpaper',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '20 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Cut the bottle in half',
        instruction: 'Rinse an empty 2-liter bottle. Cut it in half, about 4 inches from the bottom, using scissors.',
        diagramKey: 'bottle-planter-1',
        diagramType: 'cut',
        diagramNote: 'Cut ~4 inches (10 cm) from the bottom. The top holds the plant, the bottom holds the water.',
        measurements: ['Cut 4 inches (10 cm) from the base'],
        labels: ['Top Planting Funnel', 'Base Water Reservoir', 'Cut Line'],
        requiredTools: ['Scissors or craft knife'],
        requiredMaterials: ['Clean 2L plastic bottle'],
        safetyWarning: 'Cut on a flat table and keep your other hand behind the cutting blade.',
      },
      {
        stepNumber: 2,
        title: 'Smooth the plastic edges',
        instruction: 'Gently rub the cut edges with sandpaper or cover them with tape so they are not sharp.',
        diagramKey: 'bottle-planter-2',
        diagramType: 'sand',
        diagramNote: 'Smooth edges protect your fingers while watering and caring for plants.',
        labels: ['Cut Plastic Rim', 'Sandpaper Block', 'Smooth Safe Edge'],
        requiredTools: ['Sandpaper or tape'],
        safetyWarning: 'Blow away any plastic dust away from your eyes.',
      },
      {
        stepNumber: 3,
        title: 'Make a hole in the cap',
        instruction: 'Make a small hole in the center of the bottle cap using a nail or pin. Screw the cap back onto the bottle neck.',
        diagramKey: 'bottle-planter-3',
        diagramType: 'drill',
        diagramNote: 'Make the hole just big enough for your cotton string to slide through.',
        measurements: ['1/4 inch (6 mm) center hole'],
        labels: ['Screw Cap', 'Center Hole', 'Push Pin or Nail'],
        requiredTools: ['Nail or push pin'],
        safetyWarning: 'Place the cap on a block of scrap wood before poking the hole.',
      },
      {
        stepNumber: 4,
        title: 'Thread the watering wick',
        instruction: 'Push an 8-inch cotton cord through the cap hole. Leave about 3 inches hanging below in the base and 4 inches inside the top funnel.',
        diagramKey: 'bottle-planter-4',
        diagramType: 'assemble',
        diagramNote: 'Cotton pulls water up into the soil like a straw whenever the plant is thirsty.',
        measurements: ['8 inches (20 cm) cotton string', '3" in water, 4" in soil'],
        labels: ['Cotton Wick', 'Inverted Funnel', 'Bottom Water Base'],
        requiredTools: ['Scissors'],
        requiredMaterials: ['Cotton cord or yarn'],
        tip: 'Use real cotton string; synthetic plastic strings do not soak up water well.',
      },
      {
        stepNumber: 5,
        title: 'Add soil, plant, and water',
        instruction: 'Flip the top funnel upside down into the base. Fill it with potting soil, plant your seeds or herb cutting, and add water to the bottom base.',
        diagramKey: 'bottle-planter-5',
        diagramType: 'finish',
        diagramNote: 'Keep water filled in the bottom base. Refill every week or two.',
        labels: ['Potting Soil', 'Cotton Wick', 'Herb Sprout', 'Water Level in Base'],
        requiredMaterials: ['Potting soil', 'Herb seeds or cutting', 'Fresh water'],
        tip: 'The self-watering wick prevents overwatering and keeps your herbs green and healthy.',
      },
    ],
    safetyPrecautions: [
      'Always cut plastic on a cutting board away from your body.',
      'Water the soil lightly from the top the first time you plant.',
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
    description: 'Turn spare delivery boxes into neat drawer organizers for pens, tools, and office supplies.',
    requiredMaterials: [
      'Clean cardboard shipping boxes or cereal boxes',
      'Wrapping paper, kraft paper, or tape',
      'School glue (PVA glue) or craft tape',
    ],
    toolsRequired: [
      'Scissors or craft knife',
      'Ruler',
      'Pencil',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '30 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Measure your drawer',
        instruction: 'Measure the inside length, width, and depth of your drawer with a ruler. Mark cutting lines on your cardboard with a pencil.',
        diagramKey: 'cardboard-step-1',
        diagramType: 'measure',
        diagramNote: 'Make the dividers slightly shorter than the drawer so it opens and closes easily.',
        measurements: ['Ruler dimensions: Length x Width x Drawer Height'],
        labels: ['Drawer Frame', 'Width Guide', 'Depth Guide', 'Pencil Line'],
        requiredTools: ['Ruler', 'Pencil'],
        tip: 'Check your drawer depth so the dividers do not get caught when closing.',
      },
      {
        stepNumber: 2,
        title: 'Cut your cardboard strips',
        instruction: 'Carefully cut the cardboard along your marked lines using scissors or a craft knife with a ruler.',
        diagramKey: 'cardboard-step-2',
        diagramType: 'cut',
        diagramNote: 'Cut slowly along a ruler to keep every edge straight and clean.',
        labels: ['Cardboard Sheet', 'Cut Line (Red Dashed)', 'Ruler Guide', 'Craft Knife'],
        requiredTools: ['Craft knife or scissors', 'Ruler', 'Cutting mat'],
        safetyWarning: 'Keep fingers behind the ruler edge when cutting with a blade.',
      },
      {
        stepNumber: 3,
        title: 'Cut matching slots',
        instruction: 'Cut vertical slots halfway down each cardboard strip so they can slide into each other like a puzzle.',
        diagramKey: 'cardboard-step-3',
        diagramType: 'cut',
        diagramNote: 'Make slots the same thickness as the cardboard so the pieces lock together tightly without glue.',
        measurements: ['Slot depth: Halfway down the strip (~50%)'],
        labels: ['Horizontal Divider', 'Vertical Divider', 'Halfway Slot', 'Slide Direction'],
        requiredTools: ['Scissors or craft knife', 'Pencil'],
        tip: 'Snug slots hold your compartments square and sturdy without needing hot glue.',
      },
      {
        stepNumber: 4,
        title: 'Slide together and organize',
        instruction: 'Slide the strips together into a grid, set it inside your drawer, and organize your pens, pencils, and desk items.',
        diagramKey: 'cardboard-step-4',
        diagramType: 'assemble',
        diagramNote: 'Cover exposed edges with tape or paper for a smooth, finished look.',
        labels: ['Grid Organizer', 'Pens & Pencils Section', 'Sticky Notes Section', 'Clean Wrapped Edge'],
        requiredTools: ['Glue or tape brush'],
        requiredMaterials: ['School glue', 'Wrapping paper or tape'],
        tip: 'Wrapping your cardboard with leftover gift wrap makes it look like store-bought organizer bins!',
      },
    ],
    safetyPrecautions: [
      'Keep fingers away from the cutting blade when slicing cardboard.',
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
    description: 'Turn clean wooden shipping pallets into sturdy, comfortable outdoor chairs and tables.',
    requiredMaterials: [
      '2-3 clean wooden pallets (with HT heat-treated stamp)',
      'Wood screws (3-inch and 4-inch)',
      'Wood oil or outdoor stain',
      'Outdoor cushions or pillows',
    ],
    toolsRequired: [
      'Sandpaper or sander (80 and 120 grit)',
      'Screwdriver or cordless drill',
      'Hammer or pry bar to pull old nails',
      'Paintbrush',
    ],
    difficultyLevel: 'Advanced',
    estimatedCompletionTime: '3.0 hrs',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Check the safety stamp',
        instruction: 'Look on the side of the pallet for an "HT" stamp (Heat-Treated, safe to use). Avoid any pallets marked "MB" (chemically treated).',
        diagramKey: 'pallet-step-1',
        diagramType: 'measure',
        diagramNote: 'Only use pallets marked HT or DB. Never use pallets marked MB (chemical pesticides).',
        labels: ['Wood Stringer', 'Safe "HT" Stamp', 'Avoid "MB" Stamp'],
        safetyWarning: 'Do not use or burn pallets marked MB. Chemical fumes are harmful.',
        tip: 'HT pallets are treated only with hot air, making them safe for home and garden furniture.',
      },
      {
        stepNumber: 2,
        title: 'Remove any old nails',
        instruction: 'Check the wood for sticking-out nails or staples and pull them out with a hammer or pliers.',
        diagramKey: 'pallet-step-2',
        diagramType: 'clean',
        diagramNote: 'Remove all metal nails flush so sandpaper and clothes do not snag on them.',
        labels: ['Wood Plank', 'Old Rusty Nail', 'Hammer Claw', 'Clean Nail Hole'],
        requiredTools: ['Hammer or pry bar', 'Pliers'],
        safetyWarning: 'Wear leather work gloves to protect your hands from rusty nails.',
      },
      {
        stepNumber: 3,
        title: 'Sand the wood smooth',
        instruction: 'Sand all rough areas until the wood is smooth to the touch and completely free of splinters.',
        diagramKey: 'pallet-step-3',
        diagramType: 'sand',
        diagramNote: 'Sand with the grain to remove rough spots and make the wood silky smooth.',
        measurements: ['Start with 80-grit, finish with 120-grit smooth'],
        labels: ['Rough Wood Plank', 'Sanded Smooth Wood', 'Sanding Block'],
        requiredTools: ['Sandpaper (80 & 120 grit)'],
        safetyWarning: 'Wear a simple dust mask when sanding wood.',
      },
      {
        stepNumber: 4,
        title: 'Stack and screw together',
        instruction: 'Stack two pallets for the seat. Stand a third pallet up behind them for the backrest, and screw them together firmly with wood screws.',
        diagramKey: 'pallet-step-4',
        diagramType: 'assemble',
        diagramNote: 'Screw into the solid 2x4 beams so the chair holds weight securely.',
        measurements: ['Seat height: ~18 inches (45 cm)', '4-inch exterior wood screws'],
        labels: ['Stacked Base Pallets', 'Backrest Pallet', 'Wood Screws (x4)'],
        requiredTools: ['Drill or screwdriver', 'Screw bits'],
        requiredMaterials: ['Exterior wood screws'],
        tip: 'Tilt the backrest back slightly for a much more comfortable sitting angle.',
      },
      {
        stepNumber: 5,
        title: 'Seal wood and add cushions',
        instruction: 'Paint or brush on wood sealer to protect against rain and sun. Add your favorite outdoor cushions to finish your lounge chair.',
        diagramKey: 'pallet-step-5',
        diagramType: 'finish',
        diagramNote: 'Wood oil or stain soaks into the pine, keeping water out while highlighting the natural grain.',
        labels: ['Finished Pallet Lounge', 'Seat Cushion', 'Oil Brush'],
        requiredTools: ['Paintbrush', 'Clean rag'],
        requiredMaterials: ['Wood sealer or boiled linseed oil', 'Outdoor cushions'],
        tip: 'Let the oil dry completely before putting cushions on the chair.',
      },
    ],
    safetyPrecautions: [
      'Wear safety glasses and a dust mask when sanding reclaimed timber.',
      'Make sure screws are driven in deep so the chair holds body weight safely.',
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
    description: 'Cut an old cotton t-shirt into soft fabric yarn and tie a simple, beautiful plant hanger.',
    requiredMaterials: [
      '1 old cotton t-shirt',
      'Curtain ring or metal ring (optional)',
      'Ruler or measuring tape',
    ],
    toolsRequired: [
      'Fabric scissors',
      'Door handle or hook to hold cords while tying',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '30 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Cut the shirt into strips',
        instruction: 'Lay the t-shirt flat. Cut off the bottom hem and sleeves, then cut 1-inch strips across the body, stopping 1 inch before the side edge.',
        diagramKey: 'tshirt-step-1',
        diagramType: 'cut',
        diagramNote: 'Leaving 1 inch uncut along the side is the secret to making one long, unbroken string of yarn.',
        measurements: ['Strip width: 1 inch (2.5 cm)', 'Uncut edge: 1 inch (2.5 cm)'],
        labels: ['T-Shirt Body', 'Cut Lines (Red Dashed)', 'Uncut Side Edge', 'Scissors'],
        requiredTools: ['Fabric scissors'],
        tip: 'Iron the t-shirt flat first so your cuts are straight and even.',
      },
      {
        stepNumber: 2,
        title: 'Cut diagonally to connect',
        instruction: 'Open the uncut side flat and cut diagonally from one strip to the next to turn the strips into one long yarn ribbon.',
        diagramKey: 'tshirt-step-2',
        diagramType: 'cut',
        diagramNote: 'Cutting diagonally connects the loops into one continuous ball of yarn.',
        labels: ['Uncut Seam Area', 'Diagonal Cut Line', 'Continuous Yarn Strand'],
        requiredTools: ['Fabric scissors'],
        tip: 'Lay the seam flat on a table so you can see where each diagonal cut goes.',
      },
      {
        stepNumber: 3,
        title: 'Pull and stretch the yarn',
        instruction: 'Pull the fabric ribbon firmly through your hands. The edges will curl inward to make soft, round rope.',
        diagramKey: 'tshirt-step-3',
        diagramType: 'fold',
        diagramNote: 'Stretching jersey cotton makes it curl up tightly into round, lint-free macrame cord.',
        labels: ['Flat Ribbon', 'Pull with Hands', 'Curled Yarn Ball'],
        tip: 'Roll the cord into a ball as you stretch it to keep it from getting tangled.',
      },
      {
        stepNumber: 4,
        title: 'Knot into a plant cradle',
        instruction: 'Cut 8 equal cords, tie them together at the bottom with a big knot, and tie knots in pairs to form a net that holds your flower pot.',
        diagramKey: 'tshirt-step-4',
        diagramType: 'assemble',
        diagramNote: 'The knotted net stretches gently to fit small and medium flower pots.',
        labels: ['Top Ring or Loop', 'Square Knots', 'Flower Pot Cradle', 'Bottom Tassel Knot'],
        requiredTools: ['Ruler', 'Scissors'],
        requiredMaterials: ['Ring (optional)', '8 pieces of t-shirt cord'],
        safetyWarning: 'Test your knots over a bed or sofa first before hanging a heavy pot.',
      },
    ],
    safetyPrecautions: [
      'Test your knots over a soft surface before hanging a breakable ceramic pot.',
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
    description: 'Remove rust from an old cast iron skillet and bake on a smooth, non-stick cooking surface.',
    requiredMaterials: [
      'Rusted cast iron pan',
      'Coarse salt',
      'Cooking oil (canola, vegetable, or flaxseed oil)',
      'Steel wool pad',
    ],
    toolsRequired: [
      'Dish scrub brush',
      'Paper towels or clean rag',
      'Kitchen oven (450°F / 230°C)',
      'Stovetop burner',
    ],
    difficultyLevel: 'Moderate',
    estimatedCompletionTime: '2.0 hrs',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Scrub away the rust',
        instruction: 'Scrub the rusted areas firmly with steel wool, coarse salt, and warm water until you see clean, dark grey metal.',
        diagramKey: 'castiron-step-1',
        diagramType: 'clean',
        diagramNote: 'Scrub until all orange rust is gone and clean grey iron is visible.',
        labels: ['Rusty Surface', 'Clean Grey Iron', 'Steel Wool Pad'],
        requiredTools: ['Steel wool', 'Scrub brush'],
        requiredMaterials: ['Coarse salt', 'Dish soap', 'Warm water'],
        safetyWarning: 'Rinse thoroughly so no bits of steel wool or rust dust are left behind.',
      },
      {
        stepNumber: 2,
        title: 'Dry completely on the stove',
        instruction: 'Dry the pan with a towel and set it on the stove over medium heat for 5 minutes so every drop of moisture dries out.',
        diagramKey: 'castiron-step-2',
        diagramType: 'heat',
        diagramNote: 'Heat evaporates all moisture so new rust cannot form.',
        measurements: ['Heat for 5 minutes on medium stove flame'],
        labels: ['Stove Burner Flame', 'Skillet Pan', 'Evaporating Steam'],
        requiredTools: ['Stovetop', 'Oven mitt'],
        safetyWarning: 'The metal handle gets very hot in seconds. Always hold with an oven mitt.',
      },
      {
        stepNumber: 3,
        title: 'Rub on a tiny bit of oil',
        instruction: 'Put half a teaspoon of cooking oil in the pan. Rub it all over with a paper towel until the pan looks almost dry, not wet or greasy.',
        diagramKey: 'castiron-step-3',
        diagramType: 'clean',
        diagramNote: 'A paper-thin coat of oil is key. Wipe it as if you applied the oil by mistake and are trying to wipe it off.',
        measurements: ['Use just 1/2 teaspoon of cooking oil'],
        labels: ['Skillet Pan', 'Few Drops of Oil', 'Paper Towel'],
        requiredTools: ['Paper towels or clean cloth'],
        requiredMaterials: ['Cooking oil (canola or vegetable)'],
        tip: 'Wipe away any puddles—too much oil will turn sticky instead of smooth.',
      },
      {
        stepNumber: 4,
        title: 'Bake in the oven',
        instruction: 'Place the pan upside down in your oven at 450°F (230°C) for 1 hour. Turn off the oven and let it cool inside.',
        diagramKey: 'castiron-step-4',
        diagramType: 'finish',
        diagramNote: 'Baking upside down creates a glossy, non-stick protective coat that lasts for years.',
        measurements: ['Bake at 450°F (230°C) for 1 hour'],
        labels: ['Oven Rack', 'Upside-Down Pan', 'Foil Sheet on Bottom', 'Smooth Black Finish'],
        requiredTools: ['Oven', 'Oven mitts'],
        requiredMaterials: ['Sheet of aluminum foil to catch drips'],
        safetyWarning: 'Let the pan cool completely inside the oven before touching it.',
      },
    ],
    safetyPrecautions: [
      'Always handle hot iron with thick oven mitts.',
      'Open a window or turn on the stove vent while baking.',
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
    description: 'Clean food cans, smooth the edges, and attach them to a wooden handle for a handy table or garden caddy.',
    requiredMaterials: [
      '4-6 clean soup or vegetable cans (same height)',
      'Scrap wooden block (about 12 inches long)',
      'Old leather belt, webbing, or rope for handle',
      'Short wood screws with small washers',
    ],
    toolsRequired: [
      'Can opener or metal file',
      'Drill or hammer with nail to poke holes',
      'Screwdriver',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '45 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Clean and smooth the rims',
        instruction: 'Remove paper labels and wash the cans with soap. Check the inside rims and use pliers or a metal file to flatten any sharp edges.',
        diagramKey: 'tincan-step-1',
        diagramType: 'sand',
        diagramNote: 'Make sure the inside edge is completely smooth so fingers can reach inside safely.',
        labels: ['Clean Tin Can', 'Smooth Inside Rim', 'Metal File or Spoon'],
        requiredTools: ['Metal file or pliers', 'Sponge'],
        safetyWarning: 'Wear work gloves when smoothing fresh metal can edges.',
      },
      {
        stepNumber: 2,
        title: 'Drill mounting holes',
        instruction: 'Mark a small hole half an inch below the top rim of each can and drill a small pilot hole for the mounting screw.',
        diagramKey: 'tincan-step-2',
        diagramType: 'drill',
        diagramNote: 'Drill the hole half an inch from the top edge for the best balance.',
        measurements: ['Small hole 1/2 inch below the top rim'],
        labels: ['Tin Can Side', 'Hole Mark', 'Wood Block', 'Drill Bit'],
        requiredTools: ['Drill or nail and hammer'],
        safetyWarning: 'Hold the can firmly against a piece of scrap wood while drilling.',
      },
      {
        stepNumber: 3,
        title: 'Screw cans to a wood block',
        instruction: 'Screw the cans in pairs onto both sides of a scrap wood block using short wood screws and a screwdriver.',
        diagramKey: 'tincan-step-3',
        diagramType: 'assemble',
        diagramNote: 'Mount 2 or 3 cans on each side of the central wooden block.',
        labels: ['Center Wood Block', 'Left Cans', 'Right Cans', 'Wood Screws'],
        requiredTools: ['Screwdriver'],
        requiredMaterials: ['Short wood screws', 'Small washers'],
        tip: 'Put a small washer on the screw inside the can so it holds tight against the metal.',
      },
      {
        stepNumber: 4,
        title: 'Add a handle',
        instruction: 'Screw an old leather belt strap or rope to the top of the wood block to carry your utensils, markers, or garden tools easily.',
        diagramKey: 'tincan-step-4',
        diagramType: 'finish',
        diagramNote: 'Old leather belts or thick ropes make comfortable carrying handles.',
        labels: ['Leather Handle Strap', 'Top Screws', 'Wood Center Block', 'Filled Caddy'],
        requiredTools: ['Screwdriver'],
        requiredMaterials: ['Old belt strap or rope', 'Screws'],
        tip: 'You can paint the cans with leftover craft paint for a fun, colorful look.',
      },
    ],
    safetyPrecautions: [
      'Wear work gloves when touching raw metal edges.',
      'Make sure all can rims are filed smooth before everyday use.',
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
    description: 'Cut an empty plastic milk jug using its handle to make an unbreakable scoop for garden soil, pet food, or bird seed.',
    requiredMaterials: [
      'Clean empty 1-gallon plastic milk or water jug',
      'Masking tape or marker',
    ],
    toolsRequired: [
      'Heavy scissors or shears',
      'Sandpaper',
      'Marker',
    ],
    difficultyLevel: 'Easy',
    estimatedCompletionTime: '15 mins',
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: 'Wash and dry the jug',
        instruction: 'Rinse a clean 1-gallon plastic milk jug with warm soapy water and let it dry completely.',
        diagramKey: 'milkJug-step-1',
        diagramType: 'clean',
        diagramNote: 'Milk jug plastic is durable, frost-proof, and will not crack when scooping heavy soil.',
        labels: ['Clean Milk Jug', 'Handle Grip', '#2 Plastic Symbol'],
        requiredTools: ['Warm soapy water', 'Towel'],
        requiredMaterials: ['Empty clean milk jug'],
        safetyWarning: 'Only use milk or water jugs; never use jugs that held motor oil or weed killer.',
      },
      {
        stepNumber: 2,
        title: 'Mark a diagonal cut line',
        instruction: 'Use a marker or masking tape to draw a slanted line starting right under the handle and sloping down toward the bottom corner.',
        diagramKey: 'milkJug-step-2',
        diagramType: 'measure',
        diagramNote: 'A slanted line gives you a wide mouth for scooping and a comfortable handle angle.',
        measurements: ['Slanted line from handle base to bottom front corner'],
        labels: ['Jug Body', 'Handle', 'Masking Tape Line', 'Cut Line'],
        requiredTools: ['Masking tape', 'Marker'],
        tip: 'Putting tape along your line helps keep your scissors straight as you cut.',
      },
      {
        stepNumber: 3,
        title: 'Cut along your line',
        instruction: 'Cut along the line with scissors. The jug\'s handle becomes your grip, and the angled bottom becomes your scoop! Sand edges smooth.',
        diagramKey: 'milkJug-step-3',
        diagramType: 'cut',
        diagramNote: 'Smooth the cut plastic edges with sandpaper so they are soft and comfortable to touch.',
        labels: ['Finished Scoop', 'Handle Grip', 'Wide Scoop Mouth', 'Bottom Cutoff (Recycle)'],
        requiredTools: ['Scissors', 'Sandpaper'],
        tip: 'Leave the screw cap on tight so dirt and food do not spill out of the top spout.',
      },
    ],
    safetyPrecautions: [
      'Never use jugs that previously held motor oil, lawn chemicals, or bleach.',
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
