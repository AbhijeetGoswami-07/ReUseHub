import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { ActionBadge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserAnalyzedProducts,
  deleteAnalyzedProduct,
  getUserSavedRecommendations,
  removeSavedRecommendation,
  getUserInquiries,
  updateInquiryStatus,
  getUserActivityHistory,
  logCompletedActivity,
  getDashboardSummaryMetrics,
  UserAnalyzedProduct,
  SavedRecommendationItem,
  UserActivityItem,
  DashboardSummary,
} from '@/services/dashboardService';
import {
  getMarketplaceListings,
  deleteMarketplaceListing,
  updateMarketplaceListing,
} from '@/services/marketplaceService';
import { MarketplaceListing, MarketplaceInquiry } from '@/types';
import { ListingFormModal } from '@/components/marketplace/ListingFormModal';
import { LogActivityModal } from '@/components/dashboard/LogActivityModal';
import { CardSkeleton } from '@/components/common/Skeleton';
import { SpotlightCard } from '@/components/common/SpotlightCard';
import { CountUp } from '@/components/common/CountUp';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Store,
  MessageSquare,
  History,
  User,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  MapPin,
  Leaf,
  Sparkles,
  Award,
  ChevronRight,
  X,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

type DashboardSection =
  | 'analyses'
  | 'saved'
  | 'listings'
  | 'inquiries'
  | 'history'
  | 'profile';

