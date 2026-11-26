import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { CardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ActionBadge } from '@/components/common/Badge';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SpotlightCard } from '@/components/common/SpotlightCard';
import { CountUp } from '@/components/common/CountUp';
import { useAuth } from '@/contexts/AuthContext';
import {
  getEcoScoreActivities,
  recordEcoScoreActivity,
  deleteEcoScoreActivity,
  getEcoScoreSummary,
  EcoScoreActivity,
  EcoActivityType,
  EcoVerificationStatus,
  RecordActivityInput,
  MonthlyTrendData,
  EcoScoreTierInfo,
  VERIFICATION_LABELS,
} from '@/services/ecoScoreService';
import { RecordActivityModal } from '@/components/ecoscore/RecordActivityModal';
import { EcoScoreMethodologyModal } from '@/components/ecoscore/EcoScoreMethodologyModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Award,
  Plus,
  Scale,
  Leaf,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  Filter,
  X,
  Info,
} from 'lucide-react';

export const EcoScorePage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<EcoScoreActivity[]>([]);
  const [summary, setSummary] = useState<{
    totalPoints: number;
    totalActivitiesCount: number;
    totalEstimatedWeightKg: number;
    verifiedActivitiesCount: number;
    illustrativeTotalCo2Kg: number;
    tierInfo: EcoScoreTierInfo;
    monthlyTrends: MonthlyTrendData[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState<EcoActivityType | 'All'>('All');
  const [selectedVerification, setSelectedVerification] = useState<EcoVerificationStatus | 'All'>('All');

  const loadData = async () => {
    setLoading(true);
    try {
      const [acts, sum] = await Promise.all([
        getEcoScoreActivities(user?.id),
        getEcoScoreSummary(user?.id),
      ]);
      setActivities(acts);
      setSummary(sum);
    } catch (err) {
      console.error('Failed to load EcoScore data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRecordSubmit = async (data: RecordActivityInput) => {
    const created = await recordEcoScoreActivity(data, user?.id);
    setActivities((prev) => [created, ...prev]);
    // Refresh aggregate calculations
    const updatedSummary = await getEcoScoreSummary(user?.id);
    setSummary(updatedSummary);
    showToast(`Confirmed! Earned +${created.pointsEarned} EcoScore points for "${created.productName}".`);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!window.confirm('Delete this confirmed activity? Points will be adjusted accordingly.')) return;
    await deleteEcoScoreActivity(id, user?.id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
    const updatedSummary = await getEcoScoreSummary(user?.id);
    setSummary(updatedSummary);
    showToast('Activity removed and points updated.');
  };

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedType !== 'All' && act.activityType !== selectedType) return false;
      if (selectedVerification !== 'All' && act.verificationStatus !== selectedVerification) return false;
      return true;
    });
  }, [activities, selectedType, selectedVerification]);

  const tierInfo = summary?.tierInfo;

  return (
    <div className="py-8 sm:py-12 bg-brand-bg min-h-screen">
      <Container size="xl">
        {/* Editorial Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/80 mb-8">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/dashboard" className="hover:text-brand-primary transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="font-semibold text-brand-primary">EcoScore System</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMethodologyModalOpen(true)}
              leftIcon={<BookOpen className="w-3.5 h-3.5 text-brand-secondary" />}
              className="text-xs bg-white border-brand-border"
            >
              How Scores are Calculated
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRecordModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Record Completed Activity
            </Button>
          </div>
        </div>

        {/* Page Title & Subtitle */}
        <div className="max-w-3xl mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-semibold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Verified Circular Rewards & Transparency</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight leading-tight">
            ReUseHub EcoScore System
          </h1>

          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            Confirm your completed reuse, repair, upcycling, donation, and recycling activities to earn transparent points, advance circular tiers, and track physical waste diverted.
          </p>
        </div>

        {/* MANDATORY METHODOLOGY TRANSPARENCY BANNER */}
        <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-soft-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-50 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-brand-secondary" />
            </div>
            <div className="space-y-0.5">
              <strong className="text-sm text-brand-primary font-bold">
                Transparent Points Method & Verified Integrity
              </strong>
              <p className="text-xs text-brand-muted leading-relaxed">
                Points follow a documented circular waste hierarchy. We strictly distinguish between <strong>user-reported activities</strong>, <strong>verified proof</strong>, and <strong>illustrative lifecycle benchmarks</strong>.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMethodologyModalOpen(true)}
            className="text-xs shrink-0 border-brand-border bg-brand-bg hover:bg-forest-50 text-brand-text"
          >
            Review Full Scoring Rules
          </Button>
        </div>

        {/* HERO ECOSCORE SUMMARY & TIERS */}
        {loading || !summary ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <CardSkeleton className="md:col-span-2" />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Main Score & Tier Card (lg:col-span-6) */}
            <SpotlightCard
              spotlightColor="rgba(46, 125, 79, 0.22)"
              className="lg:col-span-6 p-6 sm:p-7 bg-white border border-brand-border flex flex-col justify-between space-y-6 shadow-soft-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                    Personal EcoScore
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-soft-xs ${tierInfo?.badgeColor}`}>
                    Level {tierInfo?.tierLevel}: {tierInfo?.tierName}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <div className="text-5xl sm:text-6xl font-display font-extrabold text-brand-primary tracking-tight">
                    <CountUp to={summary.totalPoints} duration={1.8} />
                  </div>
                  <span className="text-base sm:text-lg font-bold text-brand-secondary">
                    Total EcoPoints
                  </span>
                </div>

                {/* Progress Bar to Next Tier */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-brand-text">{tierInfo?.tierName}</span>
                    <span className="text-brand-muted">
                      {tierInfo?.nextTierName
                        ? `${tierInfo.pointsToNext} points to ${tierInfo.nextTierName}`
                        : 'Maximum Tier Achieved!'}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-brand-bg border border-brand-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-secondary to-emerald-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${tierInfo?.progressPercent || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                <span>Earned across {summary.totalActivitiesCount} confirmed activities</span>
                <span className="text-emerald-700 font-semibold">
                  {summary.verifiedActivitiesCount} Verified Handovers
                </span>
              </div>
            </SpotlightCard>

            {/* Metric 1: Physical Waste Diverted (lg:col-span-3) */}
            <SpotlightCard
              spotlightColor="rgba(20, 184, 166, 0.22)"
              className="lg:col-span-3 p-6 bg-white border border-brand-border flex flex-col justify-between space-y-3 shadow-soft-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Physical Waste Diverted
                </span>
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-brand-primary">
                  <CountUp to={summary.totalEstimatedWeightKg} decimals={1} duration={1.8} />
                  <span className="text-sm font-normal text-brand-muted ml-1">kg</span>
                </div>
                <p className="text-[11px] text-brand-muted mt-1 leading-snug">
                  User-estimated physical product mass preserved from municipal disposal streams.
                </p>
              </div>

              <div className="pt-3 border-t border-brand-border/60 text-[11px] text-teal-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Documented per-kg point scaling</span>
              </div>
            </SpotlightCard>

            {/* Metric 2: Illustrative LCA Carbon Benchmark (lg:col-span-3) */}
            <SpotlightCard
              spotlightColor="rgba(46, 125, 79, 0.22)"
              className="lg:col-span-3 p-6 bg-white border border-brand-border flex flex-col justify-between space-y-3 shadow-soft-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Illustrative LCA Offset
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-800">
                  ~<CountUp to={summary.illustrativeTotalCo2Kg} decimals={1} duration={2} />
                  <span className="text-sm font-normal text-brand-muted ml-1">kg CO2e</span>
                </div>
                <p className="text-[11px] text-brand-muted mt-1 leading-snug">
                  Estimated embodied lifecycle offset based on standard EPA WARM v15 circular factors.
                </p>
              </div>

              <div className="pt-3 border-t border-brand-border/60 text-[11px] text-stone-600 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Illustrative educational indicator</span>
              </div>
            </SpotlightCard>
          </div>
        )}

        {/* MONTHLY ACTIVITY TRENDS GRAPH */}
        {summary && summary.monthlyTrends.length > 0 && (
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-brand-border shadow-soft-sm mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-border/70">
              <div className="space-y-0.5">
                <h3 className="text-lg font-display font-bold text-brand-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-secondary" />
                  <span>Monthly Activity Trends & Score Progression</span>
                </h3>
                <p className="text-xs text-brand-muted">
                  Cumulative EcoScore points and confirmed circular actions over time.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-brand-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-brand-primary" />
                  <span>EcoPoints Growth</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Diverted Mass (kg)</span>
                </span>
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#234B35" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#234B35" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="points"
                    name="EcoScore Points"
                    stroke="#234B35"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="wasteKg"
                    name="Diverted Weight (kg)"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#wasteGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CONFIRMED ACTIVITY HISTORY FEED */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary">
                Activity History & Verified Audit Trail ({activities.length})
              </h2>
              <p className="text-xs text-brand-muted">
                Every logged action with transparent points, physical weight, and verification tier.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRecordModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs shrink-0"
            >
              Record New Activity
            </Button>
          </div>

          {/* Filters Bar: Action Type & Verification Status */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-brand-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-brand-text flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-brand-secondary" />
                Action:
              </span>
              {(['All', 'repair', 'upcycle', 'reuse', 'donate', 'recycle'] as (EcoActivityType | 'All')[]).map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setSelectedType(act)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                    selectedType === act
                      ? 'bg-brand-primary text-white shadow-soft-xs font-bold'
                      : 'bg-brand-bg text-brand-text hover:bg-forest-50 border border-brand-border'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-brand-text mr-1">Verification:</span>
              {(['All', 'user_reported', 'photo_verified', 'community_confirmed'] as (EcoVerificationStatus | 'All')[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVerification(v)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedVerification === v
                      ? 'bg-brand-secondary text-white font-bold'
                      : 'bg-brand-bg text-brand-muted hover:text-brand-text border border-brand-border'
                  }`}
                >
                  {v === 'All' ? 'All Tiers' : VERIFICATION_LABELS[v].label}
                </button>
              ))}
            </div>
          </div>

          {/* Activities List */}
          {filteredActivities.length > 0 ? (
            <div className="space-y-3">
              {filteredActivities.map((act) => {
                const verification = VERIFICATION_LABELS[act.verificationStatus];
                return (
                  <Card
                    key={act.id}
                    variant="bordered"
                    className="p-5 bg-white border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-secondary/40 transition-colors shadow-soft-xs"
                  >
                    <div className="flex items-start gap-4">
                      {act.proofImageUrl ? (
                        <ImageWithFallback
                          src={act.proofImageUrl}
                          alt={act.productName}
                          className="w-16 h-16 rounded-xl object-cover border border-brand-border shrink-0 bg-forest-50"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-forest-50 border border-brand-border flex items-center justify-center shrink-0 text-brand-primary">
                          <ActionBadge action={act.activityType} size="sm" showIcon={false} />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display font-bold text-base text-brand-primary leading-snug">
                            {act.productName}
                          </h4>

                          <ActionBadge action={act.activityType} size="sm" />

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${verification.badgeStyle}`}
                            title={verification.description}
                          >
                            {verification.label}
                          </span>
                        </div>

                        {act.notes && (
                          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                            "{act.notes}"
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted pt-1">
                          <span className="flex items-center gap-1 font-semibold text-brand-text">
                            <Scale className="w-3.5 h-3.5 text-brand-secondary" />
                            {act.estimatedWeightKg} kg Diverted
                          </span>
                          <span>•</span>
                          <span className="text-emerald-800 font-medium">
                            ~{act.illustrativeCo2Kg} kg CO2e illustrative LCA
                          </span>
                          <span>•</span>
                          <span>Confirmed on {act.confirmedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Points Pill & Action */}
                    <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border/60">
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-xl bg-forest-50 border border-forest-100 font-display font-extrabold text-base text-brand-primary block">
                          +{act.pointsEarned} pts
                        </span>
                        <span className="text-[10px] text-brand-muted block mt-0.5">
                          Base {act.basePoints} + Wt {act.weightPoints} + Bonus {act.verificationBonus}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        className="text-stone-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete activity record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-brand-border p-8 text-center">
              <EmptyState
                icon={Award}
                title="No Activities Match Your Filters"
                description="Try clearing your category or verification tier filters to view your activity history, or confirm a new circular action."
                primaryAction={{
                  label: 'Record Completed Activity',
                  onClick: () => setIsRecordModalOpen(true),
                }}
              />
            </div>
          )}
        </div>
      </Container>

      {/* Record Activity Modal */}
      <RecordActivityModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSubmit={handleRecordSubmit}
      />

      {/* Methodology & Transparency Modal */}
      <EcoScoreMethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />

      {/* Toast Notification */}
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
