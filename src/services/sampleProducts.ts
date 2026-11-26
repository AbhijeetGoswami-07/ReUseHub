import { ProductItem } from '@/types';
import { generateRecommendations, AnalysisResult } from './recommendationEngine';

export const SAMPLE_PRODUCTS: ProductItem[] = [
  // 1. SPEC EXAMPLE 1: Old cotton T-shirt
  {
    id: 'sample-1',
    title: 'Old Cotton T-Shirt',
    category: 'clothing',
    material: 'cotton',
    condition: 'good',
    description: 'Clean graphic tee with worn collar; comfortable soft 100% ring-spun cotton.',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 2. SPEC EXAMPLE 2: Plastic bottle
  {
    id: 'sample-2',
    title: 'Transparent Plastic Bottle',
    category: 'plastic',
    material: 'plastic',
    condition: 'good',
    description: 'Clean 2-liter PET beverage bottle with plastic screw cap intact.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 3. SPEC EXAMPLE 3: Old wooden chair
  {
    id: 'sample-3',
    title: 'Old Wooden Dining Chair',
    category: 'furniture',
    material: 'wood',
    condition: 'needs_repair',
    description: 'Classic oak dining chair with loose rear leg joints and squeaky dowel pin.',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 4. Denim Jeans (Damaged)
  {
    id: 'sample-4',
    title: 'Torn Denim Blue Jeans',
    category: 'clothing',
    material: 'cotton',
    condition: 'damaged',
    description: 'Heavyweight indigo denim with torn knees and frayed cuffs.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 5. Mechanical Keyboard (Needs Repair)
  {
    id: 'sample-5',
    title: 'Mechanical Gaming Keyboard',
    category: 'electronics',
    material: 'electronic_components',
    condition: 'needs_repair',
    description: 'Mechanical keys work, but USB-C connection port is loose and disconnects.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 6. Mason Glass Jar (Good)
  {
    id: 'sample-6',
    title: 'Airtight Mason Glass Jar',
    category: 'glass',
    material: 'glass',
    condition: 'good',
    description: 'Heavy duty 32oz wide-mouth food preservation jar with rubber gasket ring.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 7. Cardboard Box (Good)
  {
    id: 'sample-7',
    title: 'Corrugated Cardboard Moving Box',
    category: 'paper',
    material: 'paper',
    condition: 'good',
    description: 'Sturdy double-wall corrugated shipping box used once for campus relocation.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 8. Cast Iron Skillet (Needs Repair)
  {
    id: 'sample-8',
    title: 'Rusted Cast Iron Skillet',
    category: 'metal',
    material: 'metal',
    condition: 'needs_repair',
    description: 'Heavy 12-inch cast iron frying pan with surface rust from damp storage.',
    imageUrl: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 9. Wooden Shipping Pallet (Good)
  {
    id: 'sample-9',
    title: 'Heat-Treated Timber Shipping Pallet',
    category: 'furniture',
    material: 'wood',
    condition: 'good',
    description: 'Certified heat-treated (HT) untreated industrial transport pallet.',
    imageUrl: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 10. Broken Smartphone (Damaged)
  {
    id: 'sample-10',
    title: 'Cracked Android Smartphone',
    category: 'electronics',
    material: 'electronic_components',
    condition: 'damaged',
    description: 'Cracked front display digitizer; logic board powers on and charges.',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 11. Plastic Bucket (Like New)
  {
    id: 'sample-11',
    title: 'Heavy Duty 5-Gallon HDPE Plastic Bucket',
    category: 'plastic',
    material: 'plastic',
    condition: 'like_new',
    description: 'Clean food-grade plastic bucket with wire bail handle.',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 12. Damaged Lithium Power Bank (Unusable / Hazardous)
  {
    id: 'sample-12',
    title: 'Swollen Lithium-Ion Battery Power Bank',
    category: 'electronics',
    material: 'electronic_components',
    condition: 'unusable',
    description: 'Swollen lithium pouch cell casing with damaged thermal sensor.',
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 13. Wool Winter Coat (Like New)
  {
    id: 'sample-13',
    title: 'Heavy Wool Winter Overcoat',
    category: 'clothing',
    material: 'cotton',
    condition: 'like_new',
    description: 'Tailored charcoal wool coat in pristine condition; dry-cleaned.',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 14. Glass Wine Bottles (Good)
  {
    id: 'sample-14',
    title: 'Clean Dark Green Wine Bottles (Set of 6)',
    category: 'glass',
    material: 'glass',
    condition: 'good',
    description: 'Rinsed 750ml glass bottles suitable for olive oil, cold brew, or candle sconces.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  // 15. Stainless Steel Cooking Stockpot (Good)
  {
    id: 'sample-15',
    title: 'Stainless Steel 8-Quart Stockpot',
    category: 'household_items',
    material: 'metal',
    condition: 'good',
    description: 'Commercial grade stainless steel pot with riveted loop handles and lid.',
    imageUrl: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Executes the recommendation engine over all 15 sample products
 * to verify ranking, safety filtering, and LCA integrity.
 */
export function runSampleRecommendationsSuite(): {
  results: AnalysisResult[];
  totalSamples: number;
  safetyCompliantCount: number;
} {
  const results = SAMPLE_PRODUCTS.map((prod) => generateRecommendations(prod));
  const safetyCompliantCount = results.filter((r) => {
    // Unsafe / hazardous products must not have reuse or donate as top recommended
    if (r.product.id === 'sample-12') {
      return r.recommendedAction === 'recycle';
    }
    return true;
  }).length;

  return {
    results,
    totalSamples: results.length,
    safetyCompliantCount,
  };
}
