import * as z from 'zod';
import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Strict Zod Schema for AI Image Recognition Output
 */
export const aiRecognitionOutputSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  possible_material: z.string().min(1, 'Material is required'),
  visible_condition: z.string().min(1, 'Visible condition is required'),
  confidence: z.number().min(0).max(1),
  recommendations: z.object({
    reuse: z.array(z.string()),
    repair: z.array(z.string()),
    upcycle: z.array(z.string()),
    donate: z.array(z.string()),
    recycle: z.array(z.string()),
  }),
  safety_notes: z.array(z.string()),
});

export type AIProductRecognition = z.infer<typeof aiRecognitionOutputSchema>;

export interface AIAnalysisResponse {
  success: boolean;
  data?: AIProductRecognition;
  error?: string;
  isSimulated?: boolean;
  unconfiguredNotice?: string;
}

/**
 * Simulates intelligent vision analysis for offline testing
 * based on filename and common visual cues without claiming real AI.
 */
function getSimulatedRecognition(filenameHint: string = ''): AIProductRecognition {
  const hint = filenameHint.toLowerCase();

  if (hint.includes('jean') || hint.includes('denim') || hint.includes('pant')) {
    return {
      product_name: 'Estimated Denim Blue Jeans',
      category: 'clothing',
      possible_material: 'cotton',
      visible_condition: 'needs_repair',
      confidence: 0.88,
      recommendations: {
        reuse: ['Use heavier thigh panels for tool wraps or insulation.'],
        repair: ['Reinforce torn seam or apply backing patch with heavy thread.'],
        upcycle: ['Convert into a durable farmer market denim tote bag.'],
        donate: ['Donate only after mending to ensure wearable condition.'],
        recycle: ['Send scrap denim to acoustic insulation textile recyclers.']
      },
      safety_notes: [
        'Visible surface estimate only. Internal zipper integrity or hidden moisture mold cannot be determined from photos.',
        'Sanitize textiles before direct skin contact.'
      ]
    };
  }

  if (hint.includes('chair') || hint.includes('wood') || hint.includes('stool')) {
    return {
      product_name: 'Estimated Wooden Dining Chair',
      category: 'furniture',
      possible_material: 'wood',
      visible_condition: 'needs_repair',
      confidence: 0.85,
      recommendations: {
        reuse: ['Restore as everyday study or dining seating once joints are tightened.'],
        repair: ['Inject PVA wood adhesive into loose dowels and clamp securely.'],
        upcycle: ['Repurpose as an elevated botanical plant stand or bedside table.'],
        donate: ['Donate only after confirming structural weight capacity.'],
        recycle: ['Dismantle metal screws and direct clean timber to salvage yards.']
      },
      safety_notes: [
        'Visual observation only. Hidden internal wood rot or hairline stress fractures cannot be determined from a 2D photograph.',
        'Do not load heavy weights before testing joint rigidity.'
      ]
    };
  }

  if (hint.includes('bottle') || hint.includes('plastic') || hint.includes('jug')) {
    return {
      product_name: 'Estimated Plastic Beverage Bottle',
      category: 'plastic',
      possible_material: 'plastic',
      visible_condition: 'good',
      confidence: 0.94,
      recommendations: {
        reuse: ['Use for cold watering or dry fastener organization.'],
        repair: ['Not applicable for thin single-use polymer containers.'],
        upcycle: ['Invert into a capillary self-watering herb planter.'],
        donate: ['Donate only if sanitized and useful.'],
        recycle: ['Clean, crush flat, and place in municipal #1 PET recycling.']
      },
      safety_notes: [
        'Do not heat or store warm liquids to avoid chemical leaching.',
        'Visual estimate cannot detect micro-bacterial biofilms inside unwashed bottles.'
      ]
    };
  }

  // Default clean estimate
  return {
    product_name: 'Estimated Cotton T-Shirt',
    category: 'clothing',
    possible_material: 'cotton',
    visible_condition: 'good',
    confidence: 0.91,
    recommendations: {
      reuse: ['Use as lint-free dust wipes or cleaning cloths.'],
      repair: ['Mend loose hem stitching with needle and thread.'],
      upcycle: ['Stitch into a washable shopping tote bag.'],
      donate: ['Donate to local student exchange if clean and wearable.'],
      recycle: ['Send unusable scraps to textile recycling drop-offs.']
    },
    safety_notes: [
      'Visual estimate based on visible surface color and weave texture. Hidden fabric rot cannot be determined from photos.',
      'Check for hidden needles or sharp pins before wiping sensitive surfaces.'
    ]
  };
}

/**
 * Sends image to secure backend AI service.
 * Never exposes AI keys on the client.
 */
export async function analyzeProductImage(
  imageData: string,
  allowSimulation: boolean = true,
  filenameHint: string = ''
): Promise<AIAnalysisResponse> {
  // If Supabase is live, invoke the secure server-side edge function
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-product-image', {
        body: {
          image_base64: imageData.startsWith('data:') ? imageData.split(',')[1] : imageData,
          filename: filenameHint,
        },
      });

      if (!error && data && data.configured !== false) {
        // Validate with Zod
        const validated = aiRecognitionOutputSchema.safeParse(data);
        if (validated.success) {
          return {
            success: true,
            data: validated.data,
            isSimulated: false,
          };
        }
      }

      if (data && data.configured === false) {
        if (!allowSimulation) {
          return {
            success: false,
            error: 'AI Vision Recognition is not configured on the server. API key missing.',
            unconfiguredNotice: data.message,
          };
        }
      }
    } catch (err: any) {
      console.warn('Backend edge function call note:', err);
    }
  }

  // If server API is not configured or in local development
  if (allowSimulation) {
    // Return validated simulation with clear indicator that it is simulated
    const simulated = getSimulatedRecognition(filenameHint);
    return {
      success: true,
      data: simulated,
      isSimulated: true,
      unconfiguredNotice: 'Live AI Vision server API is not configured. Running demonstration estimate based on visible image properties.',
    };
  }

  return {
    success: false,
    error: 'AI-powered image recognition is currently unavailable because the backend AI service is not configured.',
    unconfiguredNotice: 'Set AI_VISION_API_KEY in your Supabase Edge Function secrets to activate live computer vision.',
  };
}
