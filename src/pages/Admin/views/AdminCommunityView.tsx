import React, { useState, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ConfirmActionModal } from '@/components/admin/ConfirmActionModal';
import { CommunityPost } from '@/types';
import {
  Sparkles,
  Search,
  Eye,
  Trash2,
  Heart,
  Bookmark,
  User,
} from 'lucide-react';

export interface AdminCommunityViewProps {
  posts: CommunityPost[];
  onModeratePost: (postId: string, title: string, action: 'take_down' | 'restore', reason: string) => Promise<void>;
}

export const AdminCommunityView: React.FC<AdminCommunityViewProps> = ({
  posts,
  onModeratePost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [inspectPost, setInspectPost] = useState<CommunityPost | null>(null);
  const [takeDownTarget, setTakeDownTarget] = useState<CommunityPost | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [posts, searchQuery, categoryFilter]);

  const handleConfirmTakeDown = async () => {
    if (!takeDownTarget) return;
    setIsSubmitting(true);
    try {
      await onModeratePost(
        takeDownTarget.id,
        takeDownTarget.title,
        'take_down',
        moderationReason || 'Content policy violation'
      );
      setTakeDownTarget(null);
      setModerationReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Community Moderation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
          Community Blueprints ({posts.length})
        </h1>
        <p className="text-xs sm:text-sm text-dark-muted">
          Review member-submitted upcycling guides, verify safety standards, and moderate inappropriate blueprints.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="bordered" className="p-4 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search community posts by title, author, or materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-forest-50/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="clothing">Clothing</option>
              <option value="furniture">Furniture</option>
              <option value="plastic">Plastic</option>
              <option value="glass">Glass</option>
              <option value="electronics">Electronics</option>
              <option value="metal">Metal</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Posts Table */}
      <Card variant="bordered" className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-50/60 border-b border-forest-100 text-forest-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Blueprint Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 px-4">Steps</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-dark-muted">
                    No community blueprints match the current search.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={post.primaryImage || post.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-forest-100"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-forest-900 block truncate max-w-xs">
                            {post.title}
                          </span>
                          <span className="text-[11px] text-dark-subtle truncate block max-w-xs">
                            {post.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-dark-muted capitalize">{post.category}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-forest-900">
                        <User className="w-3.5 h-3.5 text-forest-400" />
                        <span>{post.authorName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 text-dark-muted">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Heart className="w-3 h-3 text-rose-500" /> {post.likesCount}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Bookmark className="w-3 h-3 text-sky-500" /> {post.savesCount}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-50 text-forest-700">
                        {post.instructions?.length || 0} Steps
                      </span>
                    </td>

                    <td className="py-3 px-4 text-dark-subtle text-[11px]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] px-2 py-1 h-7 text-forest-700 hover:text-forest-900"
                          onClick={() => setInspectPost(post)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Review
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] px-2 py-1 h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setModerationReason('');
                            setTakeDownTarget(post);
                          }}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Take Down
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Blueprint Modal */}
      {inspectPost && (
        <Modal
          isOpen={!!inspectPost}
          onClose={() => setInspectPost(null)}
          title="Community Blueprint Details"
          size="lg"
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="flex gap-4">
              <ImageWithFallback
                src={inspectPost.primaryImage || inspectPost.images[0]}
                alt=""
                className="w-36 h-36 rounded-2xl object-cover shrink-0 border border-forest-200"
              />
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-forest-900">{inspectPost.title}</h3>
                <div className="text-xs text-dark-muted">
                  Category: <strong>{inspectPost.category}</strong> • Creator: <strong>{inspectPost.authorName}</strong>
                </div>
                <div className="text-xs text-dark-muted">
                  Difficulty: {inspectPost.difficulty || 'Moderate'} • Est. Time: {inspectPost.estimatedTime || '1-2 hrs'}
                </div>
                <p className="text-xs text-dark-subtle leading-relaxed pt-1">
                  {inspectPost.description}
                </p>
              </div>
            </div>

            {/* Materials */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-forest-900 block">Required Materials</span>
              <ul className="list-disc list-inside text-xs text-dark-muted space-y-0.5 bg-forest-50/40 p-3 rounded-xl border border-forest-100">
                {inspectPost.requiredMaterials?.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-forest-900 block">Step-by-Step Instructions</span>
              <div className="space-y-2">
                {inspectPost.instructions?.map((inst, i) => (
                  <div key={i} className="flex gap-2.5 text-xs text-dark-muted p-2 rounded-lg bg-white border border-forest-100">
                    <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-forest-100">
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  setTakeDownTarget(inspectPost);
                  setInspectPost(null);
                }}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Take Down Inappropriate Blueprint
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      <ConfirmActionModal
        isOpen={!!takeDownTarget}
        onClose={() => setTakeDownTarget(null)}
        onConfirm={handleConfirmTakeDown}
        isLoading={isSubmitting}
        title="Take Down Community Blueprint"
        description={`Are you sure you want to take down "${takeDownTarget?.title}"? It will be removed from the public community feed and logged in the administrative audit record.`}
        confirmLabel="Take Down Post"
        isDestructive={true}
        additionalInput={
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forest-900">
              Administrative Reason (Required for Moderation Record)
            </label>
            <textarea
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              placeholder="e.g. Hazardous/toxic practice, copyright infringement, spam..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
              required
            />
          </div>
        }
      />
    </div>
  );
};
