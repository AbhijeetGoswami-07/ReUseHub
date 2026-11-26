import { ProductItem, RecommendationPlan, ReuseAction } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

export interface AnalysisResult {
  product: ProductItem;
  recommendedAction: ReuseAction;
  rankedActions: ReuseAction[];
  actionPlans: Record<ReuseAction, RecommendationPlan>;
  applicablePlans: RecommendationPlan[];
  inapplicablePlans: RecommendationPlan[];
  analysisSummary: string;
  safetySummary: string;
}

/**
 * ReUseHub Rule-Based Product Recommendation Engine
 * Evaluates product taxonomy, material properties, physical condition, and safety criteria
 * to calculate practical and prioritized recommendations across the 5 circular pathways.
 */
export function generateRecommendations(product: ProductItem): AnalysisResult {
  const titleLower = (product.title || '').toLowerCase();
  const descLower = (product.description || '').toLowerCase();
  const { category, material, condition } = product;

  // Base emissions factors per kg
  const lcaFactors: Record<string, { co2: number; waste: number; water?: number }> = {
    clothing: { co2: 8.5, waste: 0.8, water: 2700 },
    plastic: { co2: 3.2, waste: 0.5, water: 45 },
    electronics: { co2: 65.0, waste: 2.2, water: 1200 },
    furniture: { co2: 28.0, waste: 14.0, water: 350 },
    glass: { co2: 2.4, waste: 1.2, water: 80 },
    paper: { co2: 1.6, waste: 0.6, water: 120 },
    metal: { co2: 12.0, waste: 3.5, water: 200 },
    household_items: { co2: 5.5, waste: 1.8, water: 150 },
    other: { co2: 4.0, waste: 1.5, water: 100 },
  };
  const baseLCA = lcaFactors[category] || lcaFactors.other;

  // Keyword flags for specialized rules
  const isTshirt = titleLower.includes('t-shirt') || titleLower.includes('tshirt') || titleLower.includes('shirt') || titleLower.includes('top');
  const isBottle = titleLower.includes('bottle') || titleLower.includes('jug') || titleLower.includes('container') || titleLower.includes('flask');
  const isJar = titleLower.includes('jar') || titleLower.includes('mason') || titleLower.includes('canister');
  const isChair = titleLower.includes('chair') || titleLower.includes('stool') || titleLower.includes('bench') || titleLower.includes('seat');
  const isBatteryOrPower = titleLower.includes('battery') || titleLower.includes('charger') || titleLower.includes('power');
  const isHazardousOrChemical = descLower.includes('chemical') || descLower.includes('toxic') || descLower.includes('leaking') || descLower.includes('battery acid') || titleLower.includes('pesticide');

  // Condition mapping
  const isLikeNew = condition === 'like_new';
  const isGood = condition === 'good';
  const isNeedsRepair = condition === 'needs_repair' || (condition as string) === 'minor_fault';
  const isDamaged = condition === 'damaged' || (condition as string) === 'broken';
  const isUnusable = condition === 'unusable' || (condition as string) === 'scrap';

  // =========================================================================
  // 1. REUSE RULES
  // =========================================================================
  let reusePlan: RecommendationPlan;

  if (isHazardousOrChemical) {
    reusePlan = {
      id: `rec-reuse-${product.id}`,
      action: 'reuse',
      title: 'Direct Reuse (Not Recommended - Chemical Risk)',
      isApplicable: false,
      inapplicableReason: 'Direct household reuse is prohibited due to hazardous chemical residue and safety hazards.',
      safetyRiskLevel: 'prohibited',
      safetyNotes: 'DO NOT reuse containers that held toxic substances, solvents, or leaking chemicals for food, drink, or general household use.',
      difficulty: 'advanced',
      estimatedTimeMinutes: 0,
      estimatedEffort: 'Not recommended',
      requiredMaterials: [],
      environmentalImpact: { co2KgSaved: 0, wasteKgDiverted: 0 },
      summary: 'Hazardous materials should bypass direct household reuse and proceed directly to certified municipal chemical recycling.',
      steps: [],
    };
  } else if (isUnusable) {
    reusePlan = {
      id: `rec-reuse-${product.id}`,
      action: 'reuse',
      title: 'Direct Reuse (Not Applicable)',
      isApplicable: false,
      inapplicableReason: 'Item is structurally compromised or unusable in its current state without extensive re-manufacturing.',
      safetyRiskLevel: 'high',
      difficulty: 'advanced',
      estimatedTimeMinutes: 0,
      estimatedEffort: 'N/A',
      requiredMaterials: [],
      environmentalImpact: { co2KgSaved: 0, wasteKgDiverted: 0 },
      summary: 'This item cannot be reused safely in its current broken state. Consider recycling or material component harvesting.',
      steps: [],
    };
  } else if (isTshirt) {
    reusePlan = {
      id: `rec-reuse-${product.id}`,
      action: 'reuse',
      title: 'Use as an Absorbent Cleaning Cloth',
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 10,
      estimatedEffort: '10 mins',
      requiredMaterials: ['Fabric Scissors', 'Storage Bin / Basket'],
      safetyNotes: 'Ensure the fabric is free of metal pins or rough zippers before wiping scratch-sensitive glass or car paint.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.95).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
        waterLitersSaved: baseLCA.water,
      },
      summary: 'Cut the cotton T-shirt into lint-free cleaning cloths for kitchen counters, car detailing, or workshop dusting.',
      steps: [
        { stepNumber: 1, instruction: 'Wash the T-shirt in hot water to remove any fabric softeners and maximize absorbency.' },
        { stepNumber: 2, instruction: 'Trim off the thick collar, arm hems, and side seams with sharp scissors.' },
        { stepNumber: 3, instruction: 'Cut the remaining front and back panels into uniform 10x10 inch wipes.' },
      ],
      nearbyOptions: [{ type: 'dropoff', name: 'Campus Student Material Exchange', distanceKm: 1.2 }],
    };
  } else if (isBottle && category === 'plastic') {
    reusePlan = {
      id: `rec-reuse-${product.id}`,
      action: 'reuse',
      title: 'Dry Storage Container (Cold / Dry Goods Only)',
      isApplicable: isGood || isLikeNew,
      inapplicableReason: isNeedsRepair || isDamaged ? 'Cracked or deformed plastic bottles cannot hold liquids or seal properly.' : undefined,
      safetyRiskLevel: 'low',
      difficulty: 'easy',
      estimatedTimeMinutes: 10,
      estimatedEffort: '10 mins',
      requiredMaterials: ['Mild Dish Soap', 'Warm Water'],
      safetyNotes: 'Do not fill with hot liquids or reuse indefinitely for warm drinking water to prevent microplastic degradation.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.9).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Use as a storage container for small fasteners, craft beads, garden seeds, or cold watering cans if clean and structurally intact.',
      steps: [
        { stepNumber: 1, instruction: 'Wash thoroughly with cool soapy water and allow to dry completely to prevent mold.' },
        { stepNumber: 2, instruction: 'Fill with non-perishable hardware items, potting seeds, or garden water.' },
      ],
    };
  } else if (isChair) {
    reusePlan = {
      id: `rec-reuse-${product.id}`,
      action: 'reuse',
      title: 'Restore as Everyday Seating',
      isApplicable: isLikeNew || isGood,
      inapplicableReason: isNeedsRepair || isDamaged ? 'Direct seating reuse is unsafe before fixing loose or damaged structural joints.' : undefined,
      safetyRiskLevel: isNeedsRepair ? 'moderate' : 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 15,
      estimatedEffort: '15 mins',
      requiredMaterials: ['Microfiber Cloth', 'Wood Cleaner or Mild Soap'],
      safetyNotes: 'Test weight-bearing capacity cautiously if the chair has been stored in damp conditions.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.95).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Clean surfaces and return the chair directly to service as a dining, desk, or balcony seating product.',
      steps: [
        { stepNumber: 1, instruction: 'Wipe all wooden surfaces with an organic wood cleaner or damp microfiber cloth.' },
        { stepNumber: 2, instruction: 'Check all four feet for level stability and apply felt pads to protect floors.' },
      ],
      nearbyOptions: [{ type: 'dropoff', name: 'Student Free-Store Furniture Hub', distanceKm: 1.5 }],
    };
  } else {
    reusePlan = {
      id: `rec-reuse-${product.id}`,
      action: 'reuse',
      title: `Direct Functional Repurposing of ${product.title}`,
      isApplicable: !isUnusable,
      inapplicableReason: isUnusable ? 'Item condition is too degraded for direct reuse.' : undefined,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 15,
      estimatedEffort: '15 mins',
      requiredMaterials: ['Mild Eco Detergent', 'Cleaning Cloth'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.9).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: `Clean the ${product.title} and deploy it for secondary duty in a garage, home office, workshop, or storage area.`,
      steps: [
        { stepNumber: 1, instruction: `Sanitize all exterior surfaces using non-toxic household cleaner.` },
        { stepNumber: 2, instruction: `Assign to an alternate utility station (workshop bench, pantry, garden shed).` },
      ],
    };
  }

  // =========================================================================
  // 2. REPAIR RULES
  // =========================================================================
  let repairPlan: RecommendationPlan;

  if (category === 'plastic' && (isBottle || material === 'plastic') && !titleLower.includes('appliance') && !titleLower.includes('furniture')) {
    // Plastic bottles/thin packaging: Repair is NOT applicable
    repairPlan = {
      id: `rec-repair-${product.id}`,
      action: 'repair',
      title: 'Structural Repair (Not Applicable)',
      isApplicable: false,
      inapplicableReason: 'Repair is usually not applicable for thin-walled plastic bottles or disposable polymer containers.',
      safetyRiskLevel: 'moderate',
      safetyNotes: 'Attempting to heat, melt, or glue thin plastic containers poses chemical exposure and leaching risks.',
      difficulty: 'advanced',
      estimatedTimeMinutes: 0,
      estimatedEffort: 'Not applicable',
      requiredMaterials: [],
      environmentalImpact: { co2KgSaved: 0, wasteKgDiverted: 0 },
      summary: 'Repair is not practically or economically viable for single-use plastic bottles. Prioritize upcycling or recycling.',
      steps: [],
    };
  } else if (isTshirt) {
    repairPlan = {
      id: `rec-repair-${product.id}`,
      action: 'repair',
      title: 'Fix Loose Stitching or Small Holes',
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 20,
      estimatedEffort: '15-20 mins',
      requiredMaterials: ['Sewing Needle', 'Color-matched Thread', 'Small Embroidery Hoop (Optional)'],
      safetyNotes: 'Keep sewing needles secured in a pin cushion when not in active use.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.88).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
        waterLitersSaved: baseLCA.water ? Math.round(baseLCA.water * 0.88) : undefined,
      },
      summary: 'Mend frayed seams or repair small punctures using a simple needle and thread to restore wearable life.',
      steps: [
        { stepNumber: 1, instruction: 'Turn T-shirt inside-out and isolate the loose seam or small tear.' },
        { stepNumber: 2, instruction: 'Thread needle with double strand and knot the end. Sew a small blind-stitch across the seam.' },
        { stepNumber: 3, instruction: 'Tie off securely on the interior side and gently iron flat.' },
      ],
      nearbyOptions: [{ type: 'repair_cafe', name: 'Downtown Community Mending Circle', distanceKm: 2.1 }],
    };
  } else if (isChair) {
    repairPlan = {
      id: `rec-repair-${product.id}`,
      action: 'repair',
      title: 'Replace Damaged Joints or Screws',
      isApplicable: true,
      safetyRiskLevel: 'low',
      difficulty: 'moderate',
      estimatedTimeMinutes: 45,
      estimatedEffort: '40-50 mins',
      requiredMaterials: ['PVA Hardwood Glue', 'Hardwood Dowel Pins or M6 Screws', 'Wood Clamp', 'Screwdriver / Drill'],
      safetyNotes: 'Wipe excess adhesive immediately. Allow adhesive to cure fully under clamp pressure before testing seating weight.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.88).toFixed(1)),
        wasteKgDiverted: Number((baseLCA.waste * 0.95).toFixed(1)),
      },
      summary: 'Replace loose screws, inject wood adhesive into separated dowel joints, and clamp securely to restore full structural rigidity.',
      steps: [
        { stepNumber: 1, instruction: 'Unscrew wobbly fasteners and inspect wood mortise holes for cracking.' },
        { stepNumber: 2, instruction: 'Inject wood glue into joint cavities, insert replacement dowels or tighten replacement screws.' },
        { stepNumber: 3, instruction: 'Apply bar clamps across chair legs and allow 8 hours to cure before sitting.' },
      ],
      nearbyOptions: [{ type: 'repair_cafe', name: 'Community Woodworking Tool Library', distanceKm: 2.8 }],
    };
  } else if (category === 'electronics') {
    repairPlan = {
      id: `rec-repair-${product.id}`,
      action: 'repair',
      title: 'Component Inspection & Solder/Cable Restoration',
      isApplicable: !isHazardousOrChemical,
      inapplicableReason: isHazardousOrChemical ? 'Corroded or leaking electronic cells cannot be repaired safely.' : undefined,
      safetyRiskLevel: 'moderate',
      difficulty: 'moderate',
      estimatedTimeMinutes: 60,
      estimatedEffort: '1 hour',
      requiredMaterials: ['Precision Screwdriver Kit', '99% Isopropyl Alcohol', 'Soldering Iron (Optional)'],
      safetyNotes: 'Always disconnect power cords and remove lithium battery cells before opening electronic enclosures.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.85).toFixed(1)),
        wasteKgDiverted: Number((baseLCA.waste * 0.9).toFixed(1)),
      },
      summary: 'Clean oxidized contact pins, re-solder loose wiring or ports, and replace modular wear parts.',
      steps: [
        { stepNumber: 1, instruction: 'Remove screws and carefully open outer casing using plastic pry tools.' },
        { stepNumber: 2, instruction: 'Inspect PCB for blown capacitors, broken solder joints, or dust buildup.' },
        { stepNumber: 3, instruction: 'Clean terminals with 99% alcohol and re-secure connection cables.' },
      ],
      nearbyOptions: [{ type: 'repair_cafe', name: 'Civic Electronics Repair Café', distanceKm: 3.1 }],
    };
  } else {
    repairPlan = {
      id: `rec-repair-${product.id}`,
      action: 'repair',
      title: `Mechanical Fastener & Surface Repair for ${product.title}`,
      isApplicable: !isUnusable,
      inapplicableReason: isUnusable ? 'Material degradation is beyond standard repair.' : undefined,
      safetyRiskLevel: 'low',
      difficulty: 'moderate',
      estimatedTimeMinutes: 35,
      estimatedEffort: '30-40 mins',
      requiredMaterials: ['General Hardware Toolset', 'Non-toxic Adhesive or Lubricant'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.82).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: `Disassemble wearable components of ${product.title}, replace worn fasteners, and realign structural elements.`,
      steps: [
        { stepNumber: 1, instruction: 'Identify failure points (loose screws, cracks, misalignment).' },
        { stepNumber: 2, instruction: 'Replace broken fasteners or bond stress fractures with appropriate adhesive.' },
      ],
      nearbyOptions: [{ type: 'repair_cafe', name: 'Neighborhood Repair Hub', distanceKm: 2.5 }],
    };
  }

  // =========================================================================
  // 3. UPCYCLE RULES
  // =========================================================================
  let upcyclePlan: RecommendationPlan;

  if (isTshirt) {
    upcyclePlan = {
      id: `rec-upcycle-${product.id}`,
      action: 'upcycle',
      title: 'Convert into a Reusable Market Tote Bag',
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 30,
      estimatedEffort: '25-30 mins',
      requiredMaterials: ['Fabric Scissors', 'Sewing Machine or Needle & Thread'],
      safetyNotes: 'Sharp fabric shears only; work on a flat cutting mat or clean tabletop.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.8).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
        waterLitersSaved: baseLCA.water ? Math.round(baseLCA.water * 0.8) : undefined,
      },
      summary: 'Transform an unwanted cotton T-shirt into a sturdy, washable market grocery tote without needing advanced tailoring skills.',
      steps: [
        { stepNumber: 1, instruction: 'Cut off both sleeves to form the shoulder strap handles.' },
        { stepNumber: 2, instruction: 'Cut a wider oval neckline to create the main bag opening.' },
        { stepNumber: 3, instruction: 'Turn T-shirt inside-out and sew a reinforced straight stitch across the bottom hem.' },
      ],
    };
  } else if (isBottle && category === 'plastic') {
    upcyclePlan = {
      id: `rec-upcycle-${product.id}`,
      action: 'upcycle',
      title: 'Convert into a Self-Watering Planter',
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 20,
      estimatedEffort: '15-20 mins',
      requiredMaterials: ['Utility Scissors / Box Cutter', 'Cotton String / Wick', 'Potting Soil & Herb Seedlings'],
      safetyNotes: 'Cut plastic slowly to avoid jagged edges; sand rim lightly if needed.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.75).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Convert a plastic bottle into an automated capillary herb planter for basil, mint, or succulents.',
      steps: [
        { stepNumber: 1, instruction: 'Cut the plastic bottle in half horizontally about 4 inches from the base.' },
        { stepNumber: 2, instruction: 'Invert the top funnel section upside-down into the bottom reservoir.' },
        { stepNumber: 3, instruction: 'Thread a cotton wick through the neck opening, fill top with soil, and pour water into base.' },
      ],
    };
  } else if (isChair) {
    upcyclePlan = {
      id: `rec-upcycle-${product.id}`,
      action: 'upcycle',
      title: 'Convert into a Decorative Plant Stand',
      isApplicable: isGood || isNeedsRepair || isDamaged,
      safetyRiskLevel: 'low',
      difficulty: 'moderate',
      estimatedTimeMinutes: 60,
      estimatedEffort: '1 hour',
      requiredMaterials: ['Sandpaper (120 & 220 grit)', 'Low-VOC Mineral Paint or Natural Wax', 'Paintbrush'],
      safetyNotes: 'Confirm the chair frame is structurally safe to support heavy ceramic plant pots before placing on elevated surfaces.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.75).toFixed(1)),
        wasteKgDiverted: Number((baseLCA.waste * 0.9).toFixed(1)),
      },
      summary: 'If the chair is worn for human seating, convert it into a decorative multi-tiered indoor plant stand or garden display pedestal.',
      steps: [
        { stepNumber: 1, instruction: 'Sand down rough varnish or peeled paint to create a smooth key.' },
        { stepNumber: 2, instruction: 'Apply two coats of weather-resistant eco-friendly chalk paint or outdoor wood stain.' },
        { stepNumber: 3, instruction: 'Arrange indoor potted ferns or hanging pothos across the seat base.' },
      ],
    };
  } else if (isJar && category === 'glass') {
    upcyclePlan = {
      id: `rec-upcycle-${product.id}`,
      action: 'upcycle',
      title: 'Bio-Active Herb Terrarium or Table Lamp',
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 25,
      estimatedEffort: '20-25 mins',
      requiredMaterials: ['Pea Gravel', 'Activated Charcoal', 'Potting Soil', 'Fairy LED String or Moss'],
      safetyNotes: 'Handle glass gently to avoid chipping the rim.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.8).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Convert glass jar into a self-sustaining indoor terrarium or ambient solar/battery-powered bedside lantern.',
      steps: [
        { stepNumber: 1, instruction: 'Soak jar in warm baking-soda solution to cleanly remove sticky commercial labels.' },
        { stepNumber: 2, instruction: 'Add 1 inch of drainage pebbles, 1 layer of activated charcoal, and organic potting soil.' },
        { stepNumber: 3, instruction: 'Insert small succulents or moss and mist lightly.' },
      ],
    };
  } else {
    upcyclePlan = {
      id: `rec-upcycle-${product.id}`,
      action: 'upcycle',
      title: `Artisanal Upcycling & Functional Redesign`,
      isApplicable: !isHazardousOrChemical,
      inapplicableReason: isHazardousOrChemical ? 'Upcycling hazardous containers into household goods is unsafe.' : undefined,
      safetyRiskLevel: 'low',
      difficulty: 'moderate',
      estimatedTimeMinutes: 45,
      estimatedEffort: '45 mins',
      requiredMaterials: ['Craft Tools', 'Sandpaper / Primer'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.7).toFixed(1)),
        wasteKgDiverted: Number((baseLCA.waste * 0.85).toFixed(1)),
      },
      summary: `Transform parts of ${product.title} into an innovative desk organizer, garden feature, or artistic storage unit.`,
      steps: [
        { stepNumber: 1, instruction: 'Deconstruct non-functional elements and save useful structural materials.' },
        { stepNumber: 2, instruction: 'Refinish with water-based sealant and assemble into secondary item.' },
      ],
    };
  }

  // =========================================================================
  // 4. DONATE RULES
  // =========================================================================
  let donatePlan: RecommendationPlan;

  if (isHazardousOrChemical) {
    donatePlan = {
      id: `rec-donate-${product.id}`,
      action: 'donate',
      title: 'Donation (Prohibited - Hazardous Product)',
      isApplicable: false,
      inapplicableReason: 'Donating hazardous chemicals, leaking batteries, or toxic containers is illegal and unsafe.',
      safetyRiskLevel: 'prohibited',
      safetyNotes: 'Never donate items containing unsealed hazardous substances to charity centers or individuals.',
      difficulty: 'easy',
      estimatedTimeMinutes: 0,
      estimatedEffort: 'Not applicable',
      requiredMaterials: [],
      environmentalImpact: { co2KgSaved: 0, wasteKgDiverted: 0 },
      summary: 'Charity organizations cannot accept hazardous materials. Direct to designated municipal chemical collection.',
      steps: [],
    };
  } else if (isUnusable || isDamaged) {
    donatePlan = {
      id: `rec-donate-${product.id}`,
      action: 'donate',
      title: 'Community Donation (Not Applicable)',
      isApplicable: false,
      inapplicableReason: isChair 
        ? 'Donate only after making it safe and usable. Broken or structurally unstable furniture poses safety hazards to recipients.' 
        : 'Donation centers and community recipients only accept clean, safe, and functioning items.',
      safetyRiskLevel: 'moderate',
      safetyNotes: 'Donating broken, hazardous, or soiled items burdens non-profit shelters with landfill disposal fees.',
      difficulty: 'easy',
      estimatedTimeMinutes: 0,
      estimatedEffort: 'Not applicable',
      requiredMaterials: [],
      environmentalImpact: { co2KgSaved: 0, wasteKgDiverted: 0 },
      summary: 'Do not donate damaged or unusable goods. Please repair the item first, upcycle it, or direct it to certified recycling.',
      steps: [],
    };
  } else if (isTshirt) {
    donatePlan = {
      id: `rec-donate-${product.id}`,
      action: 'donate',
      title: 'Donate if Clean and Wearable',
      isApplicable: isLikeNew || isGood,
      inapplicableReason: isNeedsRepair ? 'Clothing should be mended prior to donation to ensure it is immediately wearable.' : undefined,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 15,
      estimatedEffort: '15 mins',
      requiredMaterials: ['Laundry Detergent', 'Donation Tote Bag'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.85).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
        waterLitersSaved: baseLCA.water,
      },
      summary: 'Donate if clean, unstained, and wearable to local student clothing swaps, community shelters, or charities.',
      steps: [
        { stepNumber: 1, instruction: 'Launder the T-shirt thoroughly to ensure it is fresh and clean.' },
        { stepNumber: 2, instruction: 'Fold neatly and drop off at a verified local non-profit clothing bank or student swap.' },
      ],
      nearbyOptions: [
        { type: 'donation_center', name: 'Campus Student Mutual Aid Hub', distanceKm: 1.4 },
        { type: 'donation_center', name: 'City Green Goodwill Center', distanceKm: 2.9 },
      ],
    };
  } else if (isBottle && category === 'plastic') {
    donatePlan = {
      id: `rec-donate-${product.id}`,
      action: 'donate',
      title: 'Donate (Only if Clean and Useful)',
      isApplicable: isLikeNew,
      inapplicableReason: 'Most charity organizations do not accept single-use plastic bottles unless they are reusable insulated flasks.',
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 10,
      estimatedEffort: '10 mins',
      requiredMaterials: ['Sanitizing Wash'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.7).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Donate only if completely clean, food-safe, and truly useful (such as high-grade reusable bottles or school lab containers).',
      steps: [
        { stepNumber: 1, instruction: 'Confirm the bottle is sanitized and matches community donation guidelines.' },
      ],
    };
  } else if (isChair) {
    donatePlan = {
      id: `rec-donate-${product.id}`,
      action: 'donate',
      title: 'Donate to Community (Only After Making Safe and Usable)',
      isApplicable: isLikeNew || isGood,
      inapplicableReason: isNeedsRepair || isDamaged ? 'Donate only after making it safe and usable. Loose joints present a physical fall risk.' : undefined,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 20,
      estimatedEffort: '20 mins',
      requiredMaterials: ['Cloth for Dusting'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.9).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Pass the chair to university students, community centers, or list it free on ReUseHub for local pick-up.',
      steps: [
        { stepNumber: 1, instruction: 'Verify all joints are rigid and the seating surface is completely clean.' },
        { stepNumber: 2, instruction: 'Post on the ReUseHub Free Marketplace or drop off at local Habitat ReStore.' },
      ],
      nearbyOptions: [
        { type: 'donation_center', name: 'Habitat for Humanity ReStore', distanceKm: 3.5 },
      ],
    };
  } else {
    donatePlan = {
      id: `rec-donate-${product.id}`,
      action: 'donate',
      title: `Donate to Verified Local Community Hub`,
      isApplicable: isLikeNew || isGood,
      inapplicableReason: 'Item must be fully functional and safe to be accepted by donation partners.',
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 20,
      estimatedEffort: '20 mins',
      requiredMaterials: ['Transport Box / Bag'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.85).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: `Donate ${product.title} to local neighbors, non-profit mutual aid centers, or list it for free handoff.`,
      steps: [
        { stepNumber: 1, instruction: `Confirm the item is clean, sanitary, and functional.` },
        { stepNumber: 2, instruction: `Coordinate handoff via ReUseHub second-hand exchange or neighborhood center.` },
      ],
      nearbyOptions: [{ type: 'donation_center', name: 'Civic Reuse Share Center', distanceKm: 2.2 }],
    };
  }

  // =========================================================================
  // 5. RECYCLE RULES
  // =========================================================================
  let recyclePlan: RecommendationPlan;

  if (isTshirt) {
    recyclePlan = {
      id: `rec-recycle-${product.id}`,
      action: 'recycle',
      title: 'Send to Specialized Textile Recycler',
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 15,
      estimatedEffort: '15 mins',
      requiredMaterials: ['Recycling Bin'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.5).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Send unusable cotton textile material to an appropriate textile recycler or fabric shredding facility for acoustic insulation or carpet underlay.',
      steps: [
        { stepNumber: 1, instruction: 'Remove any non-cotton synthetic badges, plastic buttons, or metallic zippers.' },
        { stepNumber: 2, instruction: 'Drop off in designated municipal textile collection bins (do not place in standard blue curb recycling).' },
      ],
      nearbyOptions: [{ type: 'recycler', name: 'EcoFiber Municipal Textile Drop-off', distanceKm: 4.1 }],
    };
  } else if (isBottle && category === 'plastic') {
    recyclePlan = {
      id: `rec-recycle-${product.id}`,
      action: 'recycle',
      title: 'Send to Appropriate Plastic Recycling Facility',
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 10,
      estimatedEffort: '10 mins',
      requiredMaterials: ['Rinse Water'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.55).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Send to an appropriate plastic recycling facility or curbside polymer bin (#1 PET or #2 HDPE) after quick rinse.',
      steps: [
        { stepNumber: 1, instruction: 'Empty all liquids and rinse bottle with water to prevent residue fermentation.' },
        { stepNumber: 2, instruction: 'Crush bottle flat to save transportation volume and place cap back on.' },
        { stepNumber: 3, instruction: 'Place into standard clean municipal rigid plastic recycling stream.' },
      ],
      nearbyOptions: [{ type: 'recycler', name: 'Metro Clean Plastic Recovery Station', distanceKm: 2.4 }],
    };
  } else if (isChair) {
    recyclePlan = {
      id: `rec-recycle-${product.id}`,
      action: 'recycle',
      title: 'Recover Wood Materials if Repair is Not Practical',
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'moderate',
      estimatedTimeMinutes: 30,
      estimatedEffort: '30 mins',
      requiredMaterials: ['Screwdriver / Pry Bar'],
      safetyNotes: 'Beware of protruding screws or rusted staples when dismantling wood.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.4).toFixed(1)),
        wasteKgDiverted: Number((baseLCA.waste * 0.8).toFixed(1)),
      },
      summary: 'Recover suitable wood materials if repair is not practical. Separate metal screws from solid timber for community scrap yards or mulch.',
      steps: [
        { stepNumber: 1, instruction: 'Unscrew metal brackets, hinges, and fasteners from the timber frame.' },
        { stepNumber: 2, instruction: 'Untreated clean wood can be dropped off at community mulch depots or wood salvage banks.' },
      ],
      nearbyOptions: [{ type: 'recycler', name: 'Timber & Salvage Recovery Depot', distanceKm: 4.8 }],
    };
  } else if (isBatteryOrPower || category === 'electronics') {
    recyclePlan = {
      id: `rec-recycle-${product.id}`,
      action: 'recycle',
      title: 'Certified WEEE Electronic Recycling (Taped Terminals)',
      isApplicable: true,
      safetyRiskLevel: 'low',
      difficulty: 'easy',
      estimatedTimeMinutes: 20,
      estimatedEffort: '15-20 mins',
      requiredMaterials: ['Electrical Tape (for battery terminals)'],
      safetyNotes: 'Never place electronics or batteries into standard household trash bins; risk of compaction landfill fires.',
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.5).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: 'Deliver to certified WEEE e-waste recovery centers to harvest rare-earth metals and prevent heavy metal soil contamination.',
      steps: [
        { stepNumber: 1, instruction: 'Cover battery contacts or charging points with non-conductive electrical tape.' },
        { stepNumber: 2, instruction: 'Drop off at certified electronic waste depots or e-waste retailer drop bins.' },
      ],
      nearbyOptions: [{ type: 'recycler', name: 'GreenCircuit WEEE Recovery Hub', distanceKm: 3.2 }],
    };
  } else {
    recyclePlan = {
      id: `rec-recycle-${product.id}`,
      action: 'recycle',
      title: `Certified Material Separation & Recycling for ${product.title}`,
      isApplicable: true,
      safetyRiskLevel: 'none',
      difficulty: 'easy',
      estimatedTimeMinutes: 15,
      estimatedEffort: '15 mins',
      requiredMaterials: ['Bin Separation'],
      environmentalImpact: {
        co2KgSaved: Number((baseLCA.co2 * 0.45).toFixed(1)),
        wasteKgDiverted: baseLCA.waste,
      },
      summary: `Cleanly segregate ${material.replace('_', ' ')} components and direct to certified municipal collection.`,
      steps: [
        { stepNumber: 1, instruction: 'Separate metal, polymer, and composite sections to avoid cross-contamination.' },
        { stepNumber: 2, instruction: 'Drop off in certified regional municipal recycling stream.' },
      ],
      nearbyOptions: [{ type: 'recycler', name: 'Municipal Material Recovery Facility', distanceKm: 3.5 }],
    };
  }

  // =========================================================================
  // RECOMMENDATION RANKING ENGINE
  // Ranks suggestions based on:
  // 1. Safety (0-100)
  // 2. Product Condition (0-100)
  // 3. Practical Feasibility (0-100)
  // 4. Environmental Usefulness (0-100)
  // =========================================================================

  const actionPlans: Record<ReuseAction, RecommendationPlan> = {
    reuse: reusePlan,
    repair: repairPlan,
    upcycle: upcyclePlan,
    donate: donatePlan,
    recycle: recyclePlan,
  };

  const calculateRankScore = (action: ReuseAction, plan: RecommendationPlan): number => {
    if (!plan.isApplicable) return -100;

    // 1. Safety Score (35% weight)
    let safetyScore = 100;
    if (plan.safetyRiskLevel === 'prohibited') safetyScore = 0;
    else if (plan.safetyRiskLevel === 'high') safetyScore = 20;
    else if (plan.safetyRiskLevel === 'moderate') safetyScore = 60;
    else if (plan.safetyRiskLevel === 'low') safetyScore = 85;

    // 2. Condition Match Score (30% weight)
    let conditionScore = 50;
    if (isLikeNew) {
      if (action === 'reuse') conditionScore = 98;
      else if (action === 'donate') conditionScore = 92;
      else if (action === 'upcycle') conditionScore = 65;
      else if (action === 'repair') conditionScore = 20; // doesn't need repair
      else if (action === 'recycle') conditionScore = 15;
    } else if (isGood) {
      if (action === 'reuse') conditionScore = 95;
      else if (action === 'donate') conditionScore = 85;
      else if (action === 'upcycle') conditionScore = 80;
      else if (action === 'repair') conditionScore = 35;
      else if (action === 'recycle') conditionScore = 20;
    } else if (isNeedsRepair) {
      if (action === 'repair') conditionScore = 98;
      else if (action === 'upcycle') conditionScore = 82;
      else if (action === 'recycle') conditionScore = 55;
      else if (action === 'donate') conditionScore = 25; // shouldn't donate before repair
      else if (action === 'reuse') conditionScore = 20;
    } else if (isDamaged) {
      if (action === 'upcycle') conditionScore = 95;
      else if (action === 'repair') conditionScore = 75;
      else if (action === 'recycle') conditionScore = 70;
      else if (action === 'donate') conditionScore = 10;
      else if (action === 'reuse') conditionScore = 10;
    } else if (isUnusable) {
      if (action === 'recycle') conditionScore = 99;
      else if (action === 'upcycle') conditionScore = 40;
      else conditionScore = 0;
    }

    // 3. Practical Feasibility Score (20% weight)
    let feasibilityScore = 80;
    if (plan.difficulty === 'easy') feasibilityScore = 95;
    else if (plan.difficulty === 'moderate') feasibilityScore = 75;
    else if (plan.difficulty === 'advanced') feasibilityScore = 55;

    // 4. Environmental Circular Usefulness (15% weight)
    // Hierarchy: Reuse (100) > Repair (90) > Upcycle (80) > Donate (75) > Recycle (50)
    const envHierarchy: Record<ReuseAction, number> = {
      reuse: 100,
      repair: 90,
      upcycle: 80,
      donate: 75,
      recycle: 50,
    };
    const environmentalScore = envHierarchy[action] || 50;

    const weightedScore =
      safetyScore * 0.35 +
      conditionScore * 0.30 +
      feasibilityScore * 0.20 +
      environmentalScore * 0.15;

    return Math.round(weightedScore);
  };

  // Assign scores to all plans
  const allActions: ReuseAction[] = ['reuse', 'repair', 'upcycle', 'donate', 'recycle'];
  allActions.forEach((act) => {
    actionPlans[act].rankScore = calculateRankScore(act, actionPlans[act]);
  });

  // Filter applicable and sort by rankScore descending
  const applicablePlans = allActions
    .map((act) => actionPlans[act])
    .filter((p) => p.isApplicable && (p.rankScore || 0) > 0)
    .sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));

  const inapplicablePlans = allActions
    .map((act) => actionPlans[act])
    .filter((p) => !p.isApplicable || (p.rankScore || 0) <= 0);

  // Set rank positions
  applicablePlans.forEach((plan, idx) => {
    plan.rankPosition = idx + 1;
  });

  const rankedActions = applicablePlans.map((p) => p.action);
  const recommendedAction = rankedActions[0] || 'recycle';

  // Summaries
  const safetySummary = isHazardousOrChemical
    ? 'Safety Advisory: Item contains hazardous chemical or electrical risks. Direct household reuse is strictly filtered out.'
    : 'Safety Verified: All ranked recommendations comply with non-toxic, structurally stable household handling standards.';

  const analysisSummary = `ReUseHub evaluated "${product.title}" across the 5 circular pathways based on its "${condition.replace('_', ' ')}" condition and "${material.replace('_', ' ')}" substrate. Ranked highest: ${recommendedAction.toUpperCase()} (${actionPlans[recommendedAction].title}) with an evaluated score of ${actionPlans[recommendedAction].rankScore}/100.`;

  return {
    product,
    recommendedAction,
    rankedActions,
    actionPlans,
    applicablePlans,
    inapplicablePlans,
    analysisSummary,
    safetySummary,
  };
}

