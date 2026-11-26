import { supabase, isSupabaseConfigured } from './supabase';

export type StorageBucket =
  | 'profile-images'
  | 'product-images'
  | 'marketplace-images'
  | 'community-images';

export interface UploadFileOptions {
  bucket: StorageBucket;
  file: File;
  userId?: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  path: string;
  error?: Error | null;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validate image file format and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed formats are JPEG, PNG, and WebP.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds 5MB limit (Current size: ${sizeMb}MB). Please select a smaller image.`,
    };
  }

  return { valid: true };
}

/**
 * Upload an image to Supabase Storage with local data URL fallback
 */
export async function uploadImageFile({
  bucket,
  file,
  userId,
  folder,
}: UploadFileOptions): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 1. Live Supabase Storage flow
  if (isSupabaseConfigured) {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const userFolder = userId || 'shared';
      const subfolder = folder ? `${folder}/` : '';
      const filePath = `${userFolder}/${subfolder}${Date.now()}-${cleanName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        url: publicUrlData.publicUrl,
        path: data.path,
      };
    } catch (err: any) {
      console.warn(`Supabase storage upload error in bucket "${bucket}", falling back to data URL:`, err);
    }
  }

  // 2. Demo fallback: convert to base64 Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        path: `local_fallback/${file.name}`,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read image file locally.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Delete image file from Supabase Storage bucket
 */
export async function deleteImageFile(bucket: StorageBucket, path: string): Promise<boolean> {
  if (!isSupabaseConfigured || path.startsWith('local_fallback') || path.startsWith('http')) {
    return true;
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn(`Could not delete storage file ${path}:`, err);
    return false;
  }
}
