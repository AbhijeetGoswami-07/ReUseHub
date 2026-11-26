import React, { useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { UploadCloud, X, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { uploadImageFile, StorageBucket } from '@/services/storageService';

export interface ImageUploadProps {
  label?: string;
  helperText?: string;
  value?: string | null;
  onChange?: (fileUrl: string | null, file?: File) => void;
  maxSizeBytes?: number; // default 5MB
  className?: string;
  bucket?: StorageBucket;
  userId?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Product Image',
  helperText = 'Clear photos of labels, materials, or faults improve recommendation accuracy.',
  value,
  onChange,
  maxSizeBytes = 5 * 1024 * 1024,
  className,
  bucket,
  userId,
}) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > maxSizeBytes) {
      setError(`Image exceeds maximum size limit (${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB).`);
      return;
    }

    if (bucket) {
      setIsUploading(true);
      try {
        const res = await uploadImageFile({ bucket, file, userId });
        setPreview(res.url);
        if (onChange) {
          onChange(res.url, file);
        }
      } catch (err: any) {
        setError(err.message || 'Upload to storage bucket failed.');
      } finally {
        setIsUploading(false);
      }
    } else {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      if (onChange) {
        onChange(objectUrl, file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className={cn('w-full space-y-1.5 text-left', className)}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-white group shadow-soft-xs">
          <img
            src={preview}
            alt="Upload preview"
            onError={() => {
              setPreview(null);
              setError('Failed to preview image file.');
            }}
            className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-brand-primary/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/90 text-brand-primary"
            >
              Replace Photo
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleRemove}
              leftIcon={<X className="w-3.5 h-3.5" />}
            >
              Remove
            </Button>
          </div>
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 text-brand-primary text-[11px] font-semibold flex items-center gap-1 shadow-soft-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" />
            Photo Loaded
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center bg-white/60',
            isDragging
              ? 'border-brand-primary bg-forest-50/80 scale-[0.99]'
              : 'border-brand-border hover:border-brand-secondary/70 hover:bg-white',
            error && 'border-red-400 bg-red-50/40'
          )}
        >
          <div className="w-12 h-12 rounded-2xl bg-forest-100/70 text-brand-primary flex items-center justify-center mb-3">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-brand-secondary animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-brand-secondary" />
            )}
          </div>
          <p className="text-sm font-semibold text-brand-text">
            {isUploading ? (
              'Uploading to storage bucket...'
            ) : (
              <>Drop your item photo here or <span className="text-brand-secondary underline">browse files</span></>
            )}
          </p>
          <p className="text-xs text-brand-muted mt-1">
            Supports JPEG, PNG, WEBP up to 5MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-brand-muted flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