/**
 * Persist recommendations to database (Supabase and localStorage fallback)
 */
export async function saveRecommendationsToDatabase(
  analysis: AnalysisResult,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { product, recommendedAction, actionPlans } = analysis;

    // 1. LocalStorage caching for reliable client state
    const savedPlansKey = 'reusehub_saved_user_ideas';
    const existingStr = localStorage.getItem(savedPlansKey);
    const existing = existingStr ? JSON.parse(existingStr) : [];
    const record = {
      id: `saved-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      category: product.category,
      condition: product.condition,
      material: product.material,
      recommendedAction,
      topPlan: actionPlans[recommendedAction],
      savedAt: new Date().toISOString(),
    };
    existing.unshift(record);
    localStorage.setItem(savedPlansKey, JSON.stringify(existing.slice(0, 50)));

    // 2. Remote Supabase insertion if configured
    if (isSupabaseConfigured && userId) {
      const topPlan = actionPlans[recommendedAction];
      try {
        await supabase.from('saved_recommendations').insert({
          user_id: userId,
          product_title: product.title,
          category: product.category,
          action_type: recommendedAction,
          plan_title: topPlan.title,
          difficulty: topPlan.difficulty,
          estimated_effort: topPlan.estimatedEffort || `${topPlan.estimatedTimeMinutes} mins`,
          co2_saved_kg: topPlan.environmentalImpact.co2KgSaved,
          notes: topPlan.summary,
        });
      } catch (saveErr) {
        console.warn('Supabase saved_recommendations insert note:', saveErr);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Save recommendation error:', err);
    return { success: false, error: err?.message };
  }
}
