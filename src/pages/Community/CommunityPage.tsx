import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { CardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SpotlightCard } from '@/components/common/SpotlightCard';
import { useAuth } from '@/contexts/AuthContext';
import {
  CommunityPost,
  ProductCategory,
} from '@/types';
import {
  getCommunityPosts,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  toggleLikePost,
  toggleSavePost,
  reportCommunityPost,
  CreatePostInput,
  CreatePostReportInput,
} from '@/services/communityService';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { ReportPostModal } from '@/components/community/ReportPostModal';
import {
  Users,
  Plus,
  Search,
  Heart,
  Bookmark,
  Sparkles,
  Layers,
  Clock,
  Filter,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
  ChevronRight,
  BookOpen,
  User,
} from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'Clothing',
  'Plastic',
  'Electronics',
  'Furniture',
  'Glass',
  'Paper',
  'Metal',
  'Household Items',
  'Other',
];

export const CommunityPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab View: 'feed' (All Posts) | 'my_posts' | 'saved'
  const activeTab = (searchParams.get('tab') as 'feed' | 'my_posts' | 'saved') || 'feed';
  const selectedCategory = (searchParams.get('category') as ProductCategory | 'All') || 'All';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Posts State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [isCreateOpen, setIsCreateOpen] = useState(searchParams.get('create') === 'true');
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [detailPost, setDetailPost] = useState<CommunityPost | null>(null);
  const [reportingPost, setReportingPost] = useState<CommunityPost | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getCommunityPosts({ userId: user?.id });
      setPosts(data);
    } catch (err) {
      console.error('Failed to load community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // URL State Synchronizers
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (!val || val === 'All' || (key === 'tab' && val === 'feed')) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleTabChange = (tab: 'feed' | 'my_posts' | 'saved') => {
    updateParams({ tab });
  };

  const handleCategoryChange = (cat: ProductCategory | 'All') => {
    updateParams({ category: cat });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateParams({ q: val.trim() || null });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  // 1. Create Post Submit
  const handleCreateSubmit = async (data: CreatePostInput) => {
    const created = await createCommunityPost(data, {
      id: user?.id || 'demo-user-id',
      fullName: profile?.fullName || user?.email?.split('@')[0] || 'Community Maker',
      avatarUrl: profile?.avatarUrl,
    });
    setPosts((prev) => [created, ...prev]);
    setIsCreateOpen(false);
    showToast(`Published "${created.title}" to the circular community!`);
  };

  // 2. Edit Post Submit
  const handleEditSubmit = async (data: CreatePostInput) => {
    if (!editingPost) return;
    const updated = await updateCommunityPost(editingPost.id, data, user?.id);
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (detailPost?.id === updated.id) setDetailPost(updated);
    setEditingPost(null);
    showToast(`Updated "${updated.title}" successfully.`);
  };

  // 3. Delete Post
  const handleDeletePost = async (id: string) => {
    try {
      await deleteCommunityPost(id, user?.id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (detailPost?.id === id) setDetailPost(null);
      showToast('Project post deleted.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete post.');
    }
  };

  // 4. Toggle Like
  const handleToggleLike = async (post: CommunityPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const result = await toggleLikePost(post.id, user?.id);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              isLiked: result.isLiked,
              likesCount: Math.max(0, p.likesCount + result.likesCount),
            }
          : p
      )
    );
    if (detailPost?.id === post.id) {
      setDetailPost((prev) =>
        prev
          ? {
              ...prev,
              isLiked: result.isLiked,
              likesCount: Math.max(0, prev.likesCount + result.likesCount),
            }
          : null
      );
    }
    showToast(result.isLiked ? `Liked "${post.title}"!` : `Unliked "${post.title}".`);
  };

  // 5. Toggle Save / Bookmark
  const handleToggleSave = async (post: CommunityPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const result = await toggleSavePost(post.id, user?.id);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              isSaved: result.isSaved,
              savesCount: Math.max(0, p.savesCount + result.savesCount),
            }
          : p
      )
    );
    if (detailPost?.id === post.id) {
      setDetailPost((prev) =>
        prev
          ? {
              ...prev,
              isSaved: result.isSaved,
              savesCount: Math.max(0, prev.savesCount + result.savesCount),
            }
          : null
      );
    }
    showToast(result.isSaved ? `Saved "${post.title}" to your bookmarks!` : `Removed from saved projects.`);
  };

  // 6. Report Post Submit
  const handleReportSubmit = async (data: CreatePostReportInput) => {
    await reportCommunityPost(data, user?.id);
    showToast('Report submitted to community moderators. Thank you!');
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Tab filter
      if (activeTab === 'saved') {
        if (!post.isSaved) return false;
      } else if (activeTab === 'my_posts') {
        const myId = user?.id || 'demo-user-id';
        if (post.authorId !== myId && post.authorId !== 'demo-user-id') return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && post.category !== selectedCategory) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchDesc = post.description.toLowerCase().includes(q);
        const matchCat = String(post.category).toLowerCase().includes(q);
        const matchMat = post.requiredMaterials.some((m) => m.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCat && !matchMat) return false;
      }

      return true;
    });
  }, [posts, activeTab, selectedCategory, searchQuery, user?.id]);

  const myPostsCount = useMemo(() => {
    const myId = user?.id || 'demo-user-id';
    return posts.filter((p) => p.authorId === myId || p.authorId === 'demo-user-id').length;
  }, [posts, user?.id]);

  const savedPostsCount = useMemo(() => {
    return posts.filter((p) => p.isSaved).length;
  }, [posts]);

  return (
    <div className="py-8 sm:py-12 bg-brand-bg min-h-screen">
      <Container size="xl">
        {/* Editorial Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/80 mb-8">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-brand-primary">Community Showcase</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/discover">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-brand-secondary" />}
                className="text-xs bg-white border-brand-border"
              >
                DIY Blueprints
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Share Your Project
            </Button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-semibold tracking-wide uppercase">
              <Users className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Maker Community & Circular Ideas</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight leading-tight">
              ReUseHub Maker Community
            </h1>

            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Explore creative upcycling projects, repair transformations, and zero-waste blueprints shared by fellow sustainability makers.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-brand-border shadow-soft-xs text-center min-w-[110px]">
              <div className="text-xl font-bold font-display text-brand-primary">
                {posts.length}
              </div>
              <div className="text-[11px] text-brand-muted font-medium">Shared Projects</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-brand-border shadow-soft-xs text-center min-w-[110px]">
              <div className="text-xl font-bold font-display text-emerald-700">
                {posts.reduce((sum, p) => sum + p.likesCount, 0)}
              </div>
              <div className="text-[11px] text-emerald-800 font-medium">Community Likes</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-brand-border shadow-soft-xs text-center min-w-[110px]">
              <div className="text-xl font-bold font-display text-purple-700">
                {savedPostsCount}
              </div>
              <div className="text-[11px] text-purple-800 font-medium">Saved Blueprints</div>
            </div>
          </div>
        </div>

        {/* View Tabs Bar: Community Feed, My Posts, Saved Posts */}
        <div className="flex items-center gap-2 mb-6 border-b border-brand-border">
          <button
            type="button"
            onClick={() => handleTabChange('feed')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'feed'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community Feed ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('my_posts')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'my_posts'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Posts ({myPostsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('saved')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Bookmark className="w-4 h-4 text-brand-secondary" />
            <span>Saved Projects ({savedPostsCount})</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-border shadow-soft-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search community projects, materials, techniques (e.g. pallet, denim, jars, clock, planter)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-3 text-brand-muted hover:text-brand-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shrink-0 text-xs sm:text-sm"
            >
              Create Post
            </Button>
          </div>

          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-brand-border/60 text-xs">
            <span className="font-semibold text-brand-text mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-brand-secondary" />
              Filter by Category:
            </span>
            <button
              type="button"
              onClick={() => handleCategoryChange('All')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedCategory === 'All'
                  ? 'bg-brand-secondary text-white font-semibold shadow-soft-xs'
                  : 'bg-brand-bg text-brand-muted hover:text-brand-text'
              }`}
            >
              All Categories ({posts.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = posts.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    selectedCategory === cat
                      ? 'bg-brand-secondary text-white font-semibold shadow-soft-xs'
                      : 'bg-brand-bg text-brand-muted hover:text-brand-text'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}

            {(selectedCategory !== 'All' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="ml-auto text-xs text-brand-muted hover:text-brand-primary"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Community Visual Discovery Feed (Editorial Grid) */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const isAuthor = Boolean(
                user?.id && (post.authorId === user.id || post.authorId === 'demo-user-id')
              );

              return (
                <SpotlightCard
                  key={post.id}
                  spotlightColor="rgba(46, 125, 79, 0.12)"
                  className="bg-white flex flex-col justify-between overflow-hidden group border-brand-border p-0 rounded-2xl shadow-soft-xs hover:shadow-soft-md transition-all duration-300"
                >
                  {/* Photo with category badge & quick actions */}
                  <div
                    className="relative aspect-video sm:h-52 w-full overflow-hidden bg-forest-50 cursor-pointer"
                    onClick={() => setDetailPost(post)}
                  >
                    <ImageWithFallback
                      src={post.primaryImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-white/95 text-brand-primary text-xs font-bold border border-brand-border shadow-soft-xs backdrop-blur-sm">
                      {post.category}
                    </span>

                    {/* Top right: Like & Bookmark pills */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(post, e)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-soft-xs flex items-center gap-1 transition-all ${
                          post.isLiked
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-brand-text hover:bg-white'
                        }`}
                        title={post.isLiked ? 'Unlike project' : 'Like project'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-white' : 'text-red-500'}`} />
                        <span>{post.likesCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(post, e)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm shadow-soft-xs transition-all ${
                          post.isSaved
                            ? 'bg-brand-primary text-white'
                            : 'bg-white/90 text-brand-text hover:bg-white'
                        }`}
                        title={post.isSaved ? 'Remove from saved' : 'Save blueprint'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-white' : 'text-brand-secondary'}`} />
                      </button>
                    </div>

                    {/* Bottom strip: Difficulty & Time */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded font-medium">
                        {post.difficulty || 'Moderate'}
                      </span>
                      {post.estimatedTime && (
                        <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          {post.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3
                        onClick={() => setDetailPost(post)}
                        className="font-display font-bold text-base sm:text-lg text-brand-primary leading-snug group-hover:text-brand-secondary transition-colors line-clamp-2 cursor-pointer"
                      >
                        {post.title}
                      </h3>

                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>

                      {/* Project Specs: Materials count + Instructions count */}
                      <div className="pt-2 flex items-center gap-3 text-xs text-brand-muted">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-brand-secondary" />
                          <span>{post.requiredMaterials.length} Materials</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
                          <span>{post.instructions.length} Steps</span>
                        </span>
                      </div>
                    </div>

                    {/* Author & Timestamp */}
                    <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageWithFallback
                          src={
                            post.authorAvatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                          }
                          fallbackType="avatar"
                          alt={post.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-brand-border"
                        />
                        <span className="text-xs text-brand-muted truncate max-w-[120px] font-medium">
                          {post.authorName}
                        </span>
                      </div>

                      <span className="text-[11px] text-brand-muted">{post.createdAt}</span>
                    </div>

                    {/* Actions: View Blueprint & Author controls */}
                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setDetailPost(post)}
                        className="flex-1 text-xs justify-between"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                      >
                        View Blueprint
                      </Button>

                      {isAuthor && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPost(post)}
                            className="px-2.5 text-xs border-brand-border"
                            title="Edit project"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-brand-secondary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm('Delete this project post?')) {
                                handleDeletePost(post.id);
                              }
                            }}
                            className="px-2.5 text-xs text-red-600 hover:bg-red-50"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}

        {/* Empty States */}
        {!loading && filteredPosts.length === 0 && (
          <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-soft-sm text-center">
            <EmptyState
              icon={Users}
              title={
                activeTab === 'saved'
                  ? 'No saved projects yet'
                  : activeTab === 'my_posts'
                  ? 'You haven’t published any projects yet'
                  : 'No community projects found'
              }
              description={
                activeTab === 'saved'
                  ? 'Explore our community feed and click the bookmark icon on DIY guides you want to revisit later.'
                  : activeTab === 'my_posts'
                  ? 'Have you repaired a broken tool, upcycled textiles, or built pallet furniture? Share your project with fellow makers!'
                  : `We could not find projects matching your search. Try broadening keywords or clearing filters.`
              }
              primaryAction={{
                label: activeTab === 'my_posts' ? 'Share Your First Project' : 'Reset Filters',
                onClick: activeTab === 'my_posts' ? () => setIsCreateOpen(true) : handleResetFilters,
              }}
            />
          </div>
        )}
      </Container>

      {/* 1. Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        mode="create"
      />

      {/* 2. Edit Post Modal */}
      {editingPost && (
        <CreatePostModal
          isOpen={Boolean(editingPost)}
          onClose={() => setEditingPost(null)}
          onSubmit={handleEditSubmit}
          initialData={editingPost}
          mode="edit"
        />
      )}

      {/* 3. Post Details Modal */}
      {detailPost && (
        <PostDetailModal
          isOpen={Boolean(detailPost)}
          onClose={() => setDetailPost(null)}
          post={detailPost}
          currentUserId={user?.id || 'demo-user-id'}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onOpenReport={(p) => setReportingPost(p)}
          onEdit={(p) => setEditingPost(p)}
          onDelete={handleDeletePost}
        />
      )}

      {/* 4. Report Modal */}
      {reportingPost && (
        <ReportPostModal
          isOpen={Boolean(reportingPost)}
          onClose={() => setReportingPost(null)}
          post={reportingPost}
          onSubmit={handleReportSubmit}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-primary text-white px-4 py-3 rounded-xl shadow-soft-lg flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