export const DashboardPage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active section from URL or default
  const activeSection = (searchParams.get('section') as DashboardSection) || 'analyses';

  // Data State
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalAnalyzed: 0,
    savedIdeas: 0,
    activeListings: 0,
    completedActivities: 0,
    totalCo2Saved: 0,
    totalWasteDiverted: 0,
    actionsBreakdown: { reuse: 0, repair: 0, upcycle: 0, donate: 0, recycle: 0 },
  });

  const [analyzedProducts, setAnalyzedProducts] = useState<UserAnalyzedProduct[]>([]);
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendationItem[]>([]);
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [inquiries, setInquiries] = useState<{ sent: MarketplaceInquiry[]; received: MarketplaceInquiry[] }>({
    sent: [],
    received: [],
  });
  const [activeInquiryTab, setActiveInquiryTab] = useState<'received' | 'sent'>('received');
  const [activityHistory, setActivityHistory] = useState<UserActivityItem[]>([]);

  // Modals state
  const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);

  // Profile Form state
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch all user-specific data from Supabase & synced stores
  const loadDashboardData = async () => {
    setLoading(true);
    const userId = user?.id;

    try {
      const [sum, analyses, saved, listings, inqs, activities] = await Promise.all([
        getDashboardSummaryMetrics(userId),
        getUserAnalyzedProducts(userId),
        getUserSavedRecommendations(userId),
        getMarketplaceListings({ myListingsOnly: true, userId }),
        getUserInquiries(userId),
        getUserActivityHistory(userId),
      ]);

      setSummary(sum);
      setAnalyzedProducts(analyses);
      setSavedRecommendations(saved);
      setMyListings(listings);
      setInquiries(inqs);
      setActivityHistory(activities);

      if (profile) {
        setFullName(profile.fullName || '');
        setCity(profile.city || '');
        setState(profile.state || '');
        setAvatarUrl(profile.avatarUrl || '');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.id, profile]);

  const handleSectionChange = (section: DashboardSection) => {
    setSearchParams({ section });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Section 1: Delete analysis
  const handleDeleteAnalysis = async (id: string) => {
    await deleteAnalyzedProduct(id, user?.id);
    setAnalyzedProducts((prev) => prev.filter((p) => p.id !== id));
    setSummary((prev) => ({ ...prev, totalAnalyzed: Math.max(0, prev.totalAnalyzed - 1) }));
    showToast('Analysis removed from history.');
  };

  // Section 2: Remove saved recommendation
  const handleRemoveSaved = async (id: string) => {
    await removeSavedRecommendation(id);
    setSavedRecommendations((prev) => prev.filter((s) => s.id !== id));
    setSummary((prev) => ({ ...prev, savedIdeas: Math.max(0, prev.savedIdeas - 1) }));
    showToast('Removed from saved circular recommendations.');
  };

  // Section 3: Marketplace listings management
  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    await deleteMarketplaceListing(id, user?.id);
    setMyListings((prev) => prev.filter((l) => l.id !== id));
    setSummary((prev) => ({ ...prev, activeListings: Math.max(0, prev.activeListings - 1) }));
    showToast('Marketplace listing deleted.');
  };

  const handleStatusChange = async (id: string, status: 'active' | 'reserved' | 'completed') => {
    const updated = await updateMarketplaceListing(id, { status }, user?.id);
    setMyListings((prev) => prev.map((l) => (l.id === id ? updated : l)));
    showToast(`Listing marked as ${status}.`);
  };

  const handleSaveListingEdit = async (data: any) => {
    if (!editingListing) return;
    const updated = await updateMarketplaceListing(editingListing.id, data, user?.id);
    setMyListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setEditingListing(null);
    showToast('Listing updated successfully.');
  };

  // Section 4: Inquiries updates
  const handleUpdateInquiryStatus = async (id: string, status: 'pending' | 'responded' | 'closed') => {
    await updateInquiryStatus(id, status);
    setInquiries((prev) => ({
      sent: prev.sent.map((i) => (i.id === id ? { ...i, status } : i)),
      received: prev.received.map((i) => (i.id === id ? { ...i, status } : i)),
    }));
    showToast(`Inquiry marked as ${status}.`);
  };

  // Section 5: Log completed circular activity
  const handleLogActivity = async (data: any) => {
    const created = await logCompletedActivity(data, user?.id);
    setActivityHistory((prev) => [created, ...prev]);
    setSummary((prev) => ({
      ...prev,
      completedActivities: prev.completedActivities + 1,
      totalCo2Saved: Number((prev.totalCo2Saved + data.co2SavedKg).toFixed(1)),
      totalWasteDiverted: Number((prev.totalWasteDiverted + data.wasteDivertedKg).toFixed(1)),
    }));
    setIsLogActivityOpen(false);
    showToast(`Logged circular action: "${data.productName}"!`);
  };

  // Section 6: Update Profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await updateProfile({
        fullName: fullName.trim(),
        city: city.trim(),
        state: state.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      if (res.error) {
        showToast(res.error.message);
      } else {
        showToast('Profile settings saved successfully.');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Actions Breakdown chart data
  const actionDistribution = [
    { name: 'Reuse', count: summary.actionsBreakdown.reuse || 0, color: '#234B35' },
    { name: 'Repair', count: summary.actionsBreakdown.repair || 0, color: '#D97706' },
    { name: 'Upcycle', count: summary.actionsBreakdown.upcycle || 0, color: '#7C3AED' },
    { name: 'Donate', count: summary.actionsBreakdown.donate || 0, color: '#0284C7' },
    { name: 'Recycle', count: summary.actionsBreakdown.recycle || 0, color: '#0D9488' },
  ];

  const totalActionsCount = Object.values(summary.actionsBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="py-8 sm:py-12 bg-brand-bg min-h-screen">
      <Container size="xl">
        {/* Editorial Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/80 mb-8">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-brand-primary">Dashboard</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/analyzer">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-secondary" />}
                className="text-xs bg-white border-brand-border"
              >
                Analyze New Product
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsLogActivityOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Log Circular Action
            </Button>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-semibold tracking-wide uppercase">
            <LayoutDashboard className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Personal Circular Activity Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-primary tracking-tight">
            Your ReUseHub Activity
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Track your analyzed items, saved DIY instructions, local marketplace trades, community inquiries, and verified carbon savings.
          </p>
        </div>

        {/* SUMMARY STATS: 4 Actual User Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {/* 1. Total Products Analyzed */}
          <SpotlightCard
            spotlightColor="rgba(46, 125, 79, 0.15)"
            onClick={() => handleSectionChange('analyses')}
            className="p-5 bg-white cursor-pointer border-brand-border space-y-2 group rounded-2xl shadow-soft-xs hover:shadow-soft-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-brand-muted uppercase tracking-wider">
                Total Products Analyzed
              </span>
              <div className="w-8 h-8 rounded-lg bg-forest-50 text-brand-secondary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-brand-primary">
              <CountUp to={summary.totalAnalyzed} duration={1.2} />
            </div>
            <p className="text-[11px] text-brand-muted">
              Products evaluated for second life
            </p>
          </SpotlightCard>

          {/* 2. Saved Reuse Ideas */}
          <SpotlightCard
            spotlightColor="rgba(124, 58, 237, 0.15)"
            onClick={() => handleSectionChange('saved')}
            className="p-5 bg-white cursor-pointer border-brand-border space-y-2 group rounded-2xl shadow-soft-xs hover:shadow-soft-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-brand-muted uppercase tracking-wider">
                Saved Reuse Ideas
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-brand-primary">
              <CountUp to={summary.savedIdeas} duration={1.2} />
            </div>
            <p className="text-[11px] text-brand-muted">
              Bookmarked DIY blueprints & plans
            </p>
          </SpotlightCard>

          {/* 3. Active Listings */}
          <SpotlightCard
            spotlightColor="rgba(2, 132, 199, 0.15)"
            onClick={() => handleSectionChange('listings')}
            className="p-5 bg-white cursor-pointer border-brand-border space-y-2 group rounded-2xl shadow-soft-xs hover:shadow-soft-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-brand-muted uppercase tracking-wider">
                Active Listings
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-brand-primary">
              <CountUp to={summary.activeListings} duration={1.2} />
            </div>
            <p className="text-[11px] text-brand-muted">
              Available on local marketplace
            </p>
          </SpotlightCard>

          {/* 4. Completed Reuse Activities */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.15)"
            onClick={() => handleSectionChange('history')}
            className="p-5 bg-white cursor-pointer border-brand-border space-y-2 group rounded-2xl shadow-soft-xs hover:shadow-soft-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-brand-muted uppercase tracking-wider">
                Completed Reuse Activities
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-brand-primary">
              <CountUp to={summary.completedActivities} duration={1.2} />
            </div>
            <p className="text-[11px] text-brand-muted">
              {summary.totalCo2Saved} kg CO2e avoided
            </p>
          </SpotlightCard>
        </div>

        {/* MAIN DASHBOARD CONTENT: SIDEBAR LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sidebar / Mobile Sticky Navigation */}
          <aside className="lg:col-span-3 space-y-6">
            {/* User Profile Mini Card */}
            <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-soft-xs flex items-center gap-3">
              <ImageWithFallback
                src={
                  profile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                fallbackType="avatar"
                alt={profile?.fullName || 'User Avatar'}
                className="w-12 h-12 rounded-full object-cover border border-brand-border shrink-0"
              />
              <div className="truncate">
                <h4 className="font-bold text-sm text-brand-primary truncate">
                  {profile?.fullName || user?.email?.split('@')[0] || 'Community Maker'}
                </h4>
                <p className="text-[11px] text-brand-muted truncate">
                  {profile?.city && profile?.state
                    ? `${profile.city}, ${profile.state}`
                    : user?.email || 'Eco Advocate'}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                    Active Member
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Links (Responsive) */}
            <nav className="bg-white rounded-2xl border border-brand-border shadow-soft-xs p-2 flex flex-row lg:flex-col overflow-x-auto gap-1">
              {[
                { id: 'analyses', label: 'Product Analyses', icon: Search, count: summary.totalAnalyzed },
                { id: 'saved', label: 'Saved Recommendations', icon: Bookmark, count: summary.savedIdeas },
                { id: 'listings', label: 'My Listings', icon: Store, count: myListings.length },
                { id: 'inquiries', label: 'My Inquiries', icon: MessageSquare, count: inquiries.received.length + inquiries.sent.length },
                { id: 'history', label: 'Activity & Progress', icon: History, count: summary.completedActivities },
                { id: 'profile', label: 'Profile Settings', icon: User, count: undefined },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSectionChange(item.id as DashboardSection)}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand-primary text-white shadow-soft-xs font-bold'
                        : 'text-brand-text hover:bg-forest-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-secondary'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span
                        className={`text-[11px] px-2 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-brand-bg text-brand-muted border border-brand-border'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Impact Highlight Card */}
            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 space-y-3 hidden lg:block">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-wide">
                <Leaf className="w-4 h-4 text-brand-secondary" />
                <span>Verified Impact</span>
              </div>
              <div className="space-y-2 text-xs text-brand-muted">
                <div className="flex items-center justify-between">
                  <span>Carbon Diverted:</span>
                  <strong className="text-emerald-800 font-bold">{summary.totalCo2Saved} kg CO2e</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Solid Waste Saved:</span>
                  <strong className="text-emerald-800 font-bold">{summary.totalWasteDiverted} kg</strong>
                </div>
                <div className="pt-2 border-t border-forest-200/60">
                  <Link to="/ecoscore" className="text-[11px] font-bold text-brand-primary hover:text-brand-secondary flex items-center justify-between">
                    <span>View EcoScore & Tiers</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Body: Active Section View */}
          <main className="lg:col-span-9 space-y-6">
            {loading ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              <>
            {/* ============================================================== */}
            {/* SECTION 1: Recent Product Analyses */}
            {/* ============================================================== */}
            {activeSection === 'analyses' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary">
                      Recent Product Analyses ({analyzedProducts.length})
                    </h2>
                    <p className="text-xs text-brand-muted">
                      Items you previously submitted to the recommendation engine.
                    </p>
                  </div>

                  <Link to="/analyzer">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="text-xs shrink-0"
                    >
                      Analyze Another Product
                    </Button>
                  </Link>
                </div>

                {/* List of Analyzed Products */}
                {analyzedProducts.length > 0 ? (
                  <div className="space-y-3">
                    {analyzedProducts.map((prod) => (
                      <Card
                        key={prod.id}
                        variant="bordered"
                        className="p-4 sm:p-5 bg-white border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-secondary/40 transition-colors"
                      >
                        <div className="flex items-start gap-3.5">
                          {prod.imageUrl ? (
                            <ImageWithFallback
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-16 h-16 rounded-xl object-cover border border-brand-border shrink-0 bg-forest-50"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-forest-50 border border-brand-border flex items-center justify-center shrink-0 text-brand-secondary">
                              <Search className="w-6 h-6" />
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display font-bold text-base text-brand-primary leading-tight">
                                {prod.title}
                              </h3>
                              <ActionBadge action={prod.recommendedAction || 'reuse'} size="sm" />
                            </div>

                            <p className="text-xs text-brand-muted line-clamp-1">
                              Category: <strong className="text-brand-text capitalize">{prod.category}</strong> • Material: <strong className="text-brand-text capitalize">{prod.material || 'Mixed'}</strong> • Condition: <strong className="text-brand-text capitalize">{prod.condition}</strong>
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-brand-muted pt-1">
                              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <Leaf className="w-3 h-3 text-emerald-600" />
                                ~{prod.co2EstimateKg} kg CO2e potential
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-brand-secondary" />
                                {prod.createdAt}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border/60">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/recommendations?title=${encodeURIComponent(prod.title)}&category=${encodeURIComponent(prod.category)}&condition=${encodeURIComponent(prod.condition)}&material=${encodeURIComponent(prod.material || 'mixed_material')}`
                              )
                            }
                            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                            className="text-xs"
                          >
                            Open Analysis
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAnalysis(prod.id)}
                            className="text-xs text-red-600 hover:bg-red-50 px-2.5"
                            title="Remove from history"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-brand-border p-8 text-center">
                    <EmptyState
                      icon={Search}
                      title="No Product Analyses Yet"
                      description="You haven't submitted any items to the Product Analyzer. Submit an unwanted product to discover tailored reuse, repair, upcycle, donation, and recycling pathways."
                      primaryAction={{
                        label: 'Analyze Your First Product',
                        onClick: () => navigate('/analyzer'),
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION 2: Saved Recommendations */}
            {/* ============================================================== */}
            {activeSection === 'saved' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary">
                      Saved Recommendations & DIY Ideas ({savedRecommendations.length})
                    </h2>
                    <p className="text-xs text-brand-muted">
                      Your saved circular projects, upcycling blueprints, and repair guides.
                    </p>
                  </div>

                  <Link to="/discover">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Bookmark className="w-3.5 h-3.5 text-brand-secondary" />}
                      className="text-xs shrink-0 bg-white border-brand-border"
                    >
                      Browse DIY Blueprints
                    </Button>
                  </Link>
                </div>

                {savedRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedRecommendations.map((item) => (
                      <Card
                        key={item.id}
                        variant="bordered"
                        className="p-5 bg-white border-brand-border flex flex-col justify-between space-y-4 hover:border-brand-secondary/40 transition-colors"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <ActionBadge action={item.action || 'reuse'} size="sm" />
                            <span className="text-[11px] text-brand-muted">{item.savedAt}</span>
                          </div>

                          <h3 className="font-display font-bold text-base text-brand-primary leading-snug">
                            {item.planTitle}
                          </h3>

                          <p className="text-xs text-brand-muted">
                            Derived from: <strong className="text-brand-text">{item.productTitle}</strong>
                          </p>

                          <div className="flex items-center gap-3 text-xs pt-1">
                            {item.difficulty && (
                              <span className="px-2 py-0.5 rounded-full bg-forest-50 text-brand-primary text-[11px] font-medium border border-forest-100">
                                {item.difficulty}
                              </span>
                            )}
                            <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                              {item.co2SavedKg} kg CO2e Avoided
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/recommendations?title=${encodeURIComponent(item.productTitle)}&category=${encodeURIComponent(item.category)}`
                              )
                            }
                            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                            className="text-xs"
                          >
                            Open Blueprint
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSaved(item.id)}
                            leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                            className="text-xs text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-brand-border p-8 text-center">
                    <EmptyState
                      icon={Bookmark}
                      title="No Saved Recommendations Yet"
                      description="You haven't bookmarked any circular recommendations or DIY guides. Browse our verified library or analyze a product to save instructions."
                      primaryAction={{
                        label: 'Explore DIY Reuse Ideas',
                        onClick: () => navigate('/discover'),
                      }}
                      secondaryAction={{
                        label: 'Analyze a Product',
                        onClick: () => navigate('/analyzer'),
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION 3: My Marketplace Listings */}
            {/* ============================================================== */}
            {activeSection === 'listings' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary">
                      My Marketplace Listings ({myListings.length})
                    </h2>
                    <p className="text-xs text-brand-muted">
                      Manage, edit, or mark products you have shared with your community.
                    </p>
                  </div>

                  <Link to="/marketplace?new=true">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="text-xs shrink-0"
                    >
                      Post New Listing
                    </Button>
                  </Link>
                </div>

                {myListings.length > 0 ? (
                  <div className="space-y-3">
                    {myListings.map((listing) => (
                      <Card
                        key={listing.id}
                        variant="bordered"
                        className="p-4 sm:p-5 bg-white border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <ImageWithFallback
                            src={listing.imageUrl}
                            alt={listing.productName || listing.title}
                            className="w-20 h-20 rounded-xl object-cover border border-brand-border shrink-0 bg-forest-50"
                          />

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display font-bold text-base text-brand-primary leading-tight">
                                {listing.productName || listing.title}
                              </h3>

                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                                  listing.listingType === 'Sale'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : listing.listingType === 'Product Exchange'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {listing.listingType === 'Sale' ? `$${listing.price.toFixed(2)}` : listing.listingType}
                              </span>

                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  listing.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : listing.status === 'completed'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {listing.status}
                              </span>
                            </div>

                            <p className="text-xs text-brand-muted line-clamp-1">
                              {listing.description}
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-brand-muted pt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-brand-secondary" />
                                {listing.city}, {listing.state}
                              </span>
                              <span>•</span>
                              <span>Condition: <strong className="text-brand-text">{listing.condition}</strong></span>
                              <span>•</span>
                              <span>Posted {listing.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls: Edit, Status toggle, Delete */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border/60">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingListing(listing)}
                            leftIcon={<Edit3 className="w-3.5 h-3.5 text-brand-secondary" />}
                            className="text-xs bg-white border-brand-border"
                          >
                            Edit
                          </Button>

                          {listing.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(listing.id, 'completed')}
                              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              className="text-xs text-emerald-800 border-emerald-200 hover:bg-emerald-50 bg-white"
                            >
                              Mark Rehomed
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteListing(listing.id)}
                            className="text-xs text-red-600 hover:bg-red-50 px-2.5"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-brand-border p-8 text-center">
                    <EmptyState
                      icon={Store}
                      title="No Personal Listings Active"
                      description="You haven't listed any unwanted products on the marketplace. Donate items for free, trade for tools, or sell usable second-hand goods locally."
                      primaryAction={{
                        label: 'Post a Product Now',
                        onClick: () => navigate('/marketplace?new=true'),
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION 4: My Inquiries */}
            {/* ============================================================== */}
            {activeSection === 'inquiries' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary">
                      Marketplace Inquiries & Messages
                    </h2>
                    <p className="text-xs text-brand-muted">
                      Manage private buyer questions, pickup scheduling, and trade proposals.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-brand-bg border border-brand-border text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveInquiryTab('received')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        activeInquiryTab === 'received'
                          ? 'bg-brand-primary text-white shadow-soft-xs'
                          : 'text-brand-muted hover:text-brand-text'
                      }`}
                    >
                      Received ({inquiries.received.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInquiryTab('sent')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        activeInquiryTab === 'sent'
                          ? 'bg-brand-primary text-white shadow-soft-xs'
                          : 'text-brand-muted hover:text-brand-text'
                      }`}
                    >
                      Sent ({inquiries.sent.length})
                    </button>
                  </div>
                </div>

                {/* Inquiries list */}
                {activeInquiryTab === 'received' ? (
                  inquiries.received.length > 0 ? (
                    <div className="space-y-3">
                      {inquiries.received.map((inq) => (
                        <Card key={inq.id} variant="bordered" className="p-5 bg-white border-brand-border space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-brand-primary">
                                  {inq.buyerName}
                                </span>
                                <span className="px-2 py-0.2 rounded-full bg-forest-50 text-brand-secondary text-[10px] font-semibold">
                                  {inq.inquiryType.replace('_', ' ')}
                                </span>
                                <span
                                  className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                    inq.status === 'responded'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {inq.status}
                                </span>
                              </div>
                              <p className="text-xs text-brand-muted">
                                Re: <strong className="text-brand-text">{inq.listingTitle}</strong> • {inq.createdAt}
                              </p>
                            </div>

                            {inq.proposedPrice && (
                              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                Proposed Offer: ${inq.proposedPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="p-3 rounded-xl bg-brand-bg/70 border border-brand-border text-xs text-brand-text leading-relaxed">
                            "{inq.message}"
                          </div>

                          <div className="pt-2 flex items-center justify-between text-xs">
                            <span className="text-brand-muted">
                              Contact: <strong>{inq.buyerEmail}</strong>
                            </span>

                            <div className="flex items-center gap-2">
                              {inq.status === 'pending' && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'responded')}
                                  className="text-xs"
                                >
                                  Mark Responded
                                </Button>
                              )}
                              {inq.status !== 'closed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'closed')}
                                  className="text-xs"
                                >
                                  Close
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-brand-border p-8 text-center">
                      <EmptyState
                        icon={MessageSquare}
                        title="No Inquiries Received"
                        description="You haven't received any inquiries on your marketplace listings yet. Once buyers reach out to request items or schedule pickup, their messages will appear here."
                      />
                    </div>
                  )
                ) : inquiries.sent.length > 0 ? (
                  <div className="space-y-3">
                    {inquiries.sent.map((inq) => (
                      <Card key={inq.id} variant="bordered" className="p-5 bg-white border-brand-border space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-brand-primary">
                                Sent to Seller
                              </span>
                              <span className="px-2 py-0.2 rounded-full bg-forest-50 text-brand-secondary text-[10px] font-semibold">
                                {inq.inquiryType.replace('_', ' ')}
                              </span>
                              <span
                                className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                  inq.status === 'responded'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {inq.status}
                              </span>
                            </div>
                            <p className="text-xs text-brand-muted">
                              For Listing: <strong className="text-brand-text">{inq.listingTitle}</strong> • {inq.createdAt}
                            </p>
                          </div>

                          {inq.proposedPrice && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              Offered: ${inq.proposedPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-brand-bg/70 border border-brand-border text-xs text-brand-text leading-relaxed">
                          "{inq.message}"
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-brand-border p-8 text-center">
                    <EmptyState
                      icon={MessageSquare}
                      title="No Sent Inquiries"
                      description="You haven't contacted any marketplace sellers yet. Browse local listings to request free items or propose trades."
                      primaryAction={{
                        label: 'Browse Marketplace',
                        onClick: () => navigate('/marketplace'),
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION 5: Reuse Activity History & Sustainability Progress */}
            {/* ============================================================== */}
            {activeSection === 'history' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary">
                      Reuse Activity History & Verified Progress
                    </h2>
                    <p className="text-xs text-brand-muted">
                      Audit trail of actual items repaired, upcycled, reused, donated, or recycled.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsLogActivityOpen(true)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="text-xs shrink-0"
                  >
                    Log Completed Action
                  </Button>
                </div>

                {/* Sustainability Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Actions Distribution Chart */}
                  <Card variant="bordered" className="p-5 bg-white border-brand-border space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase text-brand-muted tracking-wider">
                        Action Distribution
                      </h4>
                      <span className="text-xs font-semibold text-brand-primary">
                        {totalActionsCount} Total Completed
                      </span>
                    </div>

                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={actionDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {actionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-brand-muted border-t border-brand-border/60">
                      {actionDistribution.map((d) => (
                        <span key={d.name} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span>{d.name}: <strong>{d.count}</strong></span>
                        </span>
                      ))}
                    </div>
                  </Card>

                  {/* Ecological Savings Card */}
                  <Card variant="bordered" className="p-5 bg-white border-brand-border flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs uppercase text-brand-muted tracking-wider">
                        Cumulative Environmental Offsets
                      </h4>
                      <p className="text-xs text-brand-muted">
                        Computed dynamically from your verified activity log.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                        <span className="text-[11px] font-semibold text-emerald-800 uppercase">
                          Carbon Avoided
                        </span>
                        <div className="text-2xl font-display font-extrabold text-emerald-900">
                          {summary.totalCo2Saved} <span className="text-xs font-normal">kg CO2e</span>
                        </div>
                        <p className="text-[10px] text-emerald-700">
                          Equal to ~{Math.round(summary.totalCo2Saved * 4.2)} miles by car.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1">
                        <span className="text-[11px] font-semibold text-teal-800 uppercase">
                          Landfill Diverted
                        </span>
                        <div className="text-2xl font-display font-extrabold text-teal-900">
                          {summary.totalWasteDiverted} <span className="text-xs font-normal">kg</span>
                        </div>
                        <p className="text-[10px] text-teal-700">
                          Physical solid waste kept in circulation.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-muted flex items-center gap-2">
                      <Award className="w-4 h-4 text-brand-secondary shrink-0" />
                      <span>Sustainability status: <strong>Eco-Guardian Tier 1</strong></span>
                    </div>
                  </Card>
                </div>

                {/* Activity Timeline List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-brand-muted tracking-wider">
                    Detailed Activity Log ({activityHistory.length})
                  </h4>

                  {activityHistory.length > 0 ? (
                    <div className="space-y-2.5">
                      {activityHistory.map((act) => (
                        <div
                          key={act.id}
                          className="p-4 rounded-xl bg-white border border-brand-border flex items-start justify-between gap-3 shadow-soft-xs"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-lg bg-forest-50 text-brand-primary flex items-center justify-center shrink-0 mt-0.5 font-bold uppercase text-xs">
                              {act.actionType === 'marketplace_rehome' ? 'Trade' : act.actionType.slice(0, 3)}
                            </span>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="font-bold text-sm text-brand-primary">
                                  {act.productName}
                                </h5>
                                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 font-semibold">
                                  +{act.co2SavedKg} kg CO2e
                                </span>
                              </div>
                              {act.notes && (
                                <p className="text-xs text-brand-muted">
                                  {act.notes}
                                </p>
                              )}
                              <span className="text-[11px] text-brand-muted block">
                                Completed on {new Date(act.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-brand-border p-8 text-center">
                      <EmptyState
                        icon={History}
                        title="No Activities Logged Yet"
                        description="You haven't logged any completed circular activities. Whenever you repair, upcycle, donate, or rehome an item, log it to track your real ecological progress."
                        primaryAction={{
                          label: 'Log Your First Activity',
                          onClick: () => setIsLogActivityOpen(true),
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION 6: Profile Settings */}
            {/* ============================================================== */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-brand-border">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary">
                    Profile & Neighborhood Settings
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Update your display name, location for local marketplace pickup, and avatar.
                  </p>
                </div>

                <Card variant="bordered" className="p-6 bg-white border-brand-border max-w-2xl">
                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-brand-text mb-1.5">
                        Full Display Name *
                      </label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                      />
                    </div>

                    {/* Email (Readonly for security) */}
                    <div>
                      <label className="block text-xs font-semibold text-brand-text mb-1.5">
                        Registered Email
                      </label>
                      <Input
                        value={user?.email || profile?.email || ''}
                        disabled
                        className="bg-brand-bg text-brand-muted cursor-not-allowed"
                      />
                      <span className="text-[11px] text-brand-muted mt-1 block">
                        Account email is tied to authentication and protected against public disclosure.
                      </span>
                    </div>

                    {/* City & State for local trading */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-brand-text mb-1.5">
                          City
                        </label>
                        <Input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Seattle"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-brand-text mb-1.5">
                          State / Region
                        </label>
                        <Input
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="e.g. WA"
                        />
                      </div>
                    </div>

                    {/* Avatar URL */}
                    <div>
                      <label className="block text-xs font-semibold text-brand-text mb-1.5">
                        Profile Image URL
                      </label>
                      <Input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-100 flex items-start gap-2.5 text-xs text-brand-muted">
                      <ShieldCheck className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                      <p>
                        Your profile city and state help neighbors find local items for physical pickup and circular drop-offs.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-brand-border flex items-center justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={isSavingProfile}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
              </>
            )}
          </main>
        </div>
      </Container>

      {/* Edit Marketplace Listing Modal */}
      {editingListing && (
        <ListingFormModal
          isOpen={Boolean(editingListing)}
          onClose={() => setEditingListing(null)}
          onSubmit={handleSaveListingEdit}
          initialData={editingListing}
          mode="edit"
        />
      )}

      {/* Log Activity Modal */}
      <LogActivityModal
        isOpen={isLogActivityOpen}
        onClose={() => setIsLogActivityOpen(false)}
        onSubmit={handleLogActivity}
      />

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
