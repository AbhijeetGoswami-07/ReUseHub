import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { CommunityPost } from '@/types';
import {
  Heart,
  Bookmark,
  Share2,
  Flag,
  Edit3,
  Trash2,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost | null;
  currentUserId?: string;
  onToggleLike?: (post: CommunityPost) => void;
  onToggleSave?: (post: CommunityPost) => void;
  onOpenReport?: (post: CommunityPost) => void;
  onEdit?: (post: CommunityPost) => void;
  onDelete?: (postId: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  post,
  currentUserId,
  onToggleLike,
  onToggleSave,
  onOpenReport,
  onEdit,
  onDelete,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!post) return null;

  const images = post.images && post.images.length > 0 ? post.images : [post.primaryImage];
  const activeImage = images[activeImageIndex] || post.primaryImage;

  const isAuthor = Boolean(
    currentUserId && (post.authorId === currentUserId || post.authorId === 'demo-user-id')
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Moderate: 'bg-amber-50 text-amber-800 border-amber-200',
    Advanced: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={post.title}
      description={`Published by ${post.authorName} • Category: ${post.category}`}
    >
      <div className="space-y-6 pt-2 pb-4">
        {/* Gallery Section */}
        <div className="space-y-3">
          <div className="relative aspect-video sm:h-80 w-full rounded-2xl overflow-hidden bg-forest-50 border border-brand-border">
            <ImageWithFallback
              src={activeImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />

            {/* Category & Difficulty Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/95 text-brand-primary border border-brand-border shadow-soft-xs backdrop-blur-sm">
                {post.category}
              </span>
              {post.difficulty && (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm shadow-soft-xs ${difficultyColors[post.difficulty] || 'bg-white'}`}>
                  {post.difficulty}
                </span>
              )}
            </div>

            {/* Time pill bottom left */}
            {post.estimatedTime && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-white flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Est. Time: {post.estimatedTime}</span>
              </div>
            )}
          </div>

          {/* Thumbnails if multiple */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-brand-primary ring-2 ring-brand-primary/20 scale-105'
                      : 'border-brand-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Author Card & Engagement Bar */}
        <div className="p-4 rounded-xl bg-white border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={
                post.authorAvatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              fallbackType="avatar"
              alt={post.authorName}
              className="w-12 h-12 rounded-full object-cover border border-brand-border"
            />
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-sm text-brand-primary">
                  {post.authorName}
                </h5>
                <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                  {post.authorTitle || 'Community Maker'}
                </span>
              </div>
              <p className="text-xs text-brand-muted">
                Shared {post.createdAt} • ReUseHub Circular Community
              </p>
            </div>
          </div>

          {/* Engagement Buttons */}
          <div className="flex items-center gap-2">
            {onToggleLike && (
              <Button
                variant={post.isLiked ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onToggleLike(post)}
                leftIcon={<Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-white' : 'text-red-500'}`} />}
                className={`text-xs ${!post.isLiked ? 'bg-white border-brand-border text-brand-text' : ''}`}
              >
                {post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}
              </Button>
            )}

            {onToggleSave && (
              <Button
                variant={post.isSaved ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onToggleSave(post)}
                leftIcon={<Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-white' : 'text-brand-secondary'}`} />}
                className={`text-xs ${!post.isSaved ? 'bg-white border-brand-border text-brand-text' : ''}`}
              >
                {post.isSaved ? 'Saved' : 'Save'}
              </Button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-brand-border bg-white text-brand-muted hover:text-brand-primary hover:bg-forest-50 transition-colors"
              title="Share project link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Description & Story */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-bold text-brand-muted tracking-wider">
            Project Description & Story
          </h4>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed whitespace-pre-line">
            {post.description}
          </p>
        </div>

        {/* Required Materials */}
        {post.requiredMaterials.length > 0 && (
          <div className="p-4 rounded-xl bg-brand-bg/80 border border-brand-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-wide">
              <Layers className="w-4 h-4 text-brand-secondary" />
              <span>Required Materials & Tools ({post.requiredMaterials.length})</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {post.requiredMaterials.map((mat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-brand-text">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary shrink-0 mt-0.5" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        {post.instructions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-brand-muted tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-secondary" />
              <span>Step-by-Step Project Instructions ({post.instructions.length} Steps)</span>
            </h4>

            <div className="space-y-2.5">
              {post.instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-brand-border bg-white flex items-start gap-3 hover:border-brand-secondary/40 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-brand-text leading-relaxed font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onOpenReport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenReport(post)}
                leftIcon={<Flag className="w-3.5 h-3.5 text-red-500" />}
                className="text-xs text-brand-muted hover:text-red-700 hover:bg-red-50"
              >
                Report Inappropriate Post
              </Button>
            )}

            {copiedLink && (
              <span className="text-xs text-emerald-700 font-medium">Link copied to clipboard!</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthor && (
              <>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(post)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5 text-brand-secondary" />}
                    className="text-xs bg-white border-brand-border"
                  >
                    Edit Post
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this project post?')) {
                        onDelete(post.id);
                        onClose();
                      }
                    }}
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}
                    className="text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                )}
              </>
            )}

            <Button variant="primary" size="sm" onClick={onClose} className="text-xs">
              Close Blueprint
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
